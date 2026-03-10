<?php

namespace App\Http\Controllers\JailOfficer;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IncidentReportingController extends Controller
{
    /**
     * Display incidents for sessions the monitoring officer is responsible for.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Incident::with(['monitoringSession.monitor', 'reportedBy'])
            ->whereHas('monitoringSession', fn ($q) => $q->where('monitored_by', $user->id));

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('classification', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhereHas('reportedBy', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('classification') && $request->classification !== 'all') {
            $query->where('classification', $request->classification);
        }

        $incidents = $query->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Incident $incident) => [
                'id' => $incident->id,
                'title' => $incident->title,
                'description' => $incident->description,
                'classification' => $incident->classification,
                'status' => $incident->status,
                'reported_by_name' => $incident->reportedBy
                    ? trim("{$incident->reportedBy->first_name} {$incident->reportedBy->last_name}")
                    : null,
                'reported_by_email' => $incident->reportedBy?->email,
                'created_at' => $incident->created_at->toIso8601String(),
                'created_at_human' => $incident->created_at->diffForHumans(),
                'reviewed_at' => $incident->reviewed_at?->toIso8601String(),
            ]);

        return Inertia::render('MonitoringOfficer/IncidentReporting', [
            'incidents' => $incidents,
            'filters' => [
                'search' => $request->search,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'status' => $request->status ?? 'all',
                'classification' => $request->classification ?? 'all',
            ],
        ]);
    }
}
