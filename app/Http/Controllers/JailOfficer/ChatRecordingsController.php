<?php

namespace App\Http\Controllers\JailOfficer;

use App\Http\Controllers\Controller;
use App\Models\ChatExport;
use App\Models\ChatLog;
use App\Models\VisitSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatRecordingsController extends Controller
{
    /**
     * Chat Recordings Management: session, total messages, flagged count, export files, generated_by, filters.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isSuperAdmin = $user->role?->slug === 'super_admin';

        $query = VisitSession::with(['visit.user', 'eburol.user', 'visit', 'eburol', 'chatLogs', 'chatExports.generatedByUser'])
            ->whereIn('status', ['active', 'completed', 'terminated', 'locked']);

        if (! $isSuperAdmin) {
            $query->where('monitor_id', $user->id);
        }

        if ($request->filled('type')) {
            if ($request->input('type') === 'visit') {
                $query->whereNotNull('visit_id');
            } elseif ($request->input('type') === 'eburol') {
                $query->whereNotNull('eburol_id');
            }
        }
        if ($request->filled('has_flagged')) {
            $query->whereHas('chatLogs', fn ($q) => $q->where('flagged', true));
        }

        $sessions = $query->orderByDesc('scheduled_start')->get()->map(function (VisitSession $session) {
            $visitor = $session->visit?->user ?? $session->eburol?->user;
            $visitorName = $visitor ? trim("{$visitor->first_name} {$visitor->middle_name} {$visitor->last_name}") : null;
            $inmateName = $session->visit
                ? trim("{$session->visit->inmate_first_name} {$session->visit->inmate_middle_name} {$session->visit->inmate_last_name}")
                : trim("{$session->eburol->inmate_first_name} {$session->eburol->inmate_middle_name} {$session->eburol->inmate_last_name}");

            $totalMessages = $session->chatLogs->count();
            $flaggedCount = $session->chatLogs->where('flagged', true)->count();
            $exports = $session->chatExports->map(fn ($e) => [
                'id' => $e->id,
                'format' => $e->format,
                'generated_at' => $e->created_at->toIso8601String(),
                'generated_by_name' => $e->generatedByUser ? trim("{$e->generatedByUser->first_name} {$e->generatedByUser->last_name}") : null,
                'download_url' => route('chat-exports.download', $e),
            ]);

            return [
                'id' => $session->id,
                'session_type' => $session->session_type,
                'visitor_name' => $visitorName,
                'inmate_name' => $inmateName,
                'scheduled_start' => $session->scheduled_start->toIso8601String(),
                'scheduled_end' => $session->scheduled_end->toIso8601String(),
                'status' => $session->status,
                'total_messages' => $totalMessages,
                'flagged_count' => $flaggedCount,
                'exports' => $exports,
            ];
        });

        $viewPrefix = $isSuperAdmin ? 'Admin' : 'JailOfficer';

        return Inertia::render("{$viewPrefix}/ChatRecordings", [
            'sessions' => $sessions,
            'filters' => [
                'type' => $request->input('type'),
                'has_flagged' => $request->boolean('has_flagged'),
            ],
        ]);
    }

    /**
     * View chat logs for a specific session.
     */
    public function viewSession(Request $request, VisitSession $session): Response
    {
        $user = $request->user();
        $isSuperAdmin = $user->role?->slug === 'super_admin';

        // Check permission
        if (! $isSuperAdmin && $session->monitor_id !== $user->id) {
            abort(403, 'Unauthorized access to this session.');
        }

        $chatLogs = ChatLog::with('senderUser')
            ->where('visit_session_id', $session->id)
            ->orderBy('sent_at', 'asc')
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'sender' => $log->sender,
                'sender_name' => $log->senderUser ? trim("{$log->senderUser->first_name} {$log->senderUser->last_name}") : ($log->sender === 'inmate' ? 'Inmate' : 'Unknown'),
                'message' => $log->message,
                'sent_at' => $log->sent_at->toIso8601String(),
                'flagged' => $log->flagged,
                'flag_reason' => $log->flag_reason,
            ]);

        $visitor = $session->visit?->user ?? $session->eburol?->user;
        $visitorName = $visitor ? trim("{$visitor->first_name} {$visitor->middle_name} {$visitor->last_name}") : null;
        $inmateName = $session->visit
            ? trim("{$session->visit->inmate_first_name} {$session->visit->inmate_middle_name} {$session->visit->inmate_last_name}")
            : trim("{$session->eburol->inmate_first_name} {$session->eburol->inmate_middle_name} {$session->eburol->inmate_last_name}");

        $viewPrefix = $isSuperAdmin ? 'Admin' : 'JailOfficer';

        return Inertia::render("{$viewPrefix}/ChatSessionView", [
            'session' => [
                'id' => $session->id,
                'session_type' => $session->session_type,
                'visitor_name' => $visitorName,
                'inmate_name' => $inmateName,
                'scheduled_start' => $session->scheduled_start->toIso8601String(),
                'scheduled_end' => $session->scheduled_end->toIso8601String(),
                'status' => $session->status,
            ],
            'chatLogs' => $chatLogs,
        ]);
    }

    /**
     * Generate and download CSV export for a session.
     */
    public function exportSession(Request $request, VisitSession $session): StreamedResponse
    {
        $user = $request->user();
        $isSuperAdmin = $user->role?->slug === 'super_admin';

        // Check permission
        if (! $isSuperAdmin && $session->monitor_id !== $user->id) {
            abort(403, 'Unauthorized access to this session.');
        }

        $chatLogs = ChatLog::with('senderUser')
            ->where('visit_session_id', $session->id)
            ->orderBy('sent_at', 'asc')
            ->get();

        $visitor = $session->visit?->user ?? $session->eburol?->user;
        $visitorName = $visitor ? trim("{$visitor->first_name} {$visitor->last_name}") : 'Unknown';
        $inmateName = $session->visit
            ? trim("{$session->visit->inmate_first_name} {$session->visit->inmate_last_name}")
            : trim("{$session->eburol->inmate_first_name} {$session->eburol->inmate_last_name}");

        $filename = "chat-session-{$session->id}-" . now()->format('Y-m-d-His') . '.csv';

        // Create export record
        ChatExport::create([
            'visit_session_id' => $session->id,
            'format' => 'csv',
            'generated_by' => $user->id,
            'file_path' => "exports/{$filename}",
        ]);

        return response()->stream(function () use ($chatLogs, $session, $visitorName, $inmateName) {
            $handle = fopen('php://output', 'w');

            // Headers
            fputcsv($handle, ['Chat Export']);
            fputcsv($handle, ['Session ID', $session->id]);
            fputcsv($handle, ['Session Type', $session->session_type]);
            fputcsv($handle, ['Visitor', $visitorName]);
            fputcsv($handle, ['Inmate', $inmateName]);
            fputcsv($handle, ['Scheduled', $session->scheduled_start->format('Y-m-d H:i:s')]);
            fputcsv($handle, ['Status', $session->status]);
            fputcsv($handle, []);
            fputcsv($handle, ['Sender', 'Sender Name', 'Message', 'Sent At', 'Flagged']);

            foreach ($chatLogs as $log) {
                fputcsv($handle, [
                    $log->sender,
                    $log->senderUser ? trim("{$log->senderUser->first_name} {$log->senderUser->last_name}") : ($log->sender === 'inmate' ? 'Inmate' : 'Unknown'),
                    $log->message,
                    $log->sent_at->format('Y-m-d H:i:s'),
                    $log->flagged ? 'Yes' : 'No',
                ]);
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
