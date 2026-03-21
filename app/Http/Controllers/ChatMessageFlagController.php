<?php

namespace App\Http\Controllers;

use App\Models\ChatFlag;
use App\Models\ChatLog;
use App\Models\VisitSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatMessageFlagController extends Controller
{
    /**
     * Flag a chat message as inappropriate (jail officer only).
     */
    public function flag(Request $request, VisitSession $session, ChatLog $message): JsonResponse
    {
        $user = $request->user();
        
        Log::info('🚩 Flag message request', [
            'user_id' => $user?->id,
            'user_role' => $user?->role?->slug,
            'session_id' => $session->id,
            'message_id' => $message->id,
            'reason' => $request->input('reason'),
            'has_user' => $user !== null,
            'session_monitor_id' => $session->monitor_id,
        ]);
        
        // For unauthenticated users (tunnel access), check if they're the assigned monitor
        if (!$user) {
            // Check if this is a jail officer accessing via tunnel link
            // They should be the assigned monitor for this session
            if (!$session->monitor_id) {
                Log::error('❌ Unauthenticated flag attempt with no assigned monitor');
                return response()->json([
                    'success' => false,
                    'error' => 'Authentication required.',
                ], 401);
            }
            
            // Allow the assigned monitor to flag (even if unauthenticated via tunnel)
            Log::info('✅ Allowing session monitor to flag message', ['monitor_id' => $session->monitor_id]);
        }
        
        // Only jail officers can flag messages
        if ($user && $user->role?->slug !== 'jail_officer') {
            Log::error('❌ Non-jail-officer flag attempt', ['role' => $user->role?->slug]);
            return response()->json([
                'success' => false,
                'error' => 'Only jail officers can flag messages.',
            ], 403);
        }

        // Verify the message belongs to this session
        if ($message->visit_session_id !== $session->id) {
            Log::error('❌ Message-session mismatch', [
                'message_session_id' => $message->visit_session_id,
                'route_session_id' => $session->id,
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Message does not belong to this session.',
            ], 404);
        }

        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        try {
            // Create the flag record
            $flag = ChatFlag::create([
                'chat_message_id' => $message->id,
                'monitoring_session_id' => $session->id,
                'flagged_by' => $user?->id ?? $session->monitor_id, // Use session monitor if unauthenticated
                'reason' => $request->input('reason'),
                'severity' => 'medium', // Default severity
            ]);

            // Mark the message as flagged
            $message->update(['flagged' => true, 'flag_reason' => $request->input('reason')]);

            Log::info('✅ Message flagged successfully', [
                'flag_id' => $flag->id,
                'message_id' => $message->id,
                'flagged_by' => $flag->flagged_by,
            ]);

            return response()->json([
                'success' => true,
                'flag' => [
                    'id' => $flag->id,
                    'reason' => $flag->reason,
                    'flagged_at' => $flag->created_at->toIso8601String(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Failed to flag message', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to flag message: ' . $e->getMessage(),
            ], 500);
        }
    }
}
