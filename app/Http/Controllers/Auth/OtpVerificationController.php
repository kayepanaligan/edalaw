<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class OtpVerificationController extends Controller
{
    /**
     * Show the OTP verification page.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $userId = Session::get('login.user_id');

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = User::find($userId);

        if (! $user) {
            Session::forget(['login.user_id', 'login.requires_otp', 'login.remember']);

            return redirect()->route('login');
        }

        return Inertia::render('auth/otp-verification', [
            'email' => $user->email,
            'contact_number' => $user->contact_number ? substr_replace($user->contact_number, '****', -4) : null,
        ]);
    }

    /**
     * Verify OTP and complete login.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $userId = Session::get('login.user_id');

        if (! $userId) {
            return redirect()->route('login')
                ->withErrors(['otp' => 'Session expired. Please login again.']);
        }

        $user = User::find($userId);

        if (! $user) {
            Session::forget(['login.user_id', 'login.requires_otp', 'login.remember']);

            return redirect()->route('login')
                ->withErrors(['otp' => 'User not found. Please login again.']);
        }

        $otpService = new OtpService;

        if (! $otpService->verify($user, $request->otp, 'login')) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP. Please try again.']);
        }

        // Clear OTP session and capture remember before forget
        $remember = Session::get('login.remember', $request->boolean('remember'));
        Session::forget(['login.user_id', 'login.requires_otp', 'login.remember']);

        // Login the user (honor remember from initial login)
        Auth::login($user, $remember);

        $user->load('role');
        if (strtolower((string) $user->role?->slug) === 'visitor') {
            return redirect()->intended(route('dashboard.visitor'));
        }

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Resend OTP.
     */
    public function resend(Request $request): RedirectResponse
    {
        $userId = Session::get('login.user_id');

        if (! $userId) {
            return redirect()->route('login')
                ->withErrors(['otp' => 'Session expired. Please login again.']);
        }

        $user = User::find($userId);

        if (! $user) {
            Session::forget(['login.user_id', 'login.requires_otp', 'login.remember']);

            return redirect()->route('login')
                ->withErrors(['otp' => 'User not found. Please login again.']);
        }

        $otpService = new OtpService;
        $result = $otpService->generateAndSend($user, 'login');

        if ($result['success']) {
            return back()->with('success', 'OTP has been resent to your contact number.');
        }

        return back()->withErrors(['otp' => $result['error'] ?? 'Failed to resend OTP. Please try again.']);
    }
}
