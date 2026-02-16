<?php

namespace App\Http\Controllers;

use App\Events\VisitSessionMessageFlagged;
use App\Events\VisitSessionMessageSent;
use App\Http\Requests\VisitSession\FlagChatMessageRequest;
use App\Http\Requests\VisitSession\SendChatMessageRequest;
use App\Models\ChatLog;
use App\Models\SystemLog;
use App\Models\VisitSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitSessionChatController extends Controller
{
    /**
     * List chat messages for the session. Authorized for visitor, assigned monitor, or super_admin.
     */
    public function index(Request $request, VisitSession $session): JsonResponse
    {
        $user = $request->user();
        $visitor = $session->visit?->user ?? $session->eburol?->user;
        $canAccess = ($visitor && $visitor->id === $user->id)
            || $session->monitor_id === $user->id
            || $user->role?->slug === 'super_admin';

        if (! $canAccess) {
            abort(403);
        }

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
                'flagged_by' => $log->flagged_by,
                'flagged_at' => $log->flagged_at?->toIso8601String(),
            ]);

        return response()->json(['messages' => $messages, 'chat_locked' => (bool) $session->chat_locked]);
    }

    /**
     * Visitor sends a message. Automatically recorded in chat_logs (tied to visit_session_id for this session).
     * Keyword filter may auto-flag; broadcast to other participants.
     */
    public function store(SendChatMessageRequest $request, VisitSession $session): JsonResponse
    {
        if ($session->chat_locked) {
            return response()->json(['error' => 'Chat is locked.'], 422);
        }
        if ($session->isCompleted()) {
            return response()->json(['error' => 'Session has ended.'], 422);
        }

        $message = $request->input('message');
        $flagged = false;
        $flagReason = null;
        $keywords = config('visit_chat.forbidden_keywords', []);
        $lower = strtolower($message);
        foreach ($keywords as $kw) {
            if ($kw !== '' && str_contains($lower, strtolower($kw))) {
                $flagged = true;
                $flagReason = 'Auto-flagged: forbidden keyword.';

                break;
            }
        }

        $chatLog = DB::transaction(function () use ($session, $request, $message, $flagged, $flagReason) {
            $log = ChatLog::create([
                'visit_session_id' => $session->id,
                'sender' => 'visitor',
                'sender_id' => $request->user()->id,
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
                    'performed_by' => $request->user()->id,
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
     * Monitor (or super_admin) flags a message. Updates chat_logs, system_logs, broadcast.
     */
    public function flag(FlagChatMessageRequest $request, VisitSession $session, ChatLog $chatLog): JsonResponse
    {
        if ($chatLog->visit_session_id !== $session->id) {
            abort(404);
        }

        $chatLog->update([
            'flagged' => true,
            'flag_reason' => $request->input('flag_reason'),
            'flagged_by' => $request->user()->id,
            'flagged_at' => now(),
        ]);

        SystemLog::create([
            'visit_session_id' => $session->id,
            'action' => 'chat_message_flagged',
            'performed_by' => $request->user()->id,
            'metadata' => [
                'chat_log_id' => $chatLog->id,
                'flag_reason' => $chatLog->flag_reason,
            ],
        ]);

        VisitSessionMessageFlagged::dispatch($session, $chatLog->fresh());

        return response()->json(['ok' => true]);
    }
}
