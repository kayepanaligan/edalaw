<?php

namespace App\Http\Controllers\JailOfficer;

use App\Http\Controllers\Controller;
use App\Models\VideoRecording;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VideoRecordingsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isSuperAdmin = $user->role?->slug === 'super_admin';

        $query = VideoRecording::with(['visitSession.visit.user', 'visitSession.eburol.user', 'visitSession.visit', 'visitSession.eburol']);

        if (! $isSuperAdmin) {
            $query->whereHas('visitSession', function ($q) use ($user) {
                $q->where('monitor_id', $user->id);
            });
        }

        if ($request->filled('type')) {
            $type = $request->input('type');
            if ($type === 'visit') {
                $query->whereHas('visitSession', function ($q) {
                    $q->whereNotNull('visit_id');
                });
            } elseif ($type === 'eburol') {
                $query->whereHas('visitSession', function ($q) {
                    $q->whereNotNull('eburol_id');
                });
            }
        }
        if ($request->filled('date_from')) {
            $query->whereDate('started_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('ended_at', '<=', $request->input('date_to'));
        }

        $recordings = $query->orderByDesc('ended_at')->get()->map(function (VideoRecording $rec) {
            $session = $rec->visitSession;
            $visitor = $session->visit?->user ?? $session->eburol?->user;
            $visitorName = $visitor ? trim("{$visitor->first_name} {$visitor->middle_name} {$visitor->last_name}") : null;
            $inmateName = $session->visit
                ? trim("{$session->visit->inmate_first_name} {$session->visit->inmate_middle_name} {$session->visit->inmate_last_name}")
                : trim("{$session->eburol->inmate_first_name} {$session->eburol->inmate_middle_name} {$session->eburol->inmate_last_name}");

            return [
                'id' => $rec->id,
                'visit_session_id' => $rec->visit_session_id,
                'session_type' => $session->session_type,
                'visitor_name' => $visitorName,
                'inmate_name' => $inmateName,
                'duration_seconds' => $rec->duration_seconds,
                'started_at' => $rec->started_at?->toIso8601String(),
                'ended_at' => $rec->ended_at?->toIso8601String(),
                'end_reason' => $rec->end_reason,
                'recording_url' => $rec->recording_url,
                'file_path' => $rec->file_path,
                'storage_disk' => $rec->storage_disk,
            ];
        });

        return Inertia::render('MonitoringOfficer/VideoRecordings', [
            'recordings' => $recordings,
            'filters' => [
                'type' => $request->input('type'),
                'date_from' => $request->input('date_from'),
                'date_to' => $request->input('date_to'),
            ],
        ]);
    }
}
