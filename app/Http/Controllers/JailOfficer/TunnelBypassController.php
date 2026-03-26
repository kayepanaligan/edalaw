<?php

namespace App\Http\Controllers\JailOfficer;

use App\Http\Controllers\Controller;
use App\Models\InmateTunnel;
use App\Models\SystemLog;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TunnelBypassController extends Controller
{
    /**
     * Show bypass form for tunnel already used.
     */
    public function showBypassForm(Request $request)
    {
        $token = $request->input('token');
        
        if (!$token) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['token' => 'No tunnel code provided.']);
        }
        
        $tunnel = InmateTunnel::where('tunnel_token', $token)->first();
        
        if (!$tunnel) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['token' => 'Invalid tunnel code.']);
        }
        
        // Get the session and assigned jail officer (monitor)
        $session = $tunnel->visitSession;
        $jailOfficer = $session?->monitor;  // Use 'monitor' relationship (references User via monitor_id)
        
        // If no jail officer assigned or no contact number, cannot proceed
        if (!$jailOfficer || !$jailOfficer->contact_number) {
            return redirect()->route('inmate.tunnel-already-used', ['token' => $token])
                ->with('error', 'No jail officer assigned to this session. Cannot send bypass code.');
        }
        
        // Generate and send OTP via SMS
        $otpService = new OtpService;
        $result = $otpService->generateAndSend($jailOfficer, 'tunnel_bypass_verification');
        
        if ($result['success']) {
            // Log the OTP notification
            SystemLog::create([
                'visit_session_id' => $session->id,
                'action' => 'tunnel_bypass_otp_sent',
                'performed_by' => auth()->id(),
                'metadata' => [
                    'jail_officer_id' => $jailOfficer->id,
                    'jail_officer_name' => $jailOfficer->full_name,
                    'jail_officer_contact' => $jailOfficer->contact_number,
                    'tunnel_token' => $token,
                    'message' => 'OTP sent for tunnel bypass verification',
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ],
            ]);
            
            session(['tunnel_bypass_token' => $token]);
        } else {
            return redirect()->route('inmate.tunnel-already-used', ['token' => $token])
                ->with('error', 'Failed to send bypass code. Please try again or contact support.');
        }
        
        return view('jail-officer.tunnel-bypass', [
            'token' => $token,
            'tunnel' => $tunnel,
            'jailOfficer' => $jailOfficer,
            'otpSent' => true,
        ]);
    }

    /**
     * Verify OTP and process bypass.
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'otp' => ['required', 'string', 'size:6'],
        ], [
            'otp.size' => 'OTP must be 6 digits.',
        ]);

        $token = $request->input('token');
        $otp = $request->input('otp');

        // Get tunnel and session
        $tunnel = InmateTunnel::where('tunnel_token', $token)->first();
        
        if (!$tunnel) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['token' => 'Invalid tunnel code.']);
        }

        $session = $tunnel->visitSession;
        $jailOfficer = $session->monitor;  // Use 'monitor' relationship (references User via monitor_id)

        if (!$jailOfficer) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['token' => 'No jail officer assigned to this session.']);
        }

        // Verify OTP
        $otpService = new OtpService;
        $isValid = $otpService->verify($jailOfficer, $otp, 'tunnel_bypass_verification');

        if (!$isValid) {
            // Log failed attempt for security monitoring
            SystemLog::create([
                'visit_session_id' => $session->id,
                'action' => 'tunnel_bypass_otp_failed',
                'performed_by' => null,
                'metadata' => [
                    'jail_officer_id' => $jailOfficer->id,
                    'jail_officer_name' => $jailOfficer->full_name,
                    'tunnel_token' => $token,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'reason' => 'Invalid or expired OTP',
                ],
            ]);
            
            return back()->withErrors(['otp' => 'Invalid or expired OTP. Please request a new code.']);
        }

        // OTP verified - proceed with bypass
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();
        
        return DB::transaction(function () use ($token, $tunnel, $session, $ipAddress, $userAgent) {
            // Reset the tunnel to unused state
            $tunnel->update([
                'is_used' => false,
            ]);

            // Reset inmate_joined_at if it was set
            if ($session->inmate_joined_at) {
                $session->update([
                    'inmate_joined_at' => null,
                ]);
            }

            // Log the bypass action
            SystemLog::create([
                'visit_session_id' => $session->id,
                'action' => 'tunnel_bypass_completed',
                'performed_by' => auth()->id(),
                'metadata' => [
                    'tunnel_token' => $token,
                    'previous_state' => 'used',
                    'new_state' => 'unused',
                    'verification_method' => 'sms_otp',
                    'ip_address' => $ipAddress,
                    'user_agent' => $userAgent,
                ],
            ]);

            // Clear session data
            session()->forget('tunnel_bypass_token');

            // Set session flag to allow re-entry through middleware
            session(['otp_verified' => true]);

            // Redirect to inmate join page (NOT to tunnel-already-used page)
            // This allows the PDL to directly access the video room
            return redirect()->route('inmate.join', ['token' => $token])
                ->with('success', 'Identity verified. You may now join the session.');
        });
    }

    /**
     * Resend OTP for bypass verification.
     */
    public function resendOtp(Request $request): RedirectResponse
    {
        $token = $request->input('token');
        
        $tunnel = InmateTunnel::where('tunnel_token', $token)->first();
        
        if (!$tunnel) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['token' => 'Invalid tunnel code.']);
        }

        $session = $tunnel->visitSession;
        $jailOfficer = $session->monitor;  // Use 'monitor' relationship (references User via monitor_id)

        if (!$jailOfficer || !$jailOfficer->contact_number) {
            return back()->withErrors(['resend' => 'Jail officer contact information not available.']);
        }

        // Resend OTP
        $otpService = new OtpService;
        $result = $otpService->generateAndSend($jailOfficer, 'tunnel_bypass_verification');

        if ($result['success']) {
            // Log the resend
            SystemLog::create([
                'visit_session_id' => $session->id,
                'action' => 'tunnel_bypass_otp_resent',
                'performed_by' => auth()->id(),
                'metadata' => [
                    'jail_officer_id' => $jailOfficer->id,
                    'jail_officer_name' => $jailOfficer->full_name,
                    'tunnel_token' => $token,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ],
            ]);
            
            return back()->with('success', 'Bypass code has been resent to the jail officer.');
        }

        return back()->withErrors(['resend' => 'Failed to resend bypass code. Please try again.']);
    }
}
