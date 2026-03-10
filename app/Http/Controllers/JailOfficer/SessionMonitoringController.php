<?php

namespace App\Http\Controllers\JailOfficer;

use App\Http\Controllers\Controller;
use App\Models\MonitoringSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SessionMonitoringController extends Controller
{
    /**
     * Display the session monitoring page.
     */
    public function index(): Response
    {
        $sessions = MonitoringSession::with(['visitor', 'visit', 'eburol', 'monitor'])
            ->where('status', 'active')
            ->orderBy('started_at', 'desc')
            ->get()
            ->map(function ($session) {
                $visitorName = $session->visitor
                    ? trim("{$session->visitor->first_name} {$session->visitor->middle_name} {$session->visitor->last_name}")
                    : 'Unknown';

                $sessionDetails = null;
                if ($session->session_type === 'visit' && $session->visit) {
                    $sessionDetails = [
                        'type' => 'visit',
                        'inmate_name' => trim("{$session->visit->inmate_first_name} {$session->visit->inmate_middle_name} {$session->visit->inmate_last_name}"),
                        'scheduled_date' => $session->visit->scheduled_date->format('Y-m-d'),
                        'scheduled_time' => $session->visit->scheduled_time,
                    ];
                } elseif ($session->session_type === 'eburol' && $session->eburol) {
                    $sessionDetails = [
                        'type' => 'eburol',
                        'inmate_name' => trim("{$session->eburol->inmate_first_name} {$session->eburol->inmate_middle_name} {$session->eburol->inmate_last_name}"),
                        'deceased_name' => trim("{$session->eburol->deceased_first_name} {$session->eburol->deceased_middle_name} {$session->eburol->deceased_last_name}"),
                        'wake_start_date' => $session->eburol->wake_start_date->format('Y-m-d'),
                    ];
                }

                return [
                    'id' => $session->id,
                    'session_token' => $session->session_token,
                    'session_type' => $session->session_type,
                    'visitor_name' => $visitorName,
                    'visitor_id' => $session->visitor_id,
                    'started_at' => $session->started_at->format('Y-m-d H:i:s'),
                    'duration_seconds' => $session->duration_seconds,
                    'connection_health' => $session->connection_health,
                    'session_details' => $sessionDetails,
                    'monitored_by' => $session->monitored_by,
                    'monitor_name' => $session->monitor
                        ? trim("{$session->monitor->first_name} {$session->monitor->middle_name} {$session->monitor->last_name}")
                        : null,
                ];
            });

        return Inertia::render('MonitoringOfficer/SessionMonitoring', [
            'sessions' => $sessions,
        ]);
    }

    /**
     * Join a session as silent supervisor.
     */
    public function join(Request $request, MonitoringSession $session)
    {
        $user = auth()->user();

        // Update session to be monitored by this user
        $session->update([
            'monitored_by' => $user->id,
        ]);

        // Log the action
        \App\Models\MonitoringLog::create([
            'monitoring_session_id' => $session->id,
            'monitor_id' => $user->id,
            'action' => 'joined_session',
            'description' => 'Monitoring officer joined session as silent supervisor',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'success' => true,
            'session_token' => $session->session_token,
            'message' => 'Successfully joined session',
        ]);
    }
}
