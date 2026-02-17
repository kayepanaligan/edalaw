<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetOtpController extends Controller
{
    public const SESSION_USER_ID = 'password_reset_user_id';

    public const SESSION_VERIFIED = 'password_reset_verified';

    /**
     * Show forgot password form (enter email to receive OTP on contact number).
     */
    public function showForgotForm(Request $request): Response
    {
        return Inertia::render('auth/forgot-password-otp', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Send OTP to user's contact number. User identified by email.
     */
    public function sendOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return redirect()->back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'We could not find a user with that email address.']);
        }

        if (empty(trim((string) ($user->contact_number ?? '')))) {
            return redirect()->back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'No contact number on file for this account. Please contact support.']);
        }

        $otpService = new OtpService;
        $result = $otpService->generateAndSend($user, 'password_reset');

        if (! $result['success']) {
            return redirect()->back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => $result['error'] ?? 'Failed to send OTP. Please try again.']);
        }

        Session::put(self::SESSION_USER_ID, $user->id);

        return redirect()->route('password.verify-otp.show');
    }

    /**
     * Show verify OTP form.
     */
    public function showVerifyOtp(Request $request): Response|RedirectResponse
    {
        if (! $request->session()->has(self::SESSION_USER_ID)) {
            return redirect()->route('password.forgot.show');
        }

        return Inertia::render('auth/verify-otp-reset', []);
    }

    /**
     * Verify OTP and allow user to proceed to reset password.
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $userId = $request->session()->get(self::SESSION_USER_ID);
        if (! $userId) {
            return redirect()->route('password.forgot.show');
        }

        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $user = User::find($userId);
        if (! $user) {
            Session::forget([self::SESSION_USER_ID, self::SESSION_VERIFIED]);

            return redirect()->route('password.forgot.show');
        }

        $otpService = new OtpService;
        if (! $otpService->verify($user, $request->otp, 'password_reset')) {
            return redirect()->back()
                ->withErrors(['otp' => 'Invalid or expired OTP. Please try again or request a new code.']);
        }

        Session::put(self::SESSION_VERIFIED, true);

        return redirect()->route('password.reset.show');
    }

    /**
     * Show reset password form.
     */
    public function showResetForm(Request $request): Response|RedirectResponse
    {
        if (! $request->session()->has(self::SESSION_USER_ID) || ! $request->session()->get(self::SESSION_VERIFIED)) {
            return redirect()->route('password.forgot.show');
        }

        return Inertia::render('auth/reset-password-otp', []);
    }

    /**
     * Update password and logout all other sessions.
     */
    public function reset(Request $request): RedirectResponse
    {
        $userId = $request->session()->get(self::SESSION_USER_ID);
        $verified = $request->session()->get(self::SESSION_VERIFIED);
        if (! $userId || ! $verified) {
            return redirect()->route('password.forgot.show');
        }

        $request->validate([
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        $user = User::findOrFail($userId);

        $user->update(['password' => $request->password]);

        // Logout all sessions for this user (all devices)
        DB::table(config('session.table', 'sessions'))
            ->where('user_id', $user->id)
            ->delete();

        Session::forget([self::SESSION_USER_ID, self::SESSION_VERIFIED]);

        return redirect()->route('login')
            ->with('status', 'Your password has been reset. Please log in with your new password.');
    }
}
