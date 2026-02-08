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
        if (! $this->apiKey) {
            Log::error('Semaphore API key not configured');

            return ['success' => false, 'error' => 'SMS service not configured'];
        }

        try {
            // Format phone number (remove + if present, ensure it starts with 0 or country code)
            $formattedNumber = $this->formatPhoneNumber($number);

            $response = Http::asForm()->post('https://api.semaphore.co/api/v4/messages', [
                'apikey' => $this->apiKey,
                'number' => $formattedNumber,
                'message' => $message,
                'sendername' => $this->senderName,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data[0]['message_id'])) {
                    Log::info('SMS sent successfully', [
                        'number' => $formattedNumber,
                        'message_id' => $data[0]['message_id'],
                    ]);

                    return ['success' => true, 'message' => 'SMS sent successfully'];
                }
            }

            Log::error('Failed to send SMS', [
                'number' => $formattedNumber,
                'response' => $response->body(),
            ]);

            return ['success' => false, 'error' => 'Failed to send SMS'];
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
