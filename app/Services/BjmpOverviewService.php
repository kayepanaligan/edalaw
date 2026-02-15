<?php

namespace App\Services;

use App\Models\ChatLog;
use App\Models\Eburol;
use App\Models\SystemLog;
use App\Models\TimeSlotCapacity;
use App\Models\VideoRecording;
use App\Models\Visit;
use App\Models\VisitSession;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BjmpOverviewService
{
    /**
     * Get facility-wide overview data for BJMP dashboard.
     *
     * @param  array{date_from: string, date_to: string, visit_type: string|null, group_by: string}  $filters
     * @return array<string, mixed>
     */
    public function getOverviewData(array $filters): array
    {
        $dateFrom = $filters['date_from'] ?? now()->format('Y-m-d');
        $dateTo = $filters['date_to'] ?? now()->format('Y-m-d');
        $visitType = $filters['visit_type'] ?? null;
        $groupBy = $filters['group_by'] ?? 'day';

        $sessionQuery = VisitSession::query();
        $this->applySessionDateFilter($sessionQuery, $dateFrom, $dateTo, 'scheduled_start');
        $this->applyVisitTypeFilter($sessionQuery, $visitType);
        $sessionIds = (clone $sessionQuery)->pluck('id');
        if ($sessionIds->isEmpty()) {
            $sessionIds = collect([0]);
        }

        $kpis = $this->getKpis($dateFrom, $dateTo, $visitType);
        $visitVolumeOverTime = $this->getVisitVolumeOverTime($dateFrom, $dateTo, $groupBy, $visitType);
        $sessionStatusDistribution = $this->getSessionStatusDistribution($dateFrom, $dateTo, $visitType);
        $facilityUtilization = $this->getFacilityUtilization($dateFrom, $dateTo, $visitType);
        $violationFlagTrend = $this->getViolationFlagTrend($dateFrom, $dateTo, $sessionIds);
        $peakVisitationHeatmap = $this->getPeakVisitationHeatmap($dateFrom, $dateTo, $visitType);
        $topInmatesByVisitFrequency = $this->getTopInmatesByVisitFrequency($dateFrom, $dateTo, $visitType);
        $monitorActivitySnapshot = $this->getMonitorActivitySnapshot($dateFrom, $dateTo);
        $recordingStorageSummary = $this->getRecordingStorageSummary($dateFrom, $dateTo, $sessionIds);
        $recentCriticalEvents = $this->getRecentCriticalEvents(50);

        return [
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'visit_type' => $visitType,
                'group_by' => $groupBy,
            ],
            'kpis' => $kpis,
            'visitVolumeOverTime' => $visitVolumeOverTime,
            'sessionStatusDistribution' => $sessionStatusDistribution,
            'facilityUtilization' => $facilityUtilization,
            'violationFlagTrend' => $violationFlagTrend,
            'peakVisitationHeatmap' => $peakVisitationHeatmap,
            'topInmatesByVisitFrequency' => $topInmatesByVisitFrequency,
            'monitorActivitySnapshot' => $monitorActivitySnapshot,
            'recordingStorageSummary' => $recordingStorageSummary,
            'recentCriticalEvents' => $recentCriticalEvents,
        ];
    }

    /**
     * @return array<string, int|float>
     */
    private function getKpis(string $dateFrom, string $dateTo, ?string $visitType): array
    {
        $today = now()->format('Y-m-d');

        $visitsQuery = Visit::whereBetween('scheduled_date', [$dateFrom, $dateTo]);
        $this->applyVisitTypeFilterOnVisits($visitsQuery, $visitType);
        $eburolQuery = Eburol::whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo]);
        if ($visitType === 'eburol') {
            $totalVisitsToday = Eburol::whereDate('created_at', $today)->count();
            $totalRequestsToday = $eburolQuery->count();
        } elseif ($visitType === 'virtual' || $visitType === 'physical') {
            $totalVisitsToday = (clone $visitsQuery)->where('scheduled_date', $today)->count();
            $totalRequestsToday = $visitsQuery->count();
        } else {
            $totalVisitsToday = (clone $visitsQuery)->where('scheduled_date', $today)->count()
                + Eburol::whereDate('created_at', $today)->count();
            $totalRequestsToday = $visitsQuery->count() + $eburolQuery->count();
        }

        $sessionQuery = VisitSession::whereBetween(DB::raw('DATE(scheduled_start)'), [$dateFrom, $dateTo]);
        $this->applyVisitTypeFilter($sessionQuery, $visitType);

        $activeSessionsNow = VisitSession::where('status', 'active')->count();
        $pendingApprovals = Visit::where('status', 'pending')->count() + Eburol::where('status', 'pending')->count();
        $scheduledSessionsToday = (clone $sessionQuery)->whereDate('scheduled_start', $today)->where('status', 'scheduled')->count();
        $terminatedSessionsToday = VisitSession::where('status', 'terminated')
            ->whereBetween(DB::raw('DATE(ended_at)'), [$dateFrom, $dateTo])
            ->whereDate('ended_at', $today)
            ->count();

        $flaggedToday = ChatLog::where('flagged', true)
            ->whereBetween(DB::raw('DATE(flagged_at)'), [$dateFrom, $dateTo])
            ->when($dateFrom === $today && $dateTo === $today, fn ($q) => $q->whereDate('flagged_at', $today))
            ->count();
        $flaggedTotalInRange = ChatLog::where('flagged', true)
            ->whereBetween(DB::raw('COALESCE(DATE(flagged_at), DATE(sent_at))'), [$dateFrom, $dateTo])
            ->count();

        $completedSessions = VisitSession::whereIn('status', ['completed', 'terminated'])
            ->whereBetween(DB::raw('DATE(ended_at)'), [$dateFrom, $dateTo]);
        $this->applyVisitTypeFilter($completedSessions, $visitType);
        $completedTotal = (clone $completedSessions)->count();
        $withRecording = (clone $completedSessions)->whereHas('videoRecordings')->count();
        $recordingComplianceRate = $completedTotal > 0 ? round($withRecording / $completedTotal * 100, 1) : 0.0;

        return [
            'total_visits_today' => $totalVisitsToday,
            'active_sessions_now' => $activeSessionsNow,
            'pending_approvals' => $pendingApprovals,
            'scheduled_sessions_today' => $scheduledSessionsToday,
            'terminated_sessions_today' => $terminatedSessionsToday,
            'total_flagged_today' => $flaggedTotalInRange,
            'recording_compliance_rate' => $recordingComplianceRate,
        ];
    }

    /**
     * @return array<int, array{period: string, virtual: int, physical: int, eburol: int}>
     */
    private function getVisitVolumeOverTime(string $dateFrom, string $dateTo, string $groupBy, ?string $visitType): array
    {
        $q = VisitSession::query()
            ->leftJoin('visits', 'visit_sessions.visit_id', '=', 'visits.id')
            ->whereBetween(DB::raw('DATE(visit_sessions.scheduled_start)'), [$dateFrom, $dateTo])
            ->selectRaw("DATE(visit_sessions.scheduled_start) as d,
                CASE
                    WHEN visit_sessions.eburol_id IS NOT NULL THEN 'eburol'
                    WHEN visits.visit_type = 'physical' THEN 'physical'
                    ELSE 'virtual'
                END as typ,
                COUNT(*) as cnt")
            ->groupBy('d', 'typ');
        $this->applyVisitTypeFilterOnVolumeQuery($q, $visitType);
        $volumeRaw = $q->get();

        return $this->groupVolumeByPeriod($volumeRaw->groupBy('d'), $dateFrom, $dateTo, $groupBy);
    }

    /**
     * @return array<string, int>
     */
    private function getSessionStatusDistribution(string $dateFrom, string $dateTo, ?string $visitType): array
    {
        $q = VisitSession::whereBetween(DB::raw('DATE(scheduled_start)'), [$dateFrom, $dateTo]);
        $this->applyVisitTypeFilter($q, $visitType);
        $dist = $q->selectRaw('status, COUNT(*) as count')->groupBy('status')->pluck('count', 'status')->toArray();

        $noShow = VisitSession::where('status', 'scheduled')
            ->where('scheduled_end', '<', now())
            ->whereBetween(DB::raw('DATE(scheduled_start)'), [$dateFrom, $dateTo]);
        $this->applyVisitTypeFilter($noShow, $visitType);
        $noShowCount = $noShow->count();
        if ($noShowCount > 0) {
            $dist['no_show'] = $noShowCount;
            if (isset($dist['scheduled'])) {
                $dist['scheduled'] = max(0, $dist['scheduled'] - $noShowCount);
            }
        }

        return $dist;
    }

    /**
     * @return array<int, array{date: string, scheduled: int, available_slots: int, utilization_percent: float}>
     */
    private function getFacilityUtilization(string $dateFrom, string $dateTo, ?string $visitType): array
    {
        $days = [];
        $start = Carbon::parse($dateFrom);
        $end = Carbon::parse($dateTo);
        while ($start->lte($end)) {
            $d = $start->format('Y-m-d');
            $scheduled = VisitSession::whereDate('scheduled_start', $d)->count();
            $availableSlots = TimeSlotCapacity::query()->sum('max_capacity');
            if ($availableSlots <= 0) {
                $availableSlots = 1;
            }
            $utilizationPercent = round(min(100, $scheduled / $availableSlots * 100), 1);
            $days[] = [
                'date' => $d,
                'scheduled' => $scheduled,
                'available_slots' => (int) $availableSlots,
                'utilization_percent' => $utilizationPercent,
            ];
            $start->addDay();
        }

        return $days;
    }

    /**
     * @param  \Illuminate\Support\Collection<int, int>  $sessionIds
     * @return array<int, array{date: string, flagged_count: int, terminated_count: int}>
     */
    private function getViolationFlagTrend(string $dateFrom, string $dateTo, $sessionIds): array
    {
        $flagged = ChatLog::whereIn('visit_session_id', $sessionIds)
            ->where('flagged', true)
            ->whereBetween(DB::raw('COALESCE(DATE(flagged_at), DATE(sent_at))'), [$dateFrom, $dateTo])
            ->selectRaw('COALESCE(DATE(flagged_at), DATE(sent_at)) as d, COUNT(*) as cnt')
            ->groupBy('d')
            ->pluck('cnt', 'd');

        $terminated = VisitSession::where('status', 'terminated')
            ->whereBetween(DB::raw('DATE(ended_at)'), [$dateFrom, $dateTo])
            ->selectRaw('DATE(ended_at) as d, COUNT(*) as cnt')
            ->groupBy('d')
            ->pluck('cnt', 'd');

        $start = Carbon::parse($dateFrom);
        $end = Carbon::parse($dateTo);
        $result = [];
        while ($start->lte($end)) {
            $d = $start->format('Y-m-d');
            $result[] = [
                'date' => $d,
                'flagged_count' => (int) ($flagged[$d] ?? 0),
                'terminated_count' => (int) ($terminated[$d] ?? 0),
            ];
            $start->addDay();
        }

        return $result;
    }

    /**
     * Hour (0-23) vs day of week (0-6) heatmap data. DB-agnostic: aggregate in PHP.
     *
     * @return array<int, array<int, int>>
     */
    private function getPeakVisitationHeatmap(string $dateFrom, string $dateTo, ?string $visitType): array
    {
        $q = VisitSession::whereBetween(DB::raw('DATE(scheduled_start)'), [$dateFrom, $dateTo])
            ->select('scheduled_start');
        $this->applyVisitTypeFilter($q, $visitType);
        $sessions = $q->get();

        $heatmap = array_fill(0, 24, array_fill(0, 7, 0));
        foreach ($sessions as $s) {
            $dt = $s->scheduled_start;
            if (! $dt) {
                continue;
            }
            $h = (int) $dt->format('G');
            $dow = (int) $dt->format('w');
            $heatmap[$h][$dow] = ($heatmap[$h][$dow] ?? 0) + 1;
        }

        return $heatmap;
    }

    /**
     * @return array<int, array{inmate_name: string, visit_count: int, rank: int}>
     */
    private function getTopInmatesByVisitFrequency(string $dateFrom, string $dateTo, ?string $visitType): array
    {
        $counts = [];
        $visitQuery = Visit::whereBetween('scheduled_date', [$dateFrom, $dateTo])
            ->select('inmate_first_name', 'inmate_last_name');
        $this->applyVisitTypeFilterOnVisits($visitQuery, $visitType);
        foreach ($visitQuery->get() as $v) {
            $name = trim(implode(' ', array_filter([$v->inmate_first_name, $v->inmate_last_name])) ?: 'Unknown');
            $counts[$name] = ($counts[$name] ?? 0) + 1;
        }
        if ($visitType === null || $visitType === 'eburol') {
            $eburols = Eburol::whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo])
                ->select('inmate_first_name', 'inmate_last_name')
                ->get();
            foreach ($eburols as $e) {
                $name = trim(implode(' ', array_filter([$e->inmate_first_name, $e->inmate_last_name])) ?: 'Unknown');
                $counts[$name] = ($counts[$name] ?? 0) + 1;
            }
        }
        arsort($counts, SORT_NUMERIC);
        $result = [];
        $rank = 1;
        foreach (array_slice(array_keys($counts), 0, 20) as $name) {
            $result[] = [
                'inmate_name' => $name,
                'visit_count' => $counts[$name],
                'rank' => $rank++,
            ];
        }

        return $result;
    }

    /**
     * @return array<int, array{monitor_name: string, sessions_supervised_today: int, enforcement_actions: int}>
     */
    private function getMonitorActivitySnapshot(string $dateFrom, string $dateTo): array
    {
        $today = $dateFrom === now()->format('Y-m-d') && $dateTo === now()->format('Y-m-d')
            ? now()->format('Y-m-d')
            : $dateFrom;

        $sessionsByMonitor = VisitSession::whereBetween(DB::raw('DATE(scheduled_start)'), [$dateFrom, $dateTo])
            ->whereNotNull('monitor_id')
            ->selectRaw('monitor_id, COUNT(*) as session_count')
            ->groupBy('monitor_id')
            ->get()
            ->keyBy('monitor_id');

        $sessionIds = VisitSession::whereBetween(DB::raw('DATE(scheduled_start)'), [$dateFrom, $dateTo])
            ->whereNotNull('monitor_id')
            ->pluck('id');
        if ($sessionIds->isEmpty()) {
            $sessionIds = collect([0]);
        }
        $enforcementByUser = SystemLog::whereIn('visit_session_id', $sessionIds)
            ->whereNotNull('performed_by')
            ->whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo])
            ->selectRaw('performed_by, COUNT(*) as action_count')
            ->groupBy('performed_by')
            ->pluck('action_count', 'performed_by');

        $userIds = $sessionsByMonitor->keys()->merge($enforcementByUser->keys())->unique();
        $users = \App\Models\User::whereIn('id', $userIds)->get()->keyBy('id');

        $result = [];
        foreach ($userIds as $uid) {
            $user = $users->get($uid);
            $result[] = [
                'monitor_name' => $user ? trim("{$user->first_name} {$user->last_name}") : 'Unknown',
                'sessions_supervised_today' => (int) ($sessionsByMonitor->get($uid)?->session_count ?? 0),
                'enforcement_actions' => (int) ($enforcementByUser->get($uid) ?? 0),
            ];
        }
        usort($result, fn ($a, $b) => $b['sessions_supervised_today'] <=> $a['sessions_supervised_today']);

        return array_slice($result, 0, 30);
    }

    /**
     * @param  \Illuminate\Support\Collection<int, int>  $sessionIds
     * @return array{total_count: int, total_hours: float}
     */
    private function getRecordingStorageSummary(string $dateFrom, string $dateTo, $sessionIds): array
    {
        $q = VideoRecording::whereIn('visit_session_id', $sessionIds)
            ->whereBetween(DB::raw('DATE(ended_at)'), [$dateFrom, $dateTo]);
        $totalCount = $q->count();
        $totalSeconds = (clone $q)->sum('duration_seconds') ?: 0;

        return [
            'total_count' => $totalCount,
            'total_hours' => round($totalSeconds / 3600, 2),
        ];
    }

    /**
     * @return array<int, array{id: int, action: string, performed_by_name: string|null, created_at: string, metadata: array|null, session_id: int|null}>
     */
    private function getRecentCriticalEvents(int $limit): array
    {
        $criticalActions = ['terminate', 'terminated', 'flag', 'lock_chat', 'manual_enforcement', 'enforcement'];
        $logs = SystemLog::whereIn('action', $criticalActions)
            ->with('performedBy:id,first_name,last_name')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $flagged = ChatLog::where('flagged', true)
            ->with('flaggedByUser:id,first_name,last_name')
            ->orderByDesc('flagged_at')
            ->limit((int) ceil($limit / 2))
            ->get();

        $events = [];
        foreach ($logs as $l) {
            $events[] = [
                'id' => 'log_'.$l->id,
                'type' => 'system_log',
                'action' => $l->action,
                'performed_by_name' => $l->performedBy ? trim("{$l->performedBy->first_name} {$l->performedBy->last_name}") : null,
                'created_at' => $l->created_at->toIso8601String(),
                'metadata' => $l->metadata,
                'session_id' => $l->visit_session_id,
            ];
        }
        foreach ($flagged as $f) {
            $events[] = [
                'id' => 'flag_'.$f->id,
                'type' => 'flag',
                'action' => 'message_flagged',
                'performed_by_name' => $f->flaggedByUser ? trim("{$f->flaggedByUser->first_name} {$f->flaggedByUser->last_name}") : null,
                'created_at' => $f->flagged_at?->toIso8601String() ?? $f->sent_at->toIso8601String(),
                'metadata' => ['reason' => $f->flag_reason],
                'session_id' => $f->visit_session_id,
            ];
        }
        usort($events, fn ($a, $b) => strcmp($b['created_at'], $a['created_at']));

        return array_slice($events, 0, $limit);
    }

    private function applySessionDateFilter($query, ?string $dateFrom, ?string $dateTo, string $column): void
    {
        if ($dateFrom) {
            $query->whereRaw("DATE({$column}) >= ?", [$dateFrom]);
        }
        if ($dateTo) {
            $query->whereRaw("DATE({$column}) <= ?", [$dateTo]);
        }
    }

    private function applyVisitTypeFilter($query, ?string $visitType): void
    {
        if ($visitType === 'virtual') {
            $query->whereNotNull('visit_id')->whereHas('visit', fn ($q) => $q->where('visit_type', 'virtual'));
        } elseif ($visitType === 'physical') {
            $query->whereNotNull('visit_id')->whereHas('visit', fn ($q) => $q->where('visit_type', 'physical'));
        } elseif ($visitType === 'eburol') {
            $query->whereNotNull('eburol_id');
        }
    }

    private function applyVisitTypeFilterOnVisits($query, ?string $visitType): void
    {
        if ($visitType === 'virtual') {
            $query->where('visit_type', 'virtual');
        } elseif ($visitType === 'physical') {
            $query->where('visit_type', 'physical');
        }
    }

    private function applyVisitTypeFilterOnVolumeQuery($query, ?string $visitType): void
    {
        if ($visitType === 'virtual') {
            $query->whereNotNull('visit_sessions.visit_id')->where('visits.visit_type', 'virtual');
        } elseif ($visitType === 'physical') {
            $query->whereNotNull('visit_sessions.visit_id')->where('visits.visit_type', 'physical');
        } elseif ($visitType === 'eburol') {
            $query->whereNotNull('visit_sessions.eburol_id');
        }
    }

    /**
     * @param  \Illuminate\Support\Collection  $grouped  keyed by date d
     * @return array<int, array{period: string, virtual: int, physical: int, eburol: int}>
     */
    private function groupVolumeByPeriod($grouped, string $dateFrom, string $dateTo, string $groupBy): array
    {
        $start = Carbon::parse($dateFrom);
        $end = Carbon::parse($dateTo);
        $result = [];

        if ($groupBy === 'month') {
            $current = $start->copy()->startOfMonth();
            while ($current->lte($end)) {
                $key = $current->format('Y-m');
                $result[$key] = ['period' => $current->format('M Y'), 'virtual' => 0, 'physical' => 0, 'eburol' => 0];
                $current->addMonth();
            }
            foreach ($grouped as $d => $rows) {
                $key = Carbon::parse($d)->format('Y-m');
                if (isset($result[$key])) {
                    foreach ($rows as $r) {
                        $typ = $r->typ ?? 'virtual';
                        $result[$key][$typ] = ($result[$key][$typ] ?? 0) + ($r->cnt ?? 0);
                    }
                }
            }
        } elseif ($groupBy === 'week') {
            $current = $start->copy()->startOfWeek();
            $endWeek = $end->copy()->startOfWeek();
            while ($current->lte($endWeek)) {
                $key = $current->format('Y-m-d');
                $result[$key] = ['period' => 'Week of '.$current->format('M j, Y'), 'virtual' => 0, 'physical' => 0, 'eburol' => 0];
                $current->addWeek();
            }
            foreach ($grouped as $d => $rows) {
                $c = Carbon::parse($d)->startOfWeek();
                $key = $c->format('Y-m-d');
                if (isset($result[$key])) {
                    foreach ($rows as $r) {
                        $typ = $r->typ ?? 'virtual';
                        $result[$key][$typ] = ($result[$key][$typ] ?? 0) + ($r->cnt ?? 0);
                    }
                }
            }
        } else {
            $current = $start->copy();
            while ($current->lte($end)) {
                $key = $current->format('Y-m-d');
                $result[$key] = ['period' => $current->format('M j, Y'), 'virtual' => 0, 'physical' => 0, 'eburol' => 0];
                $current->addDay();
            }
            foreach ($grouped as $d => $rows) {
                if (isset($result[$d])) {
                    foreach ($rows as $r) {
                        $typ = $r->typ ?? 'virtual';
                        $result[$d][$typ] = ($result[$d][$typ] ?? 0) + ($r->cnt ?? 0);
                    }
                }
            }
        }

        return array_values($result);
    }
}
