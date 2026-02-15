<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SemaphoreSmsService
{
    private string $apiKey;

    private string $senderName;

    public function __construct()
    {
        $this->apiKey = config('services.semaphore.api_key');
        $this->senderName = config('services.semaphore.sender_name');
    }

    /**
     * Send SMS message.
     *
     * @param  string  $number  Phone number (e.g., 09123456789)
     * @param  string  $message  Message content
     * @return array{success: bool, message?: string, error?: string}
     */
    public function send(string $number, string $message): array
    {
        return $this->sendToEndpoint('https://api.semaphore.co/api/v4/messages', $number, [
            'message' => $message,
        ]);
    }

    /**
     * Send OTP via Semaphore's dedicated OTP endpoint (improved delivery for OTP traffic).
     *
     * @param  string  $number  Phone number (e.g., 09123456789)
     * @param  string  $otp  The OTP code to send
     * @return array{success: bool, message?: string, error?: string}
     */
    public function sendOtp(string $number, string $otp): array
    {
        $message = 'Your eDalawPlus OTP code is: {otp}. Valid for 10 minutes. Do not share this code with anyone.';

        return $this->sendToEndpoint('https://api.semaphore.co/api/v4/otp', $number, [
            'message' => $message,
            'code' => $otp,
        ]);
    }

    /**
     * Send to a Semaphore API endpoint.
     *
     * @param  array<string, string>  $extraParams
     * @return array{success: bool, message?: string, error?: string}
     */
    private function sendToEndpoint(string $url, string $number, array $extraParams): array
    {
        if (! $this->apiKey) {
            Log::error('Semaphore API key not configured');

            return ['success' => false, 'error' => 'SMS service not configured'];
        }

        try {
            $formattedNumber = $this->formatPhoneNumber($number);

            $payload = array_merge([
                'apikey' => $this->apiKey,
                'number' => $formattedNumber,
                'sendername' => $this->senderName,
            ], $extraParams);

            $response = Http::asForm()->post($url, $payload);

            if ($response->successful()) {
                $data = $response->json();

                if (is_array($data) && isset($data[0]['message_id'])) {
                    Log::info('SMS sent successfully', [
                        'number' => $formattedNumber,
                        'message_id' => $data[0]['message_id'],
                    ]);

                    return ['success' => true, 'message' => 'SMS sent successfully'];
                }

                $errorMessage = is_array($data) && isset($data[0]['message'])
                    ? $data[0]['message']
                    : $response->body();
                Log::error('Semaphore API returned unexpected response', [
                    'number' => $formattedNumber,
                    'response' => $response->body(),
                ]);

                return ['success' => false, 'error' => $errorMessage ?: 'Failed to send SMS'];
            }

            $body = $response->body();
            $decoded = json_decode($body, true);
            $errorMessage = $decoded['message'] ?? $decoded['error'] ?? $body ?: 'Failed to send SMS';

            Log::error('Failed to send SMS', [
                'number' => $formattedNumber,
                'status' => $response->status(),
                'response' => $body,
            ]);

            return ['success' => false, 'error' => $errorMessage];
        } catch (\Exception $e) {
            Log::error('SMS sending exception', [
                'number' => $number,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Format phone number for Semaphore API.
     */
    private function formatPhoneNumber(string $number): string
    {
        // Remove all non-digit characters except +
        $number = preg_replace('/[^\d+]/', '', $number);

        // If starts with +, remove it (Semaphore expects format without +)
        if (str_starts_with($number, '+')) {
            $number = substr($number, 1);
        }

        // If starts with 63 (Philippines country code), keep as is
        // If starts with 0, keep as is
        // Otherwise, assume it's a local number and add 0 if needed
        if (! str_starts_with($number, '63') && ! str_starts_with($number, '0')) {
            $number = '0'.$number;
        }

        return $number;
    }
}
