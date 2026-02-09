<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecaptchaService
{
    /**
     * Verify reCAPTCHA v2 or v3 token.
     *
     * @return array{success: bool, score: float, action: string, challenge_ts: string, hostname: string}|null
     */
    public static function verify(string $token, string $action = 'submit', float $minScore = 0.5): ?array
    {
        $secretKey = config('services.recaptcha.secret_key');
        $verifyUrl = config('services.recaptcha.verify_url');

        if (! $secretKey || ! $verifyUrl) {
            Log::warning('reCAPTCHA secret key or verify URL not configured.');

            return null;
        }

        try {
            $response = Http::asForm()->post($verifyUrl, [
                'secret' => $secretKey,
                'response' => $token,
                'remoteip' => request()->ip(),
            ]);

            if (! $response->successful()) {
                Log::warning('reCAPTCHA verification request failed.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return null;
            }

            $data = $response->json();

            if (! isset($data['success']) || ! $data['success']) {
                Log::warning('reCAPTCHA verification failed.', [
                    'error_codes' => $data['error-codes'] ?? [],
                    'response_data' => $data,
                ]);

                return [
                    'success' => false,
                    'score' => 0.0,
                    'action' => $action,
                    'challenge_ts' => $data['challenge_ts'] ?? '',
                    'hostname' => $data['hostname'] ?? '',
                    'error_codes' => $data['error-codes'] ?? [],
                ];
            }

            // reCAPTCHA v2 doesn't return score or action
            $score = $data['score'] ?? null;
            $verifiedAction = $data['action'] ?? '';

            // If score is null, this is v2 - just return success
            if ($score === null) {
                return [
                    'success' => true,
                    'score' => 1.0,
                    'action' => $action,
                    'challenge_ts' => $data['challenge_ts'] ?? '',
                    'hostname' => $data['hostname'] ?? '',
                ];
            }

            // For v3, verify action matches
            if ($verifiedAction !== $action) {
                Log::warning('reCAPTCHA action mismatch.', [
                    'expected' => $action,
                    'received' => $verifiedAction,
                ]);

                return [
                    'success' => false,
                    'score' => $score,
                    'action' => $verifiedAction,
                    'challenge_ts' => $data['challenge_ts'] ?? '',
                    'hostname' => $data['hostname'] ?? '',
                ];
            }

            // Check score threshold for v3
            if ($score < $minScore) {
                Log::warning('reCAPTCHA score below threshold.', [
                    'score' => $score,
                    'min_score' => $minScore,
                ]);

                return [
                    'success' => false,
                    'score' => $score,
                    'action' => $verifiedAction,
                    'challenge_ts' => $data['challenge_ts'] ?? '',
                    'hostname' => $data['hostname'] ?? '',
                ];
            }

            return [
                'success' => true,
                'score' => $score,
                'action' => $verifiedAction,
                'challenge_ts' => $data['challenge_ts'] ?? '',
                'hostname' => $data['hostname'] ?? '',
            ];
        } catch (\Throwable $e) {
            Log::error('reCAPTCHA verification exception: '.$e->getMessage(), [
                'exception' => $e,
            ]);

            return null;
        }
    }
}
