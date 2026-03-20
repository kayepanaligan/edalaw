<?php

namespace App\Http\Controllers\JailOfficer;

use App\Http\Controllers\Controller;
use App\Models\VisitMonitoredLog;
use App\Models\Visit;
use App\Models\VisitSession;
use App\Models\ChatLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VisitMonitoredManagementController extends Controller
{
    /**
     * Display the visit monitored management page.
     */
    public function index(Request $request): Response
    {
        // Query VisitSession instead of VisitMonitoredLog for real data
        $query = VisitSession::with(['visit.user', 'eburol.user', 'chatLogs', 'videoRecordings'])
            ->whereIn('status', ['completed', 'terminated', 'locked'])
            ->orderBy('started_at', 'desc');

        // Apply filters
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('room_id', 'like', "%{$search}%")
                  ->orWhereHas('visit.user', function($q) use ($search) {
                      $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('eburol.user', function($q) use ($search) {
                      $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($visitType = $request->input('visit_type')) {
            if ($visitType === 'visit') {
                $query->whereNotNull('visit_id');
            } elseif ($visitType === 'eburol') {
                $query->whereNotNull('eburol_id');
            }
        }

        $monitoredLogs = $query->paginate(20)->through(function ($session) {
            $visitor = $session->visit?->user ?? $session->eburol?->user;
            $visitorName = $visitor ? trim("{$visitor->first_name} {$visitor->last_name}") : 'Unknown';
            $inmateName = $session->inmateTunnels->first()?->inmate?->full_name ?? 'N/A';
            
            return [
                'id' => $session->id,
                'meeting_id' => $session->room_id,
                'session_started_at' => $session->started_at?->format('Y-m-d H:i:s'),
                'duration' => $this->formatDuration($session->duration_seconds ?? 0),
                'duration_seconds' => $session->duration_seconds ?? 0,
                'unique_participants_count' => 2, // visitor + inmate minimum
                'visitor_name' => $visitorName,
                'inmate_name' => $inmateName,
                'visit_type' => $session->visit_id ? 'visit' : 'eburol',
                'status' => $session->status,
                'jail_officer_name' => $session->monitor?->name ?? null,
                'total_messages' => $session->chatLogs->count(),
                'flagged_messages' => $session->chatLogs->where('flagged', true)->count(),
            ];
        });

        $stats = [
            'total' => VisitSession::whereIn('status', ['completed', 'terminated', 'locked'])->count(),
            'completed' => VisitSession::where('status', 'completed')->count(),
            'terminated' => VisitSession::where('status', 'terminated')->count(),
            'locked' => VisitSession::where('status', 'locked')->count(),
        ];

        return Inertia::render('JailOfficer/VisitMonitoredManagement', [
            'monitoredLogs' => $monitoredLogs,
            'stats' => $stats,
            'filters' => [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
                'visit_type' => $request->input('visit_type'),
            ],
        ]);
    }

    /**
     * Display the session details for a specific meeting.
     */
    public function show(string $meetingId): Response
    {
        // Find visit session by room_id
        $session = VisitSession::with(['visit.user', 'eburol.user', 'chatLogs.senderUser', 'inmateTunnels.inmate', 'videoRecordings'])
            ->where('room_id', $meetingId)
            ->firstOrFail();

        $visitor = $session->visit?->user ?? $session->eburol?->user;
        
        // Build analytics data
        $analyticsData = [
            'duration_seconds' => $session->duration_seconds ?? 0,
            'duration_formatted' => $this->formatDuration($session->duration_seconds ?? 0),
            'started_at' => $session->started_at?->toIso8601String(),
            'ended_at' => $session->ended_at?->toIso8601String(),
            'scheduled_start' => $session->scheduled_start?->toIso8601String(),
            'scheduled_end' => $session->scheduled_end?->toIso8601String(),
            'status' => $session->status,
            'end_reason' => $session->end_reason,
        ];

        // Build participant data
        $participants = [];
        if ($visitor) {
            $participants[] = [
                'id' => $visitor->id,
                'name' => trim("{$visitor->first_name} {$visitor->last_name}"),
                'email' => $visitor->email,
                'role' => 'visitor',
                'joined_at' => $session->visitor_joined_at?->toIso8601String(),
            ];
        }
        
        // Add inmate participants
        foreach ($session->inmateTunnels as $tunnel) {
            if ($tunnel->inmate) {
                $participants[] = [
                    'id' => $tunnel->inmate->id,
                    'name' => $tunnel->inmate->full_name,
                    'role' => 'inmate',
                    'joined_at' => $session->inmate_joined_at?->toIso8601String(),
                ];
            }
        }

        // Chat statistics
        $chatStats = [
            'total_messages' => $session->chatLogs->count(),
            'flagged_messages' => $session->chatLogs->where('flagged', true)->count(),
            'first_message_at' => $session->chatLogs->min('sent_at'),
            'last_message_at' => $session->chatLogs->max('sent_at'),
        ];

        $sessionData = [
            'id' => $session->id,
            'meeting_id' => $session->room_id,
            'room_id' => $session->room_id,
            'session_id' => $session->session_id ?? $session->room_id,
            'visit_type' => $session->visit_id ? 'visit' : 'eburol',
            'status' => $session->status,
            'session_started_at' => $session->started_at?->format('Y-m-d H:i:s'),
            'session_ended_at' => $session->ended_at?->format('Y-m-d H:i:s'),
            'duration' => $this->formatDuration($session->duration_seconds ?? 0),
            'duration_seconds' => $session->duration_seconds ?? 0,
            'unique_participants_count' => count($participants),
            'visitor_name' => $visitor ? trim("{$visitor->first_name} {$visitor->last_name}") : 'Unknown',
            'visitor_email' => $visitor?->email ?? null,
            'inmate_name' => $session->inmateTunnels->first()?->inmate?->full_name ?? 'N/A',
            'jail_officer_name' => $session->monitor?->name ?? null,
            'jail_officer_email' => $session->monitor?->email ?? null,
            'notes' => null,
            'participants' => $participants,
            'analytics' => $analyticsData,
            'chat_stats' => $chatStats,
            'timeline' => $this->buildParticipantTimeline($session),
            'has_chat_logs' => $session->chatLogs->count() > 0,
            'has_recording' => $session->videoRecordings->count() > 0,
        ];

        return Inertia::render('JailOfficer/VisitMonitoredSessionDetails', [
            'session' => $sessionData,
        ]);
    }

    /**
     * Build participant timeline for the session.
     */
    private function buildParticipantTimeline(VisitSession $session): array
    {
        $timeline = [];
        
        // Add visitor join event
        if ($session->visitor_joined_at) {
            $timeline[] = [
                'participant_name' => 'Visitor',
                'role' => 'visitor',
                'event' => 'joined',
                'timestamp' => $session->visitor_joined_at->toIso8601String(),
            ];
        }
        
        // Add inmate join event
        if ($session->inmate_joined_at) {
            $timeline[] = [
                'participant_name' => $session->inmateTunnels->first()?->inmate?->full_name ?? 'Inmate',
                'role' => 'inmate',
                'event' => 'joined',
                'timestamp' => $session->inmate_joined_at->toIso8601String(),
            ];
        }
        
        // Add session start
        if ($session->started_at) {
            $timeline[] = [
                'participant_name' => 'System',
                'role' => 'system',
                'event' => 'session_started',
                'timestamp' => $session->started_at->toIso8601String(),
            ];
        }
        
        // Add session end
        if ($session->ended_at) {
            $timeline[] = [
                'participant_name' => 'System',
                'role' => 'system',
                'event' => 'session_ended',
                'timestamp' => $session->ended_at->toIso8601String(),
                'reason' => $session->end_reason,
            ];
        }
        
        // Sort by timestamp
        usort($timeline, function($a, $b) {
            return strtotime($a['timestamp']) - strtotime($b['timestamp']);
        });

        return $timeline;
    }

    /**
     * Download chat logs for a session as CSV.
     */
    public function downloadChat(string $meetingId)
    {
        // Find visit session by room_id
        $session = VisitSession::with(['chatLogs.senderUser'])
            ->where('room_id', $meetingId)
            ->firstOrFail();

        if ($session->chatLogs->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'No chat logs found for this session'
            ], 404);
        }

        // Create CSV file
        $csvData = "Timestamp,Sender Name,Sender ID,Message,Flagged\n";
        
        foreach ($session->chatLogs as $log) {
            $timestamp = $log->sent_at?->format('Y-m-d H:i:s') ?? '';
            $senderName = str_replace('"', '""', $log->sender ?? 'Unknown');
            $senderId = $log->sender_id ?? 'N/A';
            $message = str_replace('"', '""', $log->message ?? '');
            $flagged = $log->flagged ? 'Yes' : 'No';
            
            $csvData .= sprintf(
                '"%s","%s","%s","%s","%s"' . "\n",
                $timestamp,
                $senderName,
                $senderId,
                $message,
                $flagged
            );
        }

        $filename = "chat_log_{$meetingId}_" . now()->format('Ymd_His') . ".csv";
        
        return response($csvData)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }

    /**
     * Format duration in human readable format.
     */
    private function formatDuration(?int $seconds): string
    {
        if (!$seconds) return '0s';
        
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $secs = $seconds % 60;

        if ($hours > 0) {
            return sprintf('%dh %dm %ds', $hours, $minutes, $secs);
        } elseif ($minutes > 0) {
            return sprintf('%dm %ds', $minutes, $secs);
        }

        return sprintf('%ds', $secs);
    }
}
