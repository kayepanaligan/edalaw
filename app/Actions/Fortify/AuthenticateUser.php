<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Services\OtpService;
use App\Services\RecaptchaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Fortify;

class AuthenticateUser
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): ?User
    {
        $user = User::with('role')->where(Fortify::username(), $request->{Fortify::username()})->first();

        // Check if reCAPTCHA is configured (both site key and secret key must be non-empty)
        $recaptchaSiteKey = config('services.recaptcha.site_key');
        $recaptchaSecretKey = config('services.recaptcha.secret_key');
        $isRecaptchaConfigured = ! empty(trim((string) $recaptchaSiteKey)) && ! empty(trim((string) $recaptchaSecretKey));

        // For visitors, require reCAPTCHA verification before checking password (only if configured)
        if ($user && $user->role?->slug === 'visitor') {
            if ($isRecaptchaConfigured) {
                $allData = $request->all();

                // Get token from request. input() works for both JSON and form body in Laravel.
                $recaptchaToken = $request->input('recaptcha_token');
                if ($recaptchaToken === null || $recaptchaToken === '') {
                    $recaptchaToken = $request->json('recaptcha_token');
                }
                $recaptchaToken = $recaptchaToken ?: null;

                // Debug logging with more details
                \Illuminate\Support\Facades\Log::debug('reCAPTCHA token check for visitor login', [
                    'user_email' => $user->email,
                    'user_role' => $user->role?->slug,
                    'has_token' => ! empty($recaptchaToken),
                    'token_length' => $recaptchaToken ? strlen($recaptchaToken) : 0,
                    'token_preview' => $recaptchaToken ? substr($recaptchaToken, 0, 50).'...' : 'null',
                    'all_input_keys' => array_keys($allData),
                    'request_method' => $request->method(),
                    'content_type' => $request->header('Content-Type'),
                    'has_recaptcha_in_all' => $request->has('recaptcha_token'),
                    'recaptcha_token_in_all' => isset($allData['recaptcha_token']),
                    'all_data_keys' => array_keys($allData),
                ]);

                if (empty($recaptchaToken)) {
                    \Illuminate\Support\Facades\Log::error('reCAPTCHA token is empty for visitor login', [
                        'user_email' => $user->email,
                        'user_role' => $user->role?->slug,
                        'all_request_data_keys' => array_keys($allData),
                        'request_all' => $request->all(),
                        'request_input_all' => $request->input(),
                    ]);

                    Validator::make([], [
                        'recaptcha' => 'required',
                    ])->after(function ($validator) {
                        $validator->errors()->add('recaptcha', 'Please complete the reCAPTCHA verification.');
                    })->validate();
                }

                $recaptchaResult = RecaptchaService::verify($recaptchaToken, 'login', 0.5);

                \Illuminate\Support\Facades\Log::debug('reCAPTCHA verification result', [
                    'success' => $recaptchaResult['success'] ?? false,
                    'result' => $recaptchaResult,
                ]);

                if (! $recaptchaResult || ! $recaptchaResult['success']) {
                    \Illuminate\Support\Facades\Log::warning('reCAPTCHA verification failed', [
                        'user_email' => $user->email,
                        'result' => $recaptchaResult,
                    ]);

                    Validator::make([], [
                        'recaptcha' => 'required',
                    ])->after(function ($validator) {
                        $validator->errors()->add('recaptcha', 'reCAPTCHA verification failed. Please try again.');
                    })->validate();
                }
            } else {
                // Log warning if reCAPTCHA is not configured but required for visitors
                \Illuminate\Support\Facades\Log::warning('reCAPTCHA not configured but required for visitor login', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]);
            }
        }

        // Verify reCAPTCHA token for non-visitors (optional, only if configured)
        // Only verify if token is actually provided - don't require it for non-visitors
        if ($isRecaptchaConfigured && (! $user || $user->role?->slug !== 'visitor')) {
            $nonVisitorToken = $request->input('recaptcha_token') ?: $request->json('recaptcha_token') ?: null;

            // Only verify if token was provided (optional for non-visitors)
            if ($nonVisitorToken) {
                $recaptchaResult = RecaptchaService::verify($nonVisitorToken, 'login', 0.5);
                if (! $recaptchaResult || ! $recaptchaResult['success']) {
                    \Illuminate\Support\Facades\Log::warning('reCAPTCHA verification failed for non-visitor', [
                        'user_email' => $user?->email,
                        'user_role' => $user?->role?->slug,
                        'result' => $recaptchaResult,
                    ]);

                    Validator::make([], [
                        'recaptcha' => 'required',
                    ])->after(function ($validator) {
                        $validator->errors()->add('recaptcha', 'reCAPTCHA verification failed. Please try again.');
                    })->validate();
                }
            }
            // If no token provided for non-visitor, that's fine - reCAPTCHA is optional for them
        }

        if ($user && Hash::check($request->password, $user->password)) {
            // Check if user is a visitor - require OTP verification
            if ($user->role?->slug === 'visitor') {
                // Check if OTP is provided
                if ($request->filled('otp')) {
                    $otpService = new OtpService;
                    if ($otpService->verify($user, $request->otp, 'login')) {
                        return $user;
                    }

                    Validator::make([], [
                        'otp' => 'required',
                    ])->after(function ($validator) {
                        $validator->errors()->add('otp', 'Invalid or expired OTP. Please try again.');
                    })->validate();

                    return null;
                }

                // OTP not provided - generate and send OTP, store user ID in session
                $otpService = new OtpService;
                $result = $otpService->generateAndSend($user, 'login');

                if ($result['success']) {
                    Session::put('login.user_id', $user->id);
                    Session::put('login.requires_otp', true);

                    // Return null to prevent login, error will be handled by login view
                    return null;
                } else {
                    Validator::make([], [
                        'otp' => 'required',
                    ])->after(function ($validator) use ($result) {
                        $validator->errors()->add('otp', $result['error'] ?? 'Failed to send OTP. Please contact support.');
                    })->validate();
                }

                return null;
            }

            // Non-visitor users can login directly
            return $user;
        }

        return null;
    }
}
