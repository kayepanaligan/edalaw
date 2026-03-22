<?php

namespace App\Services;

use App\Exceptions\InsufficientSmsBalanceException;
use App\Models\OtpVerification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OtpService
{
    /**
     * Format phone number for Semaphore (Philippine mobile: 09XXXXXXXXX or 63XXXXXXXXX).
     */
    private static function formatPhoneNumber(string $number): string
    {
        $number = preg_replace('/[^\d+]/', '', $number);
        if (str_starts_with($number, '+')) {
            $number = substr($number, 1);
        }
        if (! str_starts_with($number, '63') && ! str_starts_with($number, '0')) {
            $number = '0'.$number;
        }

        return $number;
    }

    /**
     * Send OTP via Semaphore SMS API (messages endpoint).
     *
     * @return array{success: bool, error?: string}
     */
    private static function sendOtpSms(string $contactNumber, string $otp): array
    {
        $apiKey = config('services.semaphore.api_key');
        $senderName = config('services.semaphore.sender_name');

        if (! $apiKey) {
            Log::error('Semaphore API key not configured');

            return ['success' => false, 'error' => 'SMS service not configured'];
        }

        $message = "Your eDalawPlus OTP code is: {$otp}. Valid for 10 minutes. Do not share this code with anyone.";

        try {
            $response = Http::timeout(10)
                ->retry(2, 200)
                ->asForm()
                ->post('https://api.semaphore.co/api/v4/messages', [
                    'apikey' => $apiKey,
                    'number' => self::formatPhoneNumber($contactNumber),
                    'message' => $message,
                    'sendername' => $senderName ?? 'eDalawPlus',
                ]);
        } catch (ConnectionException $e) {
            Log::warning('Semaphore SMS connection failed (check PHP SSL/cURL CA bundle)', [
                'message' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Unable to send OTP. Please try again or contact support.'];
        } catch (RequestException $e) {
            // Handle HTTP errors (4xx/5xx responses)
            $response = $e->response;
            Log::error('Semaphore SMS failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            // Check for insufficient balance error
            $responseData = $response->json();
            $errorMessage = is_array($responseData) ? json_encode($responseData) : $response->body();
            
            if (str_contains($errorMessage, 'balance') && str_contains($errorMessage, 'not sufficient')) {
                throw new InsufficientSmsBalanceException('Insufficient SMS balance. Please add credits to your Semaphore account.');
            }

            return ['success' => false, 'error' => 'Failed to send OTP via SMS. Please try again.'];
        }

        if (! $response->successful()) {
            Log::error('Semaphore SMS failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            // Check for insufficient balance error
            $responseData = $response->json();
            $errorMessage = is_array($responseData) ? json_encode($responseData) : $response->body();
            
            if (str_contains($errorMessage, 'balance') && str_contains($errorMessage, 'not sufficient')) {
                throw new InsufficientSmsBalanceException('Insufficient SMS balance. Please add credits to your Semaphore account.');
            }

            return ['success' => false, 'error' => 'Failed to send OTP via SMS. Please try again.'];
        }

        $data = $response->json();
        if (is_array($data) && isset($data[0]['message_id'])) {
            Log::info('Semaphore SMS queued', [
                'message_id' => $data[0]['message_id'],
                'number' => self::formatPhoneNumber($contactNumber),
            ]);

            return ['success' => true];
        }

        $errMsg = is_array($data) && isset($data[0]['message'])
            ? $data[0]['message']
            : 'Failed to send OTP via SMS.';

        Log::error('Semaphore SMS unexpected response', [
            'body' => $response->body(),
        ]);

        return ['success' => false, 'error' => $errMsg];
    }

    /**
     * Generate and send OTP to user.
     *
     * @return array{success: bool, otp?: string, error?: string}
     */
    public function generateAndSend(User $user, string $type = 'login'): array
    {
        // For login, require contact number before creating or sending anything
        if ($type === 'login') {
            if (empty($user->contact_number) || ! trim((string) $user->contact_number)) {
                return ['success' => false, 'error' => 'No contact number on file. Please contact support to add your mobile number before logging in.'];
            }
        }

        // Generate 6-digit OTP
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Invalidate any existing unused OTPs for this user and type
        OtpVerification::where('user_id', $user->id)
            ->where('type', $type)
            ->where('is_used', false)
            ->update(['is_used' => true, 'used_at' => now()]);

        // Create new OTP verification
        $otpVerification = OtpVerification::create([
            'user_id' => $user->id,
            'otp' => $otp,
            'type' => $type,
            'expires_at' => Carbon::now()->addMinutes(10), // OTP expires in 10 minutes
            'is_used' => false,
        ]);

        // Send OTP based on type
        if ($type === 'email_verification' || $type === 'phone_verification') {
            if ($type === 'phone_verification' && $user->contact_number) {
                $result = self::sendOtpSms($user->contact_number, $otp);
                if (! $result['success']) {
                    Log::error('Failed to send OTP SMS', [
                        'user_id' => $user->id,
                        'error' => $result['error'] ?? 'Unknown error',
                    ]);

                    return ['success' => false, 'error' => $result['error'] ?? 'Failed to send OTP via SMS. Please try again or contact support.'];
                }
            } elseif ($type === 'email_verification' && $user->email) {
                // Send OTP via Email
                try {
                    \Illuminate\Support\Facades\Mail::raw(
                        "Your eDalawPlus OTP code is: {$otp}. Valid for 10 minutes. Do not share this code with anyone.",
                        function ($message) use ($user) {
                            $message->to($user->email)
                                ->subject('eDalawPlus - Email Verification OTP');
                        }
                    );
                } catch (\Exception $e) {
                    Log::error('Failed to send OTP Email', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            } else {
                return ['success' => false, 'error' => 'User does not have required contact information'];
            }
        } else {
            // For login or password_reset OTP, send via Semaphore SMS
            if (! $user->contact_number) {
                return ['success' => false, 'error' => 'No contact number on file. Please contact support to add your mobile number.'];
            }

            $result = self::sendOtpSms($user->contact_number, $otp);
            if (! $result['success']) {
                Log::error('Failed to send OTP SMS', [
                    'user_id' => $user->id,
                    'error' => $result['error'] ?? 'Unknown error',
                ]);
                $otpVerification->update(['is_used' => true, 'used_at' => now()]);

                return ['success' => false, 'error' => $result['error'] ?? 'Failed to send OTP via SMS. Please try again or contact support.'];
            }
        }

        return ['success' => true, 'otp' => $otp];
    }

    /**
     * Generate and send a registration OTP to both email and SMS (if contact number exists).
     *
     * @return array{success: bool, otp?: string, error?: string}
     */
    public function generateAndSendRegistration(User $user): array
    {
        $mailer = (string) config('mail.default', 'log');
        $semaphoreApiKey = (string) config('services.semaphore.api_key', '');

        // Generate 6-digit OTP
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Invalidate any existing unused OTPs for this user and type
        OtpVerification::where('user_id', $user->id)
            ->where('type', 'registration')
            ->where('is_used', false)
            ->update(['is_used' => true, 'used_at' => now()]);

        OtpVerification::create([
            'user_id' => $user->id,
            'otp' => $otp,
            'type' => 'registration',
            'expires_at' => Carbon::now()->addMinutes(10),
            'is_used' => false,
        ]);

        $emailSent = false;
        $smsSent = false;
        $errors = [];

        $canSendEmail = ! empty($user->email) && $mailer !== 'log';
        $canSendSms = ! empty($user->contact_number) && ! empty($semaphoreApiKey);

        if (! $canSendEmail && ! $canSendSms) {
            if (empty($user->email)) {
                $errors[] = 'Missing email address.';
            }
            if (empty($user->contact_number)) {
                $errors[] = 'Missing contact number.';
            }
            if ($mailer === 'log') {
                $errors[] = 'Email is not configured (MAIL_MAILER is set to log).';
            }
            if (empty($semaphoreApiKey)) {
                $errors[] = 'SMS is not configured (SEMAPHORE_API_KEY missing).';
            }

            return [
                'success' => false,
                'error' => 'Unable to deliver OTP. '.implode(' ', $errors),
            ];
        }

        if ($canSendEmail) {
            try {
                \Illuminate\Support\Facades\Mail::raw(
                    "Your eDalawPlus OTP code is: {$otp}. Valid for 10 minutes. Do not share this code with anyone.",
                    function ($message) use ($user) {
                        $message->to($user->email)
                            ->subject('eDalawPlus - Registration OTP');
                    }
                );
                $emailSent = true;
            } catch (\Exception $e) {
                Log::error('Failed to send registration OTP Email', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
                $errors[] = 'Failed to send OTP via email.';
            }
        }

        if ($canSendSms) {
            $result = self::sendOtpSms($user->contact_number, $otp);
            if (! $result['success']) {
                Log::error('Failed to send registration OTP SMS', [
                    'user_id' => $user->id,
                    'error' => $result['error'] ?? 'Unknown error',
                ]);
                $errors[] = $result['error'] ?? 'Failed to send OTP via SMS. Please try again.';
            } else {
                $smsSent = true;
            }
        }

        if (! $emailSent && ! $smsSent) {
            return [
                'success' => false,
                'error' => ! empty($errors) ? implode(' ', $errors) : 'Failed to send OTP. Please try again.',
            ];
        }

        return ['success' => true, 'otp' => $otp];
    }

    /**
     * Verify OTP.
     */
    public function verify(User $user, string $otp, string $type = 'login'): bool
    {
        $otpVerification = OtpVerification::where('user_id', $user->id)
            ->where('otp', $otp)
            ->where('type', $type)
            ->where('is_used', false)
            ->latest()
            ->first();

        if (! $otpVerification || ! $otpVerification->isValid()) {
            return false;
        }

        // Mark OTP as used
        $otpVerification->update([
            'is_used' => true,
            'used_at' => now(),
        ]);

        return true;
    }

    /**
     * Check if user has a valid pending OTP.
     */
    public function hasValidOtp(User $user, string $type = 'login'): bool
    {
        return OtpVerification::where('user_id', $user->id)
            ->where('type', $type)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->exists();
    }
}
