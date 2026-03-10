<?php

namespace App\Http\Controllers\JailOfficer;

use App\Http\Controllers\Controller;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    /**
     * Display system log history for the monitoring officer (transactions they performed).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = SystemLog::with(['visitSession.visit.user', 'visitSession.eburol.user'])
            ->where('performed_by', $user->id);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhereHas('visitSession', function ($sessQuery) use ($search) {
                        $sessQuery->where('id', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        if ($request->filled('action') && $request->action !== 'all') {
            $query->where('action', $request->action);
        }

        $logs = $query->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(function (SystemLog $log) {
                $session = $log->visitSession;
                $visitor = $session?->visit?->user ?? $session?->eburol?->user;
                $visitorName = $visitor ? trim("{$visitor->first_name} {$visitor->last_name}") : null;

                return [
                    'id' => $log->id,
                    'visit_session_id' => $log->visit_session_id,
                    'action' => $log->action,
                    'metadata' => $log->metadata,
                    'visitor_name' => $visitorName,
                    'session_type' => $session?->visit_id ? 'visit' : 'eburol',
                    'created_at' => $log->created_at->toIso8601String(),
                    'created_at_human' => $log->created_at->diffForHumans(),
                ];
            });

        $actionOptions = SystemLog::where('performed_by', $user->id)
            ->distinct()
            ->pluck('action')
            ->sort()
            ->values()
            ->toArray();

        return Inertia::render('MonitoringOfficer/History', [
            'logs' => $logs,
            'action_options' => $actionOptions,
            'filters' => [
                'search' => $request->search,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'action' => $request->action ?? 'all',
            ],
        ]);
    }
}
