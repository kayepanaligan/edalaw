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
        // Verify reCAPTCHA token
        if ($request->filled('recaptcha_token')) {
            $recaptchaResult = RecaptchaService::verify($request->recaptcha_token, 'login', 0.5);
            if (! $recaptchaResult || ! $recaptchaResult['success']) {
                Validator::make([], [
                    'recaptcha' => 'required',
                ])->after(function ($validator) {
                    $validator->errors()->add('recaptcha', 'reCAPTCHA verification failed. Please try again.');
                })->validate();
            }
        }

        $user = User::with('role')->where(Fortify::username(), $request->{Fortify::username()})->first();

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
