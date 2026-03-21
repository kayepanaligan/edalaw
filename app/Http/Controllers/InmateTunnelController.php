<?php

namespace App\Http\Controllers;

use App\Events\VisitSessionMessageFlagged;
use App\Events\VisitSessionMessageSent;
use App\Models\ChatLog;
use App\Models\InmateTunnel;
use App\Models\SystemLog;
use App\Services\VideoSdkService;
use App\Services\VisitSessionRecordingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;

class InmateTunnelController extends Controller
{
    /**
     * Show the inmate tunnel entry form (no auth). From login page, inmate enters token or full join URL.
     */
    public function showEnterToken(Request $request): Response
    {
        return Inertia::render('Inmate/EnterTunnelToken', [
            'verifyUrl' => route('inmate.verify-token'),
            'csrfToken' => csrf_token(),
        ]);
    }

    /**
     * Verify tunnel token/URL and redirect to join page (no auth).
     */
    public function verifyToken(Request $request): RedirectResponse
    {
        $request->validate([
            'token_or_url' => ['required', 'string', 'max:2048'],
        ], [
            'token_or_url.required' => 'Please enter the inmate tunnel code.',
        ]);

        $input = trim($request->input('token_or_url'));
        $token = $this->resolveTunnelToken($input);

        if (! $token) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['token_or_url' => 'The code you entered is invalid. Enter the 8-character code you received.']);
        }

        $tunnel = InmateTunnel::where('tunnel_token', $token)->first();
        if (! $tunnel) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['token_or_url' => 'Invalid or expired link.']);
        }
        if ($tunnel->expires_at->isPast()) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['token_or_url' => 'This code has expired.']);
        }

        return redirect()->route('inmate.join', ['token' => $tunnel->tunnel_token]);
    }

    /**
     * Resolve tunnel token from user input: 8-char short code, full URL, or raw tunnel token.
     */
    private function resolveTunnelToken(string $input): ?string
    {
        $input = trim($input);
        if ($input === '') {
            return null;
        }
        $upper = strtoupper($input);
        if (strlen($upper) === 8 && ctype_alnum($upper)) {
            $tunnel = InmateTunnel::where('short_code', $upper)->first();

            return $tunnel ? $tunnel->tunnel_token : null;
        }
        if (str_contains($input, 'inmate/join/')) {
            $parts = explode('inmate/join/', $input);
            $after = end($parts);
            $token = trim(explode('?', $after)[0]);
            if ($token !== '') {
                return $token;
            }
        }

        return $input;
    }

    /**
     * Public page: inmate joins via tunnel token (no auth). Validate and show video room.
     */
    public function join(Request $request, string $token): View|RedirectResponse
    {
        return DB::transaction(function () use ($token) {
            // Lock the tunnel record to prevent race conditions
            $tunnel = InmateTunnel::where('tunnel_token', $token)->lockForUpdate()->first();
            
            if (!$tunnel) {
                abort(404, 'Invalid or expired link.');
            }
            
            // Check if tunnel has already been used
            if ($tunnel->is_used) {
                return redirect()->route('inmate.tunnel-already-used');
            }
            
            if (!$tunnel->isValid()) {
                abort(404, 'This link has expired or has already been used.');
            }

            $session = $tunnel->visitSession;
            
            // Refresh session data to get latest state
            $session->refresh();
            
            // Use cache to prevent race conditions - atomic lock for 30 seconds
            $cacheKey = "inmate_joining_session_{$session->id}";
            $lockAcquired = cache()->add($cacheKey, true, 30); // 30 seconds lock
            
            if (!$lockAcquired) {
                // Someone else is trying to join this session right now
                // Mark tunnel as used to be safe
                $tunnel->update(['is_used' => true]);
                return redirect()->route('inmate.tunnel-already-used');
            }
            
            // Check if inmate has already joined this session (prevent duplicate entries)
            // If inmate_joined_at is set, someone is already in the call using this tunnel
            if ($session->inmate_joined_at) {
                // Mark tunnel as used to prevent further attempts
                $tunnel->update(['is_used' => true]);
                return redirect()->route('inmate.tunnel-already-used');
            }
            
            // Additional check: verify if visitor is already in the room
            // If visitor has joined but inmate hasn't, this is the first inmate
            // If both visitor and inmate have joined, block this attempt
            if ($session->visitor_joined_at && $session->inmate_joined_at) {
                $tunnel->update(['is_used' => true]);
                return redirect()->route('inmate.tunnel-already-used');
            }
            
            // Don't mark as used yet - only mark when inmate actually joins the call
            // This prevents the issue where tunnel shows as used even if inmate hasn't entered
            
            // For virtual visits with assigned jail officer, require OTP verification FIRST
            if ($session->visit_type === 'virtual' && $session->jail_officer_id) {
                // Generate OTP and send to jail officer
                $otpService = new \App\Services\OtpService;
                $jailOfficer = $session->jailOfficer;
                
                if ($jailOfficer && $jailOfficer->contact_number) {
                    // Store tunnel token in session for later use
                    session(['inmate_tunnel_token' => $token]);
                    
                    // Generate and send OTP
                    $result = $otpService->generateAndSend($jailOfficer, 'inmate_tunnel_verification');
                    
                    if ($result['success']) {
                        // Notify jail officer about incoming inmate
                        \App\Models\SystemLog::create([
                            'visit_session_id' => $session->id,
                            'action' => 'inmate_tunnel_otp_sent',
                            'performed_by' => null,
                            'metadata' => [
                                'jail_officer_id' => $jailOfficer->id,
                                'jail_officer_name' => $jailOfficer->full_name,
                                'message' => 'OTP sent for inmate tunnel access',
                                'scheduled_start' => $session->scheduled_start?->toIso8601String(),
                            ],
                        ]);
                        
                        // Release lock and redirect to OTP verification page
                        cache()->forget($cacheKey);
                        return redirect()->route('inmate.tunnel-otp-verify.show', ['token' => $token]);
                    } else {
                        // OTP sending failed - release lock and show error
                        cache()->forget($cacheKey);
                        abort(500, 'Failed to send OTP to jail officer. Please try again or contact support.');
                    }
                } else {
                    // No jail officer contact available
                    cache()->forget($cacheKey);
                    abort(400, 'Jail officer contact information not available. Cannot proceed with verification.');
                }
            }

            // If NOT a virtual visit with JO (e.g., eBürol or no JO assigned), proceed based on schedule
            // Check if session is within schedule
            if (!$session->isWithinSchedule()) {
                // Release the lock since we're not letting them join
                cache()->forget($cacheKey);
                
                $tz = config('app.timezone');
                $now = now($tz);
                $start = $session->scheduled_start->copy()->setTimezone($tz);
                $end = $session->scheduled_end->copy()->setTimezone($tz);
                $scheduleWindow = $start->format('M j, Y').', '.$start->format('g:i A').' – '.$end->format('g:i A');
                
                $timeUntilActive = null;
                if ($now->isBefore($start)) {
                    $diff = $now->diff($start);
                    $parts = [];
                    if ($diff->d > 0) {
                        $parts[] = $diff->d.' '.str('day')->plural($diff->d);
                    }
                    if ($diff->h > 0) {
                        $parts[] = $diff->h.' '.str('hour')->plural($diff->h);
                    }
                    if ($diff->i > 0 && count($parts) < 2) {
                        $parts[] = $diff->i.' '.str('minute')->plural($diff->i);
                    }
                    $timeUntilActive = count($parts) > 0 ? implode(' ', $parts) : 'less than a minute';
                }

                return view('visitor.video-room-not-started', [
                    'title' => 'Session not started yet',
                    'schedule_window' => $scheduleWindow,
                    'time_until_active' => $timeUntilActive,
                    'session_id' => $session->id,
                    'session' => $session, // Pass the session object for the countdown timer
                ]);
            }
            
            if ($session->isCompleted()) {
                // Release the lock
                cache()->forget($cacheKey);
                
                return view('visitor.video-room-ended', [
                    'title' => 'Session ended',
                    'message' => 'This session has ended.',
                    'session_id' => $session->id,
                ]);
            }

            // Use the same Blade video-room view as visitors and jail officers
            return view('visitor.video-room', [
                'session' => $session,
                'room_id' => $session->room_id,
                'participant_name' => 'Inmate',
                'participant_id' => 'inmate-'.$session->id.'-'.uniqid(),
                'is_observer' => false,
                'scheduled_end' => $session->scheduled_end?->format('Y-m-d H:i:s'),
                'tunnel' => $tunnel, // Pass tunnel so we can mark it used after joining
            ]);
        });
    }

    /**
     * Show OTP verification page for inmate tunnel.
     */
    public function showOtpVerification(string $token): Response
    {
        // Verify tunnel is valid before showing OTP page
        $tunnel = InmateTunnel::where('tunnel_token', $token)->first();
        
        if (!$tunnel || !$tunnel->isValid() || $tunnel->is_used) {
            abort(404, 'Invalid or expired tunnel code.');
        }
        
        return Inertia::render('Inmate/TunnelOtpVerification', [
            'tunnelToken' => $token,
            'verifyUrl' => route('inmate.tunnel-otp-verify'),
        ]);
    }

    /**
     * Verify OTP for inmate tunnel access.
     */
    public function verifyOtp(Request $request, string $token): RedirectResponse
    {
        $request->validate([
            'otp' => ['required', 'string', 'size' => 6],
        ], [
            'otp.required' => 'Please enter the 6-digit OTP code.',
            'otp.size' => 'OTP must be 6 digits.',
        ]);

        // Get tunnel and session
        $tunnel = InmateTunnel::where('tunnel_token', $token)->first();
        
        if (!$tunnel || !$tunnel->isValid() || $tunnel->is_used) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['otp' => 'Invalid or expired tunnel code.']);
        }

        $session = $tunnel->visitSession;
        $jailOfficer = $session->jailOfficer;

        if (!$jailOfficer) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['otp' => 'No jail officer assigned to this session.']);
        }

        // Verify OTP
        $otpService = new \App\Services\OtpService;
        $isValid = $otpService->verify($jailOfficer, $request->otp, 'inmate_tunnel_verification');

        if (!$isValid) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP. Please contact the assigned jail officer.']);
        }

        // OTP verified - mark tunnel as used and redirect to join page
        $tunnel->update(['is_used' => true]);
        
        // Clear the session data
        session()->forget('inmate_tunnel_token');

        // Redirect to video room (this will handle lobby/waiting logic)
        return redirect()->route('inmate.join', ['token' => $token]);
    }

    /**
     * Resend OTP for inmate tunnel verification.
     */
    public function resendOtp(Request $request, string $token): RedirectResponse
    {
        $tunnel = InmateTunnel::where('tunnel_token', $token)->first();
        
        if (!$tunnel || !$tunnel->isValid() || $tunnel->is_used) {
            return redirect()->route('inmate.enter-token')
                ->withErrors(['resend' => 'Invalid or expired tunnel code.']);
        }

        $session = $tunnel->visitSession;
        $jailOfficer = $session->jailOfficer;

        if (!$jailOfficer || !$jailOfficer->contact_number) {
            return back()->withErrors(['resend' => 'Jail officer contact information not available.']);
        }

        // Resend OTP
        $otpService = new \App\Services\OtpService;
        $result = $otpService->generateAndSend($jailOfficer, 'inmate_tunnel_verification');

        if ($result['success']) {
            return back()->with('success', 'OTP has been resent to the jail officer.');
        }

        return back()->withErrors(['resend' => 'Failed to resend OTP. Please try again.']);
    }

    /**
     * Generate inmate token and mark tunnel as used. Called when inmate clicks "Join Call" (no auth).
     */
    public function getInmateToken(Request $request, string $token): \Illuminate\Http\JsonResponse
    {
        return DB::transaction(function () use ($token) {
            $tunnel = InmateTunnel::where('tunnel_token', $token)->lockForUpdate()->first();
            
            if (! $tunnel) {
                return response()->json(['error' => 'Invalid or expired link.'], 404);
            }
            
            // Double-check if tunnel has already been used (race condition prevention)
            if ($tunnel->is_used) {
                return response()->json(['error' => 'This tunnel has already been used by another inmate.'], 403);
            }
            
            if (! $tunnel->isValid()) {
                return response()->json(['error' => 'This link has expired or has already been used.'], 403);
            }

            $session = $tunnel->visitSession;
            
            // Check if session is within schedule and not completed
            if (! $session->isWithinSchedule() || $session->isCompleted()) {
                return response()->json(['error' => 'Session not available.'], 403);
            }

            // Mark tunnel as used NOW - inmate is actually joining
            $tunnel->update(['is_used' => true]);

            // Set inmate_joined_at timestamp
            $session->update(['inmate_joined_at' => now()]);

            if ($session->visitor_joined_at && $session->visitor_participant_id) {
                app(VisitSessionRecordingService::class)->tryStartRecording($session, $session->visitor_participant_id);
            }

            $videoSdk = new VideoSdkService;
            $participantId = 'inmate-'.$session->id.'-'.uniqid();
            $result = $videoSdk->generateJoinTokenForPrebuiltApp($session->room_id, $participantId, ['allow_join'], 120);

            if (! ($result['success'] ?? false) || empty($result['token'])) {
                return response()->json(['error' => 'Unable to generate join token.'], 500);
            }

            $token = preg_replace('/^Bearer\s+/i', '', (string) $result['token']);
            $token = trim($token);

            // Return data for Inertia render (same as VideoRoomController)
            return response()->json([
                'token' => $token,
                'room_id' => $session->room_id,
                'participant_id' => $participantId,
                'api_key' => config('services.videosdk.api_key'),
                'participant_name' => 'Inmate',
                'is_observer' => false,
            ]);
        });
    }

    /**
     * Inmate sends a chat message (no auth). Body: tunnel_token, message. Tunnel must exist and session active, chat not locked.
     */
    public function sendChat(Request $request): JsonResponse
    {
        $request->validate([
            'tunnel_token' => ['required', 'string'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $tunnel = InmateTunnel::where('tunnel_token', $request->input('tunnel_token'))->first();
        if (! $tunnel) {
            return response()->json(['error' => 'Invalid or expired link.'], 404);
        }
        if ($tunnel->expires_at->isPast()) {
            return response()->json(['error' => 'This link has expired.'], 403);
        }

        $session = $tunnel->visitSession;
        if ($session->isCompleted()) {
            return response()->json(['error' => 'Session has ended.'], 422);
        }
        if ($session->chat_locked) {
            return response()->json(['error' => 'Chat is locked.'], 422);
        }
        if (! $session->isWithinSchedule()) {
            return response()->json(['error' => 'Session is not in schedule.'], 422);
        }

        $message = $request->input('message');
        $keywords = config('visit_chat.forbidden_keywords', []);
        $lower = strtolower($message);
        $flagged = false;
        $flagReason = null;
        foreach ($keywords as $kw) {
            if ($kw !== '' && str_contains($lower, strtolower($kw))) {
                $flagged = true;
                $flagReason = 'Auto-flagged: forbidden keyword.';

                break;
            }
        }

        $chatLog = DB::transaction(function () use ($session, $message, $flagged, $flagReason) {
            $log = ChatLog::create([
                'visit_session_id' => $session->id,
                'sender' => 'inmate',
                'sender_id' => null,
                'message' => $message,
                'sent_at' => now(),
                'flagged' => $flagged,
                'flag_reason' => $flagReason,
                'flagged_by' => null,
                'flagged_at' => $flagged ? now() : null,
            ]);
            if ($flagged) {
                SystemLog::create([
                    'visit_session_id' => $session->id,
                    'action' => 'chat_auto_flagged',
                    'performed_by' => null,
                    'metadata' => ['chat_log_id' => $log->id, 'reason' => $flagReason],
                ]);
            }

            return $log;
        });

        $session->refresh();
        VisitSessionMessageSent::dispatch($session, $chatLog);
        if ($flagged) {
            VisitSessionMessageFlagged::dispatch($session, $chatLog);
        }

        return response()->json([
            'id' => $chatLog->id,
            'sender' => $chatLog->sender,
            'message' => $chatLog->message,
            'sent_at' => $chatLog->sent_at->toIso8601String(),
            'flagged' => $chatLog->flagged,
            'flag_reason' => $chatLog->flag_reason,
        ], 201);
    }

    /**
     * Inmate lists chat messages (no auth). Query: tunnel_token.
     */
    public function listChat(Request $request): JsonResponse
    {
        $request->validate(['tunnel_token' => ['required', 'string']]);

        $tunnel = InmateTunnel::where('tunnel_token', $request->input('tunnel_token'))->first();
        if (! $tunnel) {
            return response()->json(['error' => 'Invalid or expired link.'], 404);
        }

        $session = $tunnel->visitSession;
        $messages = $session->chatLogs()
            ->orderBy('sent_at')
            ->get()
            ->map(fn (ChatLog $log) => [
                'id' => $log->id,
                'sender' => $log->sender,
                'sender_id' => $log->sender_id,
                'message' => $log->message,
                'sent_at' => $log->sent_at->toIso8601String(),
                'flagged' => $log->flagged,
                'flag_reason' => $log->flag_reason,
            ]);

        return response()->json(['messages' => $messages, 'chat_locked' => (bool) $session->chat_locked]);
    }

    /**
     * Show tunnel already used error page.
     */
    public function tunnelAlreadyUsed(): View
    {
        return view('errors.inmate-tunnel-already-used');
    }
}
