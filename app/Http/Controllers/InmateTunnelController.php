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
use Inertia\Inertia;
use Inertia\Response;

class InmateTunnelController extends Controller
{
    /**
     * Public page: inmate joins via tunnel token (no auth). Validate token and show Join/End UI.
     */
    public function join(Request $request, string $token): Response|RedirectResponse
    {
        $tunnel = InmateTunnel::where('tunnel_token', $token)->first();
        if (! $tunnel) {
            abort(404, 'Invalid or expired link.');
        }
        if (! $tunnel->isValid()) {
            abort(404, 'This link has expired or has already been used.');
        }

        $session = $tunnel->visitSession;
        if (! $session->isWithinSchedule()) {
            abort(403, 'This link is only valid during the scheduled visit window.');
        }
        if ($session->isCompleted()) {
            abort(403, 'This session has ended.');
        }

        return Inertia::render('Inmate/JoinSession', [
            'tunnel_token' => $token,
            'session' => [
                'id' => $session->id,
                'room_id' => $session->room_id,
                'session_type' => $session->session_type,
            ],
        ]);
    }

    /**
     * Generate inmate token and mark tunnel as used. Called when inmate clicks "Join Call" (no auth).
     */
    public function getInmateToken(Request $request, string $token): \Illuminate\Http\JsonResponse
    {
        $tunnel = InmateTunnel::where('tunnel_token', $token)->first();
        if (! $tunnel || ! $tunnel->isValid()) {
            return response()->json(['error' => 'Invalid or expired link.'], 404);
        }

        $session = $tunnel->visitSession;
        if (! $session->isWithinSchedule() || $session->isCompleted()) {
            return response()->json(['error' => 'Session not available.'], 403);
        }

        $tunnel->update(['is_used' => true]);

        $session->update(['inmate_joined_at' => $session->inmate_joined_at ?? now()]);

        if ($session->visitor_joined_at && $session->visitor_participant_id) {
            app(VisitSessionRecordingService::class)->tryStartRecording($session, $session->visitor_participant_id);
        }

        $videoSdk = new VideoSdkService;
        $participantId = 'inmate-'.$session->id.'-'.uniqid();
        $result = $videoSdk->generateParticipantToken($session->room_id, $participantId, ['allow_join'], 120);

        if (! ($result['success'] ?? false) || empty($result['token'])) {
            $tunnel->update(['is_used' => false]);

            return response()->json(['error' => 'Unable to generate join token.'], 500);
        }

        return response()->json([
            'token' => $result['token'],
            'room_id' => $session->room_id,
            'participant_id' => $participantId,
        ]);
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
}
