<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\VisitSession;
use App\Services\VideoSdkService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VisitSessionController extends Controller
{
    /**
     * Show the visit session page with join information.
     */
    public function show(Request $request, VisitSession $session)
    {
        $user = $request->user();
        
        // Determine session type and inmate name
        $sessionType = $session->visit_id ? 'visit' : 'eburol';
        $inmateName = $session->inmateTunnels()->first()?->inmate?->name ?? 'Unknown Inmate';
        
        // Check if user can join now (within schedule and session is active)
        $canJoinNow = $session->isWithinSchedule() && ! $session->isCompleted();
        
        // Prepare schedule reminder if session hasn't started yet
        $scheduleReminder = null;
        if (! $canJoinNow && ! $session->isCompleted()) {
            $now = now();
            $scheduledStart = $session->scheduled_start;
            $hoursUntilStart = max(0, floor($scheduledStart->diffInSeconds($now) / 3600));
            $minutesUntilStart = max(0, floor($scheduledStart->diffInSeconds($now) / 60)) % 60;
            
            $scheduleReminder = [
                'scheduled_start' => $scheduledStart->toIso8601String(),
                'scheduled_end' => $session->scheduled_end->toIso8601String(),
                'scheduled_label' => $scheduledStart->format('M d, Y g:i A'),
                'minutes_until_start' => $minutesUntilStart,
                'hours_until_start' => $hoursUntilStart,
            ];
        }
        
        // Generate join URL if session is available
        $joinUrl = null;
        if ($canJoinNow) {
            $videoSdk = new VideoSdkService();
            $participantId = 'user_' . $user->id;
            $tokenResult = $videoSdk->generateParticipantToken($session->room_id, $participantId);
            
            if ($tokenResult['success']) {
                // Always use local video-room route which handles both v1 and v2
                $joinUrl = route('visit-session.video-room', $session);
            }
        }
        
        return view('visitor.visit-session', [
            'session' => [
                'id' => $session->id,
                'room_id' => $session->room_id,
                'token' => null,
                'participant_id' => 'user_' . $user->id,
                'session_type' => $sessionType,
                'inmate_name' => $inmateName,
                'schedule_reminder' => $scheduleReminder,
                'can_join_now' => $canJoinNow,
                'join_url' => $joinUrl,
            ],
        ]);
    }

    /**
     * Mark terms as accepted for the session.
     */
    public function acceptTerms(Request $request, VisitSession $session)
    {
        // mark terms as accepted
        $session->terms_accepted = true;
        $session->terms_accepted_at = now();
        $session->save();

        // respond for Inertia / React
        return redirect()->route('visit-session.show', $session)
                        ->with('success', 'You have accepted the terms.');
    }

    public function videoRoom(Request $request, VisitSession $session)
    {
        $user = $request->user();
        $videoSdk = new VideoSdkService();

        // Validate the room exists
        $validation = $videoSdk->validateRoom($session->room_id);
        if (!$validation['success']) {
            Log::warning('VideoSDK room validation failed', [
                'room_id' => $session->room_id,
                'error' => $validation['error'] ?? 'Unknown error',
                'is_v2' => $videoSdk->isV2Rooms(),
            ]);
            
            return redirect()->route('visit-session.show', $session)
                ->withErrors(['session' => 'The video room is expired or unavailable. Room ID: '.$session->room_id]);
        }

        // Generate participant JWT (v2)
        $participantId = 'user_' . $user->id;
        $tokenResult = $videoSdk->generateParticipantToken($session->room_id, $participantId);

        if (!$tokenResult['success']) {
            abort(500, 'Failed to generate VideoSDK token: ' . ($tokenResult['error'] ?? 'Unknown'));
        }

        // Redirect to video room page with embedded SDK
        return view('visitor.video-room', [
            'session'            => $session,
            'room_id'            => $session->room_id,
            'participant_name'   => $user->name,
            'participant_id'     => $participantId,
            'is_observer'        => false,
        ]);
    }

    /**
     * Mark participant as joined (called from frontend).
     */
    public function participantJoined(Request $request, VisitSession $session)
    {
        $request->validate([
            'participant_id' => ['required', 'string'],
        ]);

        // Update visitor joined timestamp
        $session->update([
            'visitor_joined_at' => $session->visitor_joined_at ?? now(),
            'visitor_participant_id' => $request->participant_id,
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Save VideoSDK session_id to visit_sessions table.
     */
    public function saveSessionId(Request $request)
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string'],
            'room_id' => ['required', 'string'],
        ]);

        // Find the visit_session by room_id
        $visitSession = \App\Models\VisitSession::where('room_id', $validated['room_id'])
            ->latest('id')
            ->first();

        if ($visitSession) {
            $visitSession->update([
                'session_id' => $validated['session_id'],
            ]);

            \Log::info('✅ Session ID saved', [
                'visit_session_id' => $visitSession->id,
                'session_id' => $validated['session_id'],
            ]);

            return response()->json(['success' => true]);
        }

        \Log::warning('❌ VisitSession not found for room_id', [
            'room_id' => $validated['room_id'],
        ]);

        return response()->json(['success' => false, 'message' => 'VisitSession not found'], 404);
    }
}