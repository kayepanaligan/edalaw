<?php

namespace App\Http\Controllers\Dashboard;

use App\AppealStatus;
use App\ApprovalStatus;
use App\EburolStatus;
use App\Http\Controllers\Controller;
use App\Models\Appeal;
use App\Models\ChatFlag;
use App\Models\Eburol;
use App\Models\Incident;
use App\Models\MonitoringLog;
use App\Models\MonitoringSession;
use App\Models\Role;
use App\Models\Suggestion;
use App\Models\User;
use App\Models\Visit;
use App\SuggestionStatus;
use App\VisitType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminDashboardController extends Controller
{
    /**
     * Resolve date range from preset or custom inputs.
     *
     * @return array{0: Carbon, 1: Carbon}
     */
    private function resolveDateRange(Request $request): array
    {
        $preset = $request->input('date_preset', 'last_30_days');
        $from = $request->input('date_from');
        $to = $request->input('date_to');
        if ($from && $to && $preset === 'custom') {
            $start = Carbon::parse($from)->startOfDay();
            $end = Carbon::parse($to)->endOfDay();

            return [$start, $end];
        }
        $end = Carbon::now()->endOfDay();
        $start = match ($preset) {
            'today' => Carbon::now()->startOfDay(),
            'yesterday' => Carbon::yesterday()->startOfDay(),
            'last_7_days' => Carbon::now()->subDays(6)->startOfDay(),
            'last_30_days' => Carbon::now()->subDays(29)->startOfDay(),
            'this_month' => Carbon::now()->startOfMonth(),
            'last_month' => Carbon::now()->subMonth()->startOfMonth(),
            'this_year' => Carbon::now()->startOfYear(),
            default => Carbon::now()->subDays(29)->startOfDay(),
        };
        if ($preset === 'yesterday') {
            $end = Carbon::yesterday()->endOfDay();
        } elseif ($preset === 'last_month') {
            $end = Carbon::now()->subMonth()->endOfMonth();
        }

        return [$start, $end];
    }

    public function __invoke(Request $request): Response
    {
        [$dateFrom, $dateTo] = $this->resolveDateRange($request);
        $dateFromStr = $dateFrom->format('Y-m-d');
        $dateToStr = $dateTo->format('Y-m-d');
        $visitTypeFilter = $request->input('visit_type'); // all, virtual, physical, eburol
        $statusFilter = $request->input('status'); // all, pending, approved, etc.
        $timeGrouping = $request->input('time_grouping', 'daily'); // daily, weekly, monthly, quarterly, yearly
        $recordingFilter = $request->input('recording_compliance', 'all'); // all, recorded_only, not_recorded
        $violationFilter = $request->input('violation', 'all'); // all, flagged_only, terminated_only
        $monitoringOfficerId = $request->input('monitoring_officer_id');
        $inmateSearch = $request->input('inmate');

        $totalUsers = User::count();
        $pendingUsers = User::where('approval_status', ApprovalStatus::Pending)->count();
        $approvedUsers = User::where('approval_status', ApprovalStatus::Approved)->count();
        $rejectedUsers = User::where('approval_status', ApprovalStatus::Rejected)->count();

        $recentUsers = User::with('role')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role?->slug,
                    'role_name' => $user->role?->name,
                    'approval_status' => $user->approval_status,
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $usersByRole = User::with('role')
            ->get()
            ->groupBy(function ($user) {
                return $user->role?->slug ?? 'no_role';
            })
            ->map(function ($users) {
                return $users->count();
            })
            ->toArray();

        // Appeals statistics
        $appealsStats = [
            'total' => Appeal::count(),
            'pending' => Appeal::where('status', AppealStatus::Pending)->count(),
            'approved' => Appeal::where('status', AppealStatus::Approved)->count(),
            'rejected' => Appeal::where('status', AppealStatus::Rejected)->count(),
            'by_type' => [
                'visit' => Appeal::where('appealable_type', Visit::class)->count(),
                'eburol' => Appeal::where('appealable_type', Eburol::class)->count(),
            ],
        ];

        // Suggestions/Complaints statistics
        $suggestionsStats = [
            'total' => Suggestion::count(),
            'pending' => Suggestion::where('status', SuggestionStatus::Pending)->count(),
            'suggestions' => Suggestion::where('type', 'suggestion')->count(),
            'complaints' => Suggestion::where('type', 'complaint')->count(),
            'resolved' => Suggestion::where('status', SuggestionStatus::Resolved)->count(),
            'reviewed' => Suggestion::where('status', SuggestionStatus::Reviewed)->count(),
            'in_progress' => Suggestion::where('status', SuggestionStatus::InProgress)->count(),
            'dismissed' => Suggestion::where('status', SuggestionStatus::Dismissed)->count(),
        ];

        // E-Burol statistics
        $eburolStats = [
            'total' => Eburol::count(),
            'pending' => Eburol::where('status', EburolStatus::Pending)->count(),
            'approved' => Eburol::where('status', EburolStatus::Approved)->count(),
            'rejected' => Eburol::where('status', EburolStatus::Rejected)->count(),
            'completed' => Eburol::where('status', EburolStatus::Completed)->count(),
        ];

        // Get visitors only
        $visitorRole = Role::where('slug', 'visitor')->first();
        $visitors = $visitorRole ? User::where('role_id', $visitorRole->id)->get() : collect();

        // Gender distribution of visitors
        $genderDistribution = $visitors->groupBy('gender')
            ->map(fn ($group) => $group->count())
            ->toArray();

        // Visit type distribution (with optional filters)
        $visitBase = Visit::whereBetween('scheduled_date', [$dateFromStr, $dateToStr]);
        $this->applyVisitFilters($visitBase, $visitTypeFilter, $statusFilter, $inmateSearch, $monitoringOfficerId);
        $visitTypeDistribution = [
            'physical' => (clone $visitBase)->where('visit_type', VisitType::Physical)->count(),
            'virtual' => (clone $visitBase)->where('visit_type', VisitType::Virtual)->count(),
        ];

        // Appeals by type (already calculated above)
        $appealsByType = $appealsStats['by_type'];

        // Feedback by type
        $feedbackByType = [
            'suggestions' => Suggestion::where('type', 'suggestion')->count(),
            'complaints' => Suggestion::where('type', 'complaint')->count(),
        ];

        // Location distribution (default: by barangay)
        // Handle filtering based on request parameters
        $provinceFilter = request()->input('province');
        $municipalityFilter = request()->input('municipality');
        $barangayFilter = request()->input('barangay');

        // Location data for filters
        $provinces = User::where('role_id', $visitorRole?->id)
            ->whereNotNull('province')
            ->distinct()
            ->orderBy('province')
            ->pluck('province')
            ->filter()
            ->values()
            ->toArray();

        // Get municipalities - filter by province if provided
        $municipalityQuery = User::where('role_id', $visitorRole?->id)
            ->whereNotNull('municipality');
        if ($provinceFilter && $provinceFilter !== 'all') {
            $municipalityQuery->where('province', $provinceFilter);
        }
        $municipalities = $municipalityQuery
            ->distinct()
            ->orderBy('municipality')
            ->pluck('municipality')
            ->filter()
            ->values()
            ->toArray();

        // Get barangays - filter by province and municipality if provided
        $barangayQuery = User::where('role_id', $visitorRole?->id)
            ->whereNotNull('brgy');
        if ($provinceFilter && $provinceFilter !== 'all') {
            $barangayQuery->where('province', $provinceFilter);
        }
        if ($municipalityFilter && $municipalityFilter !== 'all') {
            $barangayQuery->where('municipality', $municipalityFilter);
        }
        $barangays = $barangayQuery
            ->distinct()
            ->orderBy('brgy')
            ->pluck('brgy')
            ->filter()
            ->values()
            ->toArray();

        $filteredVisitors = $visitors;
        if ($provinceFilter && $provinceFilter !== 'all') {
            $filteredVisitors = $filteredVisitors->where('province', $provinceFilter);
        }
        if ($municipalityFilter && $municipalityFilter !== 'all') {
            $filteredVisitors = $filteredVisitors->where('municipality', $municipalityFilter);
        }
        if ($barangayFilter && $barangayFilter !== 'all') {
            $filteredVisitors = $filteredVisitors->where('brgy', $barangayFilter);
        }

        // Group by barangay for the chart
        $locationDistribution = $filteredVisitors
            ->whereNotNull('brgy')
            ->groupBy('brgy')
            ->map(fn ($group) => $group->count())
            ->sortDesc()
            ->take(20)
            ->map(fn ($count, $brgy) => ['name' => $brgy, 'count' => $count])
            ->values()
            ->toArray();

        // Age distribution
        $ageDistribution = $visitors
            ->whereNotNull('dob')
            ->map(function ($visitor) {
                $dob = \Carbon\Carbon::parse($visitor->dob);
                $age = $dob->age;

                return $age;
            })
            ->filter()
            ->groupBy(function ($age) {
                // Group into age ranges: 0-18, 19-25, 26-35, 36-45, 46-55, 56-65, 65+
                if ($age < 19) {
                    return '0-18';
                } elseif ($age < 26) {
                    return '19-25';
                } elseif ($age < 36) {
                    return '26-35';
                } elseif ($age < 46) {
                    return '36-45';
                } elseif ($age < 56) {
                    return '46-55';
                } elseif ($age < 66) {
                    return '56-65';
                } else {
                    return '65+';
                }
            })
            ->map(fn ($group) => $group->count())
            ->toArray();

        // Format age distribution for chart
        $ageChartData = [
            ['name' => '0-18', 'count' => $ageDistribution['0-18'] ?? 0],
            ['name' => '19-25', 'count' => $ageDistribution['19-25'] ?? 0],
            ['name' => '26-35', 'count' => $ageDistribution['26-35'] ?? 0],
            ['name' => '36-45', 'count' => $ageDistribution['36-45'] ?? 0],
            ['name' => '46-55', 'count' => $ageDistribution['46-55'] ?? 0],
            ['name' => '56-65', 'count' => $ageDistribution['56-65'] ?? 0],
            ['name' => '65+', 'count' => $ageDistribution['65+'] ?? 0],
        ];

        // Visit Volume Over Time (filtered by date range and grouping)
        $visitVolumeData = $this->getVisitVolumeOverTime($dateFrom, $dateTo, $timeGrouping, $visitTypeFilter, $statusFilter);

        // Peak Usage Hours (sessions per hour/day, in date range)
        $peakUsageData = $this->getPeakUsageHours($dateFrom, $dateTo);

        // Incident Reports Summary
        $incidentReportsData = $this->getIncidentReportsSummary();

        // Flagged Chat Messages Over Time (date range)
        $flaggedMessagesData = $this->getFlaggedChatMessagesOverTime($dateFrom, $dateTo);

        // Session Enforcement Actions
        $enforcementActionsData = $this->getSessionEnforcementActions();

        // Physical Visit Key Usage
        $keyUsageData = $this->getPhysicalVisitKeyUsage();

        // Complaints & Reviews Trend (date range)
        $complaintsTrendData = $this->getComplaintsAndReviewsTrend($dateFrom, $dateTo);

        $filters = [
            'date_preset' => $request->input('date_preset', 'last_30_days'),
            'date_from' => $dateFromStr,
            'date_to' => $dateToStr,
            'time_grouping' => $timeGrouping,
            'visit_type' => $visitTypeFilter,
            'status' => $statusFilter,
            'recording_compliance' => $recordingFilter,
            'violation' => $violationFilter,
            'monitoring_officer_id' => $monitoringOfficerId,
            'inmate' => $inmateSearch,
        ];

        $monitoringOfficersForFilter = User::whereHas('role', fn ($q) => $q->where('slug', 'monitoring_officer'))
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name'])
            ->map(fn ($u) => ['id' => $u->id, 'name' => trim($u->first_name.' '.$u->last_name)])
            ->values()
            ->toArray();

        return Inertia::render('Dashboard/SuperAdmin', [
            'filters' => $filters,
            'monitoring_officers' => $monitoringOfficersForFilter,
            'stats' => [
                'total_users' => $totalUsers,
                'pending_users' => $pendingUsers,
                'approved_users' => $approvedUsers,
                'rejected_users' => $rejectedUsers,
            ],
            'recent_users' => $recentUsers,
            'users_by_role' => $usersByRole,
            'appeals_stats' => $appealsStats,
            'suggestions_stats' => $suggestionsStats,
            'eburol_stats' => $eburolStats,
            'gender_distribution' => $genderDistribution,
            'visit_type_distribution' => $visitTypeDistribution,
            'appeals_by_type' => $appealsByType,
            'feedback_by_type' => $feedbackByType,
            'provinces' => $provinces,
            'municipalities' => $municipalities,
            'barangays' => $barangays,
            'location_distribution' => $locationDistribution,
            'age_distribution' => $ageChartData,
            'visit_volume_over_time' => $visitVolumeData,
            'peak_usage_hours' => $peakUsageData,
            'incident_reports_summary' => $incidentReportsData,
            'flagged_messages_over_time' => $flaggedMessagesData,
            'enforcement_actions' => $enforcementActionsData,
            'physical_visit_key_usage' => $keyUsageData,
            'complaints_reviews_trend' => $complaintsTrendData,
        ]);
    }

    /**
     * Apply global visit filters to a Visit query builder.
     */
    private function applyVisitFilters($query, ?string $visitType, ?string $status, ?string $inmateSearch, $monitoringOfficerId): void
    {
        if ($visitType && $visitType !== 'all' && in_array($visitType, ['virtual', 'physical'], true)) {
            $query->where('visit_type', $visitType);
        }
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }
        if ($inmateSearch) {
            $query->where(function ($q) use ($inmateSearch) {
                $q->where('inmate_first_name', 'like', "%{$inmateSearch}%")
                    ->orWhere('inmate_last_name', 'like', "%{$inmateSearch}%");
            });
        }
        if ($monitoringOfficerId) {
            $query->where('monitoring_officer_id', $monitoringOfficerId);
        }
    }

    /**
     * Get visit volume over time (filtered, grouped by time_grouping).
     */
    private function getVisitVolumeOverTime(Carbon $startDate, Carbon $endDate, string $timeGrouping, ?string $visitTypeFilter, ?string $statusFilter): array
    {
        $query = Visit::whereBetween('scheduled_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
        $this->applyVisitFilters($query, $visitTypeFilter, $statusFilter, null, null);
        $visits = $query->get()->groupBy(function ($visit) use ($timeGrouping) {
            $d = $visit->scheduled_date instanceof Carbon ? $visit->scheduled_date->copy() : Carbon::parse($visit->scheduled_date);

            return match ($timeGrouping) {
                'weekly' => $d->startOfWeek()->format('Y-m-d'),
                'monthly' => $d->format('Y-m'),
                'quarterly' => $d->quarter.'-'.$d->format('Y'),
                'yearly' => $d->format('Y'),
                default => $d->format('Y-m-d'),
            };
        });

        $periods = [];
        $current = $startDate->copy();
        while ($current <= $endDate) {
            $key = match ($timeGrouping) {
                'weekly' => $current->copy()->startOfWeek()->format('Y-m-d'),
                'monthly' => $current->format('Y-m'),
                'quarterly' => $current->quarter.'-'.$current->format('Y'),
                'yearly' => $current->format('Y'),
                default => $current->format('Y-m-d'),
            };
            if (! isset($periods[$key])) {
                $periods[$key] = match ($timeGrouping) {
                    'weekly' => 'Week '.$current->format('M j'),
                    'monthly' => $current->format('M Y'),
                    'quarterly' => 'Q'.$current->quarter.' '.$current->format('Y'),
                    'yearly' => $current->format('Y'),
                    default => $current->format('M d'),
                };
            }
            $current = match ($timeGrouping) {
                'weekly' => $current->addWeek(),
                'monthly' => $current->addMonth(),
                'quarterly' => $current->addQuarter(),
                'yearly' => $current->addYear(),
                default => $current->addDay(),
            };
        }

        $data = [];
        foreach ($periods as $key => $label) {
            $bucket = $visits->get($key, collect());
            $data[] = [
                'date' => $label,
                'physical' => $bucket->where('visit_type', VisitType::Physical)->count(),
                'virtual' => $bucket->where('visit_type', VisitType::Virtual)->count(),
            ];
        }

        return array_slice($data, 0, 60);
    }

    /**
     * Get peak usage hours (sessions per hour/day) in date range.
     */
    private function getPeakUsageHours(Carbon $dateFrom, Carbon $dateTo): array
    {
        $sessions = MonitoringSession::whereNotNull('started_at')
            ->whereBetween('started_at', [$dateFrom, $dateTo])
            ->get();

        $hourlyData = array_fill(0, 24, 0);
        foreach ($sessions as $session) {
            $hour = (int) $session->started_at->format('H');
            $hourlyData[$hour]++;
        }

        $data = [];
        foreach ($hourlyData as $hour => $count) {
            $data[] = [
                'hour' => sprintf('%02d:00', $hour),
                'sessions' => $count,
            ];
        }

        return $data;
    }

    /**
     * Get incident reports summary (minor, major, critical).
     */
    private function getIncidentReportsSummary(): array
    {
        $incidents = Incident::select('classification', DB::raw('count(*) as count'))
            ->groupBy('classification')
            ->get()
            ->pluck('count', 'classification')
            ->toArray();

        return [
            'minor' => $incidents['minor'] ?? 0,
            'major' => $incidents['major'] ?? 0,
            'critical' => $incidents['critical'] ?? 0,
        ];
    }

    /**
     * Get flagged chat messages over time (date range).
     */
    private function getFlaggedChatMessagesOverTime(Carbon $startDate, Carbon $endDate): array
    {
        $flags = ChatFlag::whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->groupBy(fn ($flag) => $flag->created_at->format('Y-m-d'));

        $data = [];
        $currentDate = $startDate->copy();
        while ($currentDate <= $endDate) {
            $dateKey = $currentDate->format('Y-m-d');
            $data[] = [
                'date' => $currentDate->format('M d'),
                'count' => $flags->get($dateKey, collect())->count(),
            ];
            $currentDate->addDay();
        }

        return $data;
    }

    /**
     * Get session enforcement actions (forced mutes, terminations, chat locks).
     */
    private function getSessionEnforcementActions(): array
    {
        // Forced mutes (disabled microphone)
        $forcedMutes = MonitoringLog::where('action', 'disabled_microphone')->count();

        // Session terminations
        $terminations = MonitoringLog::where('action', 'terminated_session')->count();

        // Chat locks
        $chatLocks = MonitoringLog::where('action', 'locked_chat')->count();

        return [
            'forced_mutes' => $forcedMutes,
            'terminations' => $terminations,
            'chat_locks' => $chatLocks,
        ];
    }

    /**
     * Get physical visit key usage (generated, used, expired).
     */
    private function getPhysicalVisitKeyUsage(): array
    {
        $physicalVisits = Visit::where('visit_type', VisitType::Physical)
            ->whereNotNull('access_key')
            ->get();

        $generated = $physicalVisits->count();
        $used = $physicalVisits->filter(function ($visit) {
            return $visit->status->value === 'completed' || $visit->status->value === 'approved';
        })->count();
        $expired = $physicalVisits->filter(function ($visit) {
            return $visit->access_key_expires_at && Carbon::parse($visit->access_key_expires_at)->isPast();
        })->count();

        return [
            'generated' => $generated,
            'used' => $used,
            'expired' => $expired,
        ];
    }

    /**
     * Get complaints and reviews trend (date range).
     */
    private function getComplaintsAndReviewsTrend(Carbon $startDate, Carbon $endDate): array
    {
        $complaints = Suggestion::where('type', 'complaint')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->groupBy(fn ($c) => $c->created_at->format('Y-m-d'));

        $resolved = Suggestion::where('type', 'complaint')
            ->where('status', SuggestionStatus::Resolved)
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->get()
            ->groupBy(fn ($c) => $c->updated_at->format('Y-m-d'));

        $data = [];
        $currentDate = $startDate->copy();
        while ($currentDate <= $endDate) {
            $dateKey = $currentDate->format('Y-m-d');
            $data[] = [
                'date' => $currentDate->format('M d'),
                'submitted' => $complaints->get($dateKey, collect())->count(),
                'resolved' => $resolved->get($dateKey, collect())->count(),
            ];
            $currentDate->addDay();
        }

        return $data;
    }
}
