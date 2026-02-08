<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\MonitoringAlert;
use App\Models\MonitoringSession;
use Inertia\Inertia;
use Inertia\Response;

class MonitoringOfficerDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = auth()->user();

        // Get active sessions count
        $activeSessionsCount = MonitoringSession::where('status', 'active')
            ->where('monitored_by', $user->id)
            ->count();

        // Get total sessions today
        $todaySessionsCount = MonitoringSession::where('monitored_by', $user->id)
            ->whereDate('started_at', today())
            ->count();

        // Get unread alerts
        $unreadAlertsCount = MonitoringAlert::where('is_read', false)
            ->where('priority', '!=', 'low')
            ->count();

        // Get pending incidents
        $pendingIncidentsCount = \App\Models\Incident::where('status', 'open')
            ->where('reported_by', $user->id)
            ->count();

        return Inertia::render('Dashboard/MonitoringOfficer', [
            'stats' => [
                'active_sessions' => $activeSessionsCount,
                'today_sessions' => $todaySessionsCount,
                'unread_alerts' => $unreadAlertsCount,
                'pending_incidents' => $pendingIncidentsCount,
            ],
        ]);
    }
}
