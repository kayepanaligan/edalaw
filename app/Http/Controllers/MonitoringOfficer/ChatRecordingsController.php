<?php

namespace App\Http\Controllers\MonitoringOfficer;

use App\Http\Controllers\Controller;
use App\Models\VisitSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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

        return Inertia::render('MonitoringOfficer/ChatRecordings', [
            'sessions' => $sessions,
            'filters' => [
                'type' => $request->input('type'),
                'has_flagged' => $request->boolean('has_flagged'),
            ],
        ]);
    }
}
