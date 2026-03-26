<?php

namespace App\Http\Controllers\JailOfficer;

use App\Http\Controllers\Controller;
use App\Models\ChatLog;
use App\Models\InmateTunnel;
use App\Models\SystemLog;
use App\Models\VideoRecording;
use App\Models\VisitSession;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $dateFrom = $request->input('date_from', now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->input('date_to', now()->format('Y-m-d'));
        $groupBy = $request->input('group_by', 'day'); // day, week, month
        $visitType = $request->input('visit_type'); // null = all, visit, eburol

        $baseSessionQuery = VisitSession::where('monitor_id', $user->id)
            ->orWhereHas('visit', function ($q) use ($user) {
                $q->where('jail_officer_id', $user->id);
            });
        $this->applyDateFilter($baseSessionQuery, $dateFrom, $dateTo, 'scheduled_start');

        if ($visitType === 'visit') {
            $baseSessionQuery->whereNotNull('visit_id');
        } elseif ($visitType === 'eburol') {
            $baseSessionQuery->whereNotNull('eburol_id');
        }

        $sessionIds = (clone $baseSessionQuery)->pluck('id');
        if ($sessionIds->isEmpty()) {
            $sessionIds = collect([0]); // Avoid empty whereIn; no session will match 0
        }

        // (1) Active Sessions Overview Cards
        $activeSessions = VisitSession::where('monitor_id', $user->id)->where('status', 'active')->count();
        $pendingScheduled = VisitSession::where('monitor_id', $user->id)
            ->where('status', 'scheduled')
            ->where('scheduled_start', '>=', now())
            ->count();
        $tunnelsToday = InmateTunnel::whereIn('visit_session_id', $sessionIds)
            ->whereDate('created_at', today())
            ->count();
        $currentlyRecording = VisitSession::where('monitor_id', $user->id)
            ->where('recording_status', 'recording')
            ->count();

        // (2) Visit Volume Over Time
        $volumeQuery = VisitSession::where('monitor_id', $user->id)
            ->whereBetween(DB::raw('DATE(scheduled_start)'), [$dateFrom, $dateTo]);
        if ($visitType === 'visit') {
            $volumeQuery->whereNotNull('visit_id');
        } elseif ($visitType === 'eburol') {
            $volumeQuery->whereNotNull('eburol_id');
        }
        $volumeRaw = $volumeQuery->selectRaw("DATE(scheduled_start) as d, CASE WHEN visit_id IS NOT NULL THEN 'visit' ELSE 'eburol' END as typ, COUNT(*) as cnt")
            ->groupBy('d', 'typ')
            ->get();
        $volumeByPeriod = $this->groupVolumeByPeriod($volumeRaw, $dateFrom, $dateTo, $groupBy);

        // (3) Session Status Distribution
        $statusDistribution = VisitSession::where('monitor_id', $user->id)
            ->when($dateFrom && $dateTo, fn ($q) => $q->whereBetween(DB::raw('DATE(scheduled_start)'), [$dateFrom, $dateTo]))
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // (4) Call Duration Analysis (from video_recordings)
        $durationQuery = VideoRecording::whereIn('visit_session_id', $sessionIds)
            ->whereNotNull('duration_seconds');
        $durationByDay = (clone $durationQuery)
            ->selectRaw('DATE(ended_at) as d, AVG(duration_seconds) as avg_sec, MIN(duration_seconds) as min_sec, MAX(duration_seconds) as max_sec')
            ->groupBy('d')
            ->orderBy('d')
            ->get()
            ->map(fn ($r) => [
                'date' => $r->d,
                'avg_seconds' => (int) round($r->avg_sec),
                'min_seconds' => (int) $r->min_sec,
                'max_seconds' => (int) $r->max_sec,
            ]);
        $durationByType = VideoRecording::whereIn('visit_session_id', $sessionIds)
            ->join('visit_sessions', 'video_recordings.visit_session_id', '=', 'visit_sessions.id')
            ->whereNotNull('video_recordings.duration_seconds')
            ->selectRaw("CASE WHEN visit_sessions.visit_id IS NOT NULL THEN 'visit' ELSE 'eburol' END as typ, AVG(video_recordings.duration_seconds) as avg_sec, MIN(video_recordings.duration_seconds) as min_sec, MAX(video_recordings.duration_seconds) as max_sec")
            ->groupBy('typ')
            ->get();

        // (5) Flagged Messages Trend (auto vs manual)
        $flaggedQuery = ChatLog::whereIn('visit_session_id', $sessionIds)->where('flagged', true);
        $flaggedTrend = $flaggedQuery->clone()
            ->selectRaw("DATE(sent_at) as d, CASE WHEN flagged_by IS NULL THEN 'auto' ELSE 'manual' END as flag_type, COUNT(*) as cnt")
            ->groupBy('d', 'flag_type')
            ->orderBy('d')
            ->get()
            ->groupBy('d')
            ->map(fn ($rows) => ['date' => $rows->first()->d, 'auto' => $rows->where('flag_type', 'auto')->sum('cnt'), 'manual' => $rows->where('flag_type', 'manual')->sum('cnt')])
            ->values()
            ->toArray();

        // (6) Violations & Terminations Report Table
        $terminations = VisitSession::where('monitor_id', $user->id)
            ->whereIn('status', ['completed', 'terminated'])
            ->when($dateFrom && $dateTo, fn ($q) => $q->whereBetween(DB::raw('DATE(ended_at)'), [$dateFrom, $dateTo]))
            ->whereNotNull('ended_at')
            ->with(['visit.user', 'eburol.user', 'visit', 'eburol', 'chatLogs'])
            ->orderByDesc('ended_at')
            ->limit(100)
            ->get()
            ->map(function (VisitSession $s) {
                $visitor = $s->visit?->user ?? $s->eburol?->user;
                $visitorName = $visitor ? trim("{$visitor->first_name} {$visitor->last_name}") : null;
                $flaggedCount = $s->chatLogs->where('flagged', true)->count();

                return [
                    'id' => $s->id,
                    'session_type' => $s->session_type,
                    'visitor_name' => $visitorName,
                    'ended_at' => $s->ended_at?->toIso8601String(),
                    'end_reason' => $s->end_reason,
                    'status' => $s->status,
                    'flagged_messages' => $flaggedCount,
                ];
            });

        // (7) Recording Storage Summary
        $recordingQuery = VideoRecording::whereIn('visit_session_id', $sessionIds);
        if ($dateFrom && $dateTo) {
            $recordingQuery->whereBetween(DB::raw('DATE(ended_at)'), [$dateFrom, $dateTo]);
        }
        $totalRecordings = $recordingQuery->count();
        $totalDurationSeconds = (clone $recordingQuery)->sum('duration_seconds') ?: 0;
        $recordingSummary = [
            'total_count' => $totalRecordings,
            'total_duration_hours' => round($totalDurationSeconds / 3600, 2),
        ];

        // (8) Chat Activity Heatmap (hour of day 0-23, count messages)
        $heatmapRaw = ChatLog::whereIn('visit_session_id', $sessionIds)
            ->when($dateFrom && $dateTo, fn ($q) => $q->whereBetween(DB::raw('DATE(sent_at)'), [$dateFrom, $dateTo]))
            ->selectRaw('HOUR(sent_at) as hour, COUNT(*) as cnt')
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();
        $heatmap = array_fill(0, 24, 0);
        foreach ($heatmapRaw as $r) {
            $heatmap[(int) $r->hour] = (int) $r->cnt;
        }

        // (9) Monitor Enforcement Activity Log
        $enforcementLogs = SystemLog::whereIn('visit_session_id', $sessionIds)
            ->when($dateFrom && $dateTo, fn ($q) => $q->whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo]))
            ->orderByDesc('created_at')
            ->limit(200)
            ->get()
            ->map(fn (SystemLog $l) => [
                'id' => $l->id,
                'visit_session_id' => $l->visit_session_id,
                'action' => $l->action,
                'performed_by' => $l->performed_by,
                'created_at' => $l->created_at->toIso8601String(),
                'metadata' => $l->metadata,
            ]);

        // (10) Compliance Summary (% sessions fully recorded)
        $completedSessions = VisitSession::where('monitor_id', $user->id)
            ->whereIn('status', ['completed', 'terminated'])
            ->when($dateFrom && $dateTo, fn ($q) => $q->whereBetween(DB::raw('DATE(ended_at)'), [$dateFrom, $dateTo]));
        $completedTotal = $completedSessions->count();
        $withRecording = (clone $completedSessions)->whereHas('videoRecordings')->count();
        $compliancePercent = $completedTotal > 0 ? round($withRecording / $completedTotal * 100, 1) : 0;

        return Inertia::render('MonitoringOfficer/Analytics', [
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'group_by' => $groupBy,
                'visit_type' => $visitType,
            ],
            'overviewCards' => [
                'active_sessions' => $activeSessions,
                'pending_scheduled' => $pendingScheduled,
                'tunnels_generated_today' => $tunnelsToday,
                'currently_recording' => $currentlyRecording,
            ],
            'volumeOverTime' => $volumeByPeriod,
            'statusDistribution' => $statusDistribution,
            'durationByDay' => $durationByDay,
            'durationByType' => $durationByType,
            'flaggedTrend' => $flaggedTrend,
            'terminations' => $terminations,
            'recordingSummary' => $recordingSummary,
            'chatHeatmap' => $heatmap,
            'enforcementLogs' => $enforcementLogs,
            'compliance' => [
                'percent' => $compliancePercent,
                'sessions_with_recording' => $withRecording,
                'completed_total' => $completedTotal,
            ],
        ]);
    }

    private function applyDateFilter($query, ?string $dateFrom, ?string $dateTo, string $column): void
    {
        if ($dateFrom) {
            $query->whereRaw("DATE({$column}) >= ?", [$dateFrom]);
        }
        if ($dateTo) {
            $query->whereRaw("DATE({$column}) <= ?", [$dateTo]);
        }
    }

    /**
     * @param  \Illuminate\Support\Collection  $volumeRaw  rows with d, typ, cnt
     * @return array<int, array{period: string, visit: int, eburol: int}>
     */
    private function groupVolumeByPeriod($volumeRaw, string $dateFrom, string $dateTo, string $groupBy): array
    {
        $start = Carbon::parse($dateFrom);
        $end = Carbon::parse($dateTo);
        $result = [];
        if ($groupBy === 'month') {
            $current = $start->copy()->startOfMonth();
            while ($current->lte($end)) {
                $key = $current->format('Y-m');
                $result[$key] = ['period' => $current->format('M Y'), 'visit' => 0, 'eburol' => 0];
                $current->addMonth();
            }
            foreach ($volumeRaw as $r) {
                $key = Carbon::parse($r->d)->format('Y-m');
                if (isset($result[$key])) {
                    $result[$key][$r->typ] = ($result[$key][$r->typ] ?? 0) + $r->cnt;
                }
            }
        } elseif ($groupBy === 'week') {
            $current = $start->copy()->startOfWeek();
            $endWeek = $end->copy()->startOfWeek();
            while ($current->lte($endWeek)) {
                $key = $current->format('Y-m-d');
                $result[$key] = ['period' => 'Week of '.$current->format('M j, Y'), 'visit' => 0, 'eburol' => 0];
                $current->addWeek();
            }
            foreach ($volumeRaw as $r) {
                $c = Carbon::parse($r->d)->startOfWeek();
                $key = $c->format('Y-m-d');
                if (isset($result[$key])) {
                    $result[$key][$r->typ] = ($result[$key][$r->typ] ?? 0) + $r->cnt;
                }
            }
        } else {
            $current = $start->copy();
            while ($current->lte($end)) {
                $key = $current->format('Y-m-d');
                $result[$key] = ['period' => $current->format('M j, Y'), 'visit' => 0, 'eburol' => 0];
                $current->addDay();
            }
            foreach ($volumeRaw as $r) {
                if (isset($result[$r->d])) {
                    $result[$r->d][$r->typ] = ($result[$r->d][$r->typ] ?? 0) + $r->cnt;
                }
            }
        }

        return array_values($result);
    }

    public function exportCsv(Request $request)
    {
        $user = $request->user();
        $dateFrom = $request->input('date_from', now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->input('date_to', now()->format('Y-m-d'));

        $sessions = VisitSession::where('monitor_id', $user->id)
            ->whereBetween(DB::raw('DATE(scheduled_start)'), [$dateFrom, $dateTo])
            ->with(['visit.user', 'eburol.user'])
            ->orderBy('scheduled_start')
            ->get();

        $csv = "Session ID,Type,Scheduled Start,Scheduled End,Status,Visitor,End Reason,Flagged Messages\n";
        foreach ($sessions as $s) {
            $visitor = $s->visit?->user ?? $s->eburol?->user;
            $visitorName = $visitor ? trim("{$visitor->first_name} {$visitor->last_name}") : '';
            $flagged = $s->chatLogs()->where('flagged', true)->count();
            $csv .= sprintf("%d,%s,%s,%s,%s,\"%s\",%s,%d\n",
                $s->id,
                $s->session_type,
                $s->scheduled_start?->format('Y-m-d H:i'),
                $s->scheduled_end?->format('Y-m-d H:i'),
                $s->status,
                $visitorName,
                $s->end_reason ?? '',
                $flagged
            );
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="analytics-sessions-'.now()->format('Y-m-d').'.csv"',
        ]);
    }
}
