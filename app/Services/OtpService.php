<?php

namespace App\Services;

use App\Models\OtpVerification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OtpService
{
    /**
     * Generate and send OTP to user.
     *
     * @return array{success: bool, otp?: string, error?: string}
     */
    public function generateAndSend(User $user, string $type = 'login'): array
    {
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
                // Send OTP via SMS
                $smsService = new SemaphoreSmsService;
                $message = "Your eDalawPlus OTP code is: {$otp}. Valid for 10 minutes. Do not share this code with anyone.";
                $result = $smsService->send($user->contact_number, $message);

                if (! $result['success']) {
                    Log::error('Failed to send OTP SMS', [
                        'user_id' => $user->id,
                        'error' => $result['error'] ?? 'Unknown error',
                    ]);
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
            // For login OTP, send via SMS
            if (! $user->contact_number) {
                return ['success' => false, 'error' => 'User does not have a contact number'];
            }

            $smsService = new SemaphoreSmsService;
            $message = "Your eDalawPlus OTP code is: {$otp}. Valid for 10 minutes. Do not share this code with anyone.";
            $result = $smsService->send($user->contact_number, $message);

            if (! $result['success']) {
                Log::error('Failed to send OTP SMS', [
                    'user_id' => $user->id,
                    'error' => $result['error'] ?? 'Unknown error',
                ]);
            }
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
