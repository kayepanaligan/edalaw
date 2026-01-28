<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Inertia\Inertia;
use Inertia\Response;

class RequestManagementController extends Controller
{
    /**
     * Display the request management page.
     */
    public function index(): Response
    {
        $visits = Visit::where('user_id', auth()->id())
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($visit) {
                return [
                    'id' => $visit->id,
                    'scheduled_date' => $visit->scheduled_date->format('Y-m-d'),
                    'scheduled_time' => $visit->scheduled_time,
                    'visit_type' => $visit->visit_type->value,
                    'inmate_first_name' => $visit->inmate_first_name,
                    'inmate_middle_name' => $visit->inmate_middle_name,
                    'inmate_last_name' => $visit->inmate_last_name,
                    'status' => $visit->status->value,
                    'notes' => $visit->notes,
                    'created_at' => $visit->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $visit->updated_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Visitor/RequestManagement', [
            'requests' => $visits,
        ]);
    }
}
