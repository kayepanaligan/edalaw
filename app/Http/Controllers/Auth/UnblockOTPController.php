<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\OtpVerification;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class UnblockOTPController extends Controller
{
    /**
     * Display the unblock OTP verification page.
     */
    public function show(Request $request): Response
    {
        $email = $request->query('email', session('unblock_email'));
        
        if (!$email) {
            return Inertia::render('auth/UnblockOTP', [
                'email' => null,
                'sentAt' => null,
                'errors' => [],
                'success' => null,
            ]);
        }

        // Store email in session for subsequent requests
        session(['unblock_email' => $email]);

        // Auto-send OTP on first load if not already sent
        if (!session('otp_sent_at')) {
            $user = User::where('email', $email)->first();
            
            if ($user) {
                $otpService = new OtpService();
                $result = $otpService->generateAndSend($user, 'unblock');
                
                if ($result['success']) {
                    session(['otp_sent_at' => now()]);
                } else {
                    Log::error('Failed to send unblock OTP', [
                        'email' => $email,
                        'error' => $result['error'] ?? 'Unknown error',
                        'contact_number' => $user->contact_number,
                    ]);
                }
            }
        }

        return Inertia::render('auth/UnblockOTP', [
            'email' => $email,
            'sentAt' => session('otp_sent_at'),
            'errors' => [],
            'success' => session('otp_sent_at') ? 'OTP sent to your contact number. Please enter the code to unblock your account.' : null,
        ]);
    }

    /**
     * Send OTP for unblocking account.
     */
    public function sendOTP(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            Log::error('Unblock OTP - User not found', ['email' => $request->email]);
            return back()->withErrors(['email' => 'User not found.']);
        }

        // Check cooldown period (2 minutes)
        $lastOtp = OtpVerification::where('user_id', $user->id)
            ->where('type', 'unblock')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($lastOtp && $lastOtp->created_at->gt(now()->subMinutes(2))) {
            $waitTime = ceil($lastOtp->created_at->diffInSeconds(now()->addMinutes(2)));
            Log::info('Unblock OTP - Cooldown active', [
                'email' => $request->email,
                'wait_time' => $waitTime,
            ]);
            return back()->withErrors(['email' => "Please wait {$waitTime} seconds before requesting a new OTP."]);
        }

        Log::info('Unblock OTP - Sending', [
            'email' => $request->email,
            'contact_number' => $user->contact_number,
        ]);

        // Generate and send OTP
        $otpService = new OtpService();
        $result = $otpService->generateAndSend($user, 'unblock');

        if (!$result['success']) {
            Log::error('Unblock OTP - Failed to send', [
                'email' => $request->email,
                'error' => $result['error'] ?? 'Unknown error',
            ]);
            return back()->withErrors(['email' => $result['error'] ?? 'Failed to send OTP. Please try again.']);
        }

        Log::info('Unblock OTP - Sent successfully', ['email' => $request->email]);

        // Store email in session for verification
        session([
            'unblock_email' => $user->email,
            'otp_sent_at' => now(),
        ]);

        return back()->with('success', 'OTP sent to your contact number. Please enter the code to unblock your account.');
    }

    /**
     * Resend OTP for unblocking account.
     */
    public function resendOTP(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['email' => 'User not found.']);
        }

        // Check cooldown period (2 minutes)
        $lastOtp = OtpVerification::where('user_id', $user->id)
            ->where('type', 'unblock')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($lastOtp && $lastOtp->created_at->gt(now()->subMinutes(2))) {
            $waitTime = ceil($lastOtp->created_at->diffInSeconds(now()->addMinutes(2)));
            return back()->withErrors(['email' => "Please wait {$waitTime} seconds before requesting a new OTP."]);
        }

        // Generate and send new OTP
        $otpService = new OtpService();
        $result = $otpService->generateAndSend($user, 'unblock');

        if (!$result['success']) {
            return back()->withErrors(['email' => $result['error'] ?? 'Failed to send OTP. Please try again.']);
        }

        session(['otp_sent_at' => now()]);

        return back()->with('success', 'New OTP sent to your contact number.');
    }

    /**
     * Verify OTP and unblock account.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return redirect()->route('login')
                ->withErrors(['email' => 'User not found.']);
        }

        $otpService = new OtpService();
        $isValid = $otpService->verify($user, $request->otp, 'unblock');

        if (!$isValid) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP. Please try again.']);
        }

        // Clear the unblock session
        session()->forget('unblock_email');
        session()->forget('otp_sent_at');

        // Terminate all other sessions for this user (enforce one-device-one-session)
        $currentSessionId = $request->session()->getId();
        \DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', '!=', $currentSessionId)
            ->delete();

        // Log the user in directly (this will create a new session)
        auth()->login($user);

        // Regenerate session to prevent fixation attacks
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'))
            ->with('success', 'Account unblocked successfully. You are now logged in and other sessions have been terminated.');
    }
}
