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
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminDashboardController extends Controller
{
    public function __invoke(): Response
    {
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

        // Visit type distribution
        $visitTypeDistribution = [
            'physical' => Visit::where('visit_type', VisitType::Physical)->count(),
            'virtual' => Visit::where('visit_type', VisitType::Virtual)->count(),
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

        // Visit Volume Over Time (last 30 days, grouped by day)
        $visitVolumeData = $this->getVisitVolumeOverTime();

        // Peak Usage Hours (sessions per hour/day)
        $peakUsageData = $this->getPeakUsageHours();

        // Incident Reports Summary
        $incidentReportsData = $this->getIncidentReportsSummary();

        // Flagged Chat Messages Over Time
        $flaggedMessagesData = $this->getFlaggedChatMessagesOverTime();

        // Session Enforcement Actions
        $enforcementActionsData = $this->getSessionEnforcementActions();

        // Physical Visit Key Usage
        $keyUsageData = $this->getPhysicalVisitKeyUsage();

        // Complaints & Reviews Trend
        $complaintsTrendData = $this->getComplaintsAndReviewsTrend();

        return Inertia::render('Dashboard/SuperAdmin', [
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
     * Get visit volume over time (last 30 days, grouped by day, separated by visit type).
     */
    private function getVisitVolumeOverTime(): array
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        $visits = Visit::whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->groupBy(function ($visit) {
                return $visit->created_at->format('Y-m-d');
            });

        $data = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $dateKey = $currentDate->format('Y-m-d');
            $dayVisits = $visits->get($dateKey, collect());

            $data[] = [
                'date' => $currentDate->format('M d'),
                'physical' => $dayVisits->where('visit_type', VisitType::Physical)->count(),
                'virtual' => $dayVisits->where('visit_type', VisitType::Virtual)->count(),
            ];

            $currentDate->addDay();
        }

        return $data;
    }

    /**
     * Get peak usage hours (sessions per hour/day).
     */
    private function getPeakUsageHours(): array
    {
        $sessions = MonitoringSession::whereNotNull('started_at')
            ->get();

        $hourlyData = [];
        for ($hour = 0; $hour < 24; $hour++) {
            $hourlyData[$hour] = 0;
        }

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
     * Get flagged chat messages over time (last 30 days).
     */
    private function getFlaggedChatMessagesOverTime(): array
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        $flags = ChatFlag::whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->groupBy(function ($flag) {
                return $flag->created_at->format('Y-m-d');
            });

        $data = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $dateKey = $currentDate->format('Y-m-d');
            $count = $flags->get($dateKey, collect())->count();

            $data[] = [
                'date' => $currentDate->format('M d'),
                'count' => $count,
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
     * Get complaints and reviews trend (last 30 days).
     */
    private function getComplaintsAndReviewsTrend(): array
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        $complaints = Suggestion::where('type', 'complaint')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->groupBy(function ($complaint) {
                return $complaint->created_at->format('Y-m-d');
            });

        $resolved = Suggestion::where('type', 'complaint')
            ->where('status', SuggestionStatus::Resolved)
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->get()
            ->groupBy(function ($complaint) {
                return $complaint->updated_at->format('Y-m-d');
            });

        $data = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $dateKey = $currentDate->format('Y-m-d');
            $submitted = $complaints->get($dateKey, collect())->count();
            $resolvedCount = $resolved->get($dateKey, collect())->count();

            $data[] = [
                'date' => $currentDate->format('M d'),
                'submitted' => $submitted,
                'resolved' => $resolvedCount,
            ];

            $currentDate->addDay();
        }

        return $data;
    }
}
