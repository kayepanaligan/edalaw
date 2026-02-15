<?php

namespace App\Http\Controllers\MonitoringOfficer;

use App\Events\VisitSessionChatLockChanged;
use App\Http\Controllers\Controller;
use App\Models\InmateTunnel;
use App\Models\SystemLog;
use App\Models\VisitSession;
use App\Services\VisitSessionRecordingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssignedSessionsController extends Controller
{
    /**
     * List visit_sessions assigned to the current monitoring officer.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = VisitSession::with(['visit.user', 'eburol.user', 'visit', 'eburol'])
            ->where('monitor_id', $user->id);

        $typeFilter = $request->input('type'); // 'visit' | 'eburol' | null = all
        if ($typeFilter === 'visit') {
            $query->whereNotNull('visit_id');
        } elseif ($typeFilter === 'eburol') {
            $query->whereNotNull('eburol_id');
        }

        $sessions = $query->orderBy('scheduled_start', 'desc')
            ->get()
            ->map(function (VisitSession $session) {
                $visitor = $session->visit?->user ?? $session->eburol?->user;
                $inmateName = $session->visit
                    ? trim("{$session->visit->inmate_first_name} {$session->visit->inmate_middle_name} {$session->visit->inmate_last_name}")
                    : trim("{$session->eburol->inmate_first_name} {$session->eburol->inmate_middle_name} {$session->eburol->inmate_last_name}");

                $scheduledDate = null;
                $scheduledTime = null;
                $visitType = null;
                if ($session->visit_id && $session->visit) {
                    $scheduledDate = $session->visit->scheduled_date->format('Y-m-d');
                    $scheduledTime = $session->visit->scheduled_time;
                    $visitType = $session->visit->visit_type->value;
                }
                $scheduleEnded = now()->isAfter($session->scheduled_end);

                return [
                    'id' => $session->id,
                    'visit_id' => $session->visit_id,
                    'eburol_id' => $session->eburol_id,
                    'room_id' => $session->room_id,
                    'visitor_name' => $visitor ? trim("{$visitor->first_name} {$visitor->middle_name} {$visitor->last_name}") : null,
                    'inmate_name' => $inmateName,
                    'type' => $session->session_type,
                    'scheduled_start' => $session->scheduled_start->toIso8601String(),
                    'scheduled_end' => $session->scheduled_end->toIso8601String(),
                    'scheduled_date' => $scheduledDate,
                    'scheduled_time' => $scheduledTime,
                    'visit_type' => $visitType,
                    'schedule_ended' => $scheduleEnded,
                    'status' => $session->status,
                    'recording_status' => $session->recording_status,
                    'started_at' => $session->started_at?->toIso8601String(),
                    'ended_at' => $session->ended_at?->toIso8601String(),
                    'has_active_tunnel' => $session->inmateTunnels()->where('is_used', false)->where('expires_at', '>', now())->exists(),
                    'chat_locked' => (bool) $session->chat_locked,
                ];
            });

        return Inertia::render('MonitoringOfficer/AssignedSessions', [
            'sessions' => $sessions,
            'filters' => [
                'type' => $typeFilter ?? 'all',
            ],
        ]);
    }

    /**
     * Generate inmate tunnel (secure link for inmate to join). Monitoring officer only.
     */
    public function generateTunnel(Request $request, VisitSession $session): JsonResponse
    {
        if ($session->monitor_id !== $request->user()->id) {
            abort(403);
        }
        if (! $session->isWithinScheduleForTunnel()) {
            return response()->json(['error' => 'Session is not within the scheduled window. You can generate the inmate link from 15 minutes before the session start until the session end.'], 422);
        }
        if ($session->isCompleted()) {
            return response()->json(['error' => 'Session has ended.'], 422);
        }

        $token = InmateTunnel::generateToken();
        $expiresAt = $session->scheduled_end->copy();

        InmateTunnel::create([
            'visit_session_id' => $session->id,
            'tunnel_token' => $token,
            'expires_at' => $expiresAt,
            'is_used' => false,
        ]);

        $url = route('inmate.join', ['token' => $token]);

        SystemLog::create([
            'visit_session_id' => $session->id,
            'action' => 'generate_inmate_tunnel',
            'performed_by' => $request->user()->id,
            'metadata' => ['expires_at' => $expiresAt->toIso8601String()],
        ]);

        return response()->json(['join_url' => $url, 'token' => $token]);
    }

    /**
     * Start session (set status active, started_at).
     */
    public function startSession(Request $request, VisitSession $session): RedirectResponse|JsonResponse
    {
        if ($session->monitor_id !== $request->user()->id) {
            abort(403);
        }
        if ($session->status === 'active') {
            return response()->json(['message' => 'Session already started.'], 200);
        }
        if ($session->isCompleted()) {
            return response()->json(['error' => 'Session has ended.'], 422);
        }

        $session->update([
            'status' => 'active',
            'started_at' => now(),
        ]);

        SystemLog::create([
            'visit_session_id' => $session->id,
            'action' => 'start_session',
            'performed_by' => $request->user()->id,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Session started.']);
        }

        return redirect()->back()->with('success', 'Session started.');
    }

    /**
     * End session (stop recording, set status completed, store duration).
     */
    public function endSession(Request $request, VisitSession $session): RedirectResponse|JsonResponse
    {
        if ($session->monitor_id !== $request->user()->id) {
            abort(403);
        }
        if ($session->isCompleted()) {
            return response()->json(['message' => 'Session already ended.'], 200);
        }

        $endedAt = now();
        $durationSeconds = $session->started_at ? $endedAt->diffInSeconds($session->started_at) : null;

        if ($session->recording_status === 'recording' && $session->visitor_participant_id) {
            app(VisitSessionRecordingService::class)->stopRecordingAndSave($session, $session->visitor_participant_id);
        }

        $session->update([
            'status' => 'completed',
            'recording_status' => $session->recording_status === 'recording' ? 'saved' : $session->recording_status,
            'ended_at' => $endedAt,
            'duration_seconds' => $durationSeconds,
            'end_reason' => $request->input('reason', 'monitor_ended'),
        ]);

        SystemLog::create([
            'visit_session_id' => $session->id,
            'action' => 'end_session',
            'performed_by' => $request->user()->id,
            'metadata' => ['duration_seconds' => $durationSeconds],
        ]);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Session ended.']);
        }

        return redirect()->back()->with('success', 'Session ended.');
    }

    /**
     * Lock chat for the session. Monitor only. Log and broadcast.
     */
    public function lockChat(Request $request, VisitSession $session): JsonResponse
    {
        if ($session->monitor_id !== $request->user()->id) {
            abort(403);
        }
        if ($session->isCompleted()) {
            return response()->json(['error' => 'Session has ended.'], 422);
        }

        $session->update(['chat_locked' => true]);

        SystemLog::create([
            'visit_session_id' => $session->id,
            'action' => 'lock_chat',
            'performed_by' => $request->user()->id,
        ]);

        VisitSessionChatLockChanged::dispatch($session->fresh(), true);

        return response()->json(['ok' => true, 'chat_locked' => true]);
    }

    /**
     * Unlock chat for the session. Monitor only.
     */
    public function unlockChat(Request $request, VisitSession $session): JsonResponse
    {
        if ($session->monitor_id !== $request->user()->id) {
            abort(403);
        }
        if ($session->isCompleted()) {
            return response()->json(['error' => 'Session has ended.'], 422);
        }

        $session->update(['chat_locked' => false]);

        SystemLog::create([
            'visit_session_id' => $session->id,
            'action' => 'unlock_chat',
            'performed_by' => $request->user()->id,
        ]);

        VisitSessionChatLockChanged::dispatch($session->fresh(), false);

        return response()->json(['ok' => true, 'chat_locked' => false]);
    }
}
