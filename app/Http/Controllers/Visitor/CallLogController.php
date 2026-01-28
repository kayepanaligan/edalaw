<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\CallLog;
use Inertia\Inertia;
use Inertia\Response;

class CallLogController extends Controller
{
    /**
     * Display the call logs page.
     */
    public function index(): Response
    {
        $callLogs = CallLog::where('user_id', auth()->id())
            ->orderBy('call_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'phone_number' => $log->phone_number,
                    'call_type' => $log->call_type,
                    'call_date' => $log->call_date->format('Y-m-d H:i:s'),
                    'duration' => $log->duration,
                    'notes' => $log->notes,
                    'status' => $log->status,
                    'created_at' => $log->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Visitor/CallLogs', [
            'callLogs' => $callLogs,
        ]);
    }
}
