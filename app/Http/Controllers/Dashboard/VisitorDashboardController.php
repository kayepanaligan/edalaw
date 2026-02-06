<?php

namespace App\Http\Controllers\Dashboard;

use App\EburolStatus;
use App\Http\Controllers\Controller;
use App\Models\CallLog;
use App\Models\Eburol;
use App\Models\Visit;
use App\VisitStatus;
use App\VisitType;
use Inertia\Inertia;
use Inertia\Response;

class VisitorDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $userId = auth()->id();

        // Total schedules
        $totalSchedules = Visit::where('user_id', $userId)->count();

        // Schedules by status
        $pendingSchedules = Visit::where('user_id', $userId)
            ->where('status', VisitStatus::Pending)
            ->count();

        $approvedSchedules = Visit::where('user_id', $userId)
            ->where('status', VisitStatus::Approved)
            ->count();

        $rejectedSchedules = Visit::where('user_id', $userId)
            ->where('status', VisitStatus::Rejected)
            ->count();

        $completedSchedules = Visit::where('user_id', $userId)
            ->where('status', VisitStatus::Completed)
            ->count();

        $missedSchedules = Visit::where('user_id', $userId)
            ->where('status', VisitStatus::Missed)
            ->count();

        // Visit type statistics
        $physicalVisits = Visit::where('user_id', $userId)
            ->where('visit_type', VisitType::Physical)
            ->count();

        $virtualVisits = Visit::where('user_id', $userId)
            ->where('visit_type', VisitType::Virtual)
            ->count();

        // Recent schedules
        $recentSchedules = Visit::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($visit) {
                return [
                    'id' => $visit->id,
                    'scheduled_date' => $visit->scheduled_date->format('Y-m-d'),
                    'scheduled_time' => $visit->scheduled_time,
                    'visit_type' => $visit->visit_type->value,
                    'inmate_name' => trim(
                        "{$visit->inmate_first_name} {$visit->inmate_middle_name} {$visit->inmate_last_name}"
                    ),
                    'status' => $visit->status->value,
                    'meeting_link' => $visit->meeting_link,
                    'created_at' => $visit->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Call logs statistics
        $totalCalls = CallLog::where('user_id', $userId)->count();
        $incomingCalls = CallLog::where('user_id', $userId)
            ->where('call_type', 'incoming')
            ->count();
        $outgoingCalls = CallLog::where('user_id', $userId)
            ->where('call_type', 'outgoing')
            ->count();
        $completedCalls = CallLog::where('user_id', $userId)
            ->where('status', 'completed')
            ->count();
        $missedCalls = CallLog::where('user_id', $userId)
            ->where('status', 'missed')
            ->count();

        $recentCallLogs = CallLog::where('user_id', $userId)
            ->orderBy('call_date', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'phone_number' => $log->phone_number,
                    'call_type' => $log->call_type,
                    'call_date' => $log->call_date->format('Y-m-d H:i:s'),
                    'duration' => $log->duration,
                    'status' => $log->status,
                ];
            });

        // E-burol statistics
        $totalEburols = Eburol::where('user_id', $userId)->count();
        $pendingEburols = Eburol::where('user_id', $userId)
            ->where('status', EburolStatus::Pending)
            ->count();
        $approvedEburols = Eburol::where('user_id', $userId)
            ->where('status', EburolStatus::Approved)
            ->count();
        $rejectedEburols = Eburol::where('user_id', $userId)
            ->where('status', EburolStatus::Rejected)
            ->count();
        $completedEburols = Eburol::where('user_id', $userId)
            ->where('status', EburolStatus::Completed)
            ->count();

        $recentEburols = Eburol::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($eburol) {
                return [
                    'id' => $eburol->id,
                    'deceased_name' => trim(
                        "{$eburol->deceased_first_name} {$eburol->deceased_middle_name} {$eburol->deceased_last_name}"
                    ),
                    'inmate_name' => trim(
                        "{$eburol->inmate_first_name} {$eburol->inmate_middle_name} {$eburol->inmate_last_name}"
                    ),
                    'relationship' => $eburol->relationship_to_inmate,
                    'wake_start_date' => $eburol->wake_start_date->format('Y-m-d'),
                    'wake_end_date' => $eburol->wake_end_date->format('Y-m-d'),
                    'status' => $eburol->status->value,
                    'created_at' => $eburol->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Dashboard/Visitor', [
            'stats' => [
                'total_schedules' => $totalSchedules,
                'pending_schedules' => $pendingSchedules,
                'approved_schedules' => $approvedSchedules,
                'rejected_schedules' => $rejectedSchedules,
                'completed_schedules' => $completedSchedules,
                'missed_schedules' => $missedSchedules,
            ],
            'visit_types' => [
                'physical' => $physicalVisits,
                'virtual' => $virtualVisits,
            ],
            'recent_schedules' => $recentSchedules,
            'call_logs_stats' => [
                'total_calls' => $totalCalls,
                'incoming_calls' => $incomingCalls,
                'outgoing_calls' => $outgoingCalls,
                'completed_calls' => $completedCalls,
                'missed_calls' => $missedCalls,
            ],
            'recent_call_logs' => $recentCallLogs,
            'eburol_stats' => [
                'total_eburols' => $totalEburols,
                'pending_eburols' => $pendingEburols,
                'approved_eburols' => $approvedEburols,
                'rejected_eburols' => $rejectedEburols,
                'completed_eburols' => $completedEburols,
            ],
            'recent_eburols' => $recentEburols,
        ]);
    }
}
