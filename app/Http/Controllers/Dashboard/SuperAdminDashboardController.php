<?php

namespace App\Http\Controllers\Dashboard;

use App\AppealStatus;
use App\ApprovalStatus;
use App\Http\Controllers\Controller;
use App\Models\Appeal;
use App\Models\Eburol;
use App\Models\Suggestion;
use App\Models\User;
use App\Models\Visit;
use App\SuggestionStatus;
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
        ]);
    }
}
