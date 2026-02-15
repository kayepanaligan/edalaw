<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\BjmpOverviewService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BjmpOfficerDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $filters = [
            'date_from' => $request->input('date_from', now()->format('Y-m-d')),
            'date_to' => $request->input('date_to', now()->format('Y-m-d')),
            'visit_type' => $request->input('visit_type'),
            'group_by' => $request->input('group_by', 'day'),
        ];
        $overview = app(BjmpOverviewService::class)->getOverviewData($filters);
        $overview['overviewDataUrl'] = route('dashboard.bjmp-officer.overview-data');
        $overview['exportOverviewUrl'] = route('dashboard.bjmp-officer.export-overview');

        return Inertia::render('Dashboard/BjmpOfficer', $overview);
    }

    /**
     * JSON endpoint for overview data (polling / client-side refresh).
     */
    public function overviewData(Request $request): \Illuminate\Http\JsonResponse
    {
        $filters = [
            'date_from' => $request->input('date_from', now()->format('Y-m-d')),
            'date_to' => $request->input('date_to', now()->format('Y-m-d')),
            'visit_type' => $request->input('visit_type'),
            'group_by' => $request->input('group_by', 'day'),
        ];
        $overview = app(BjmpOverviewService::class)->getOverviewData($filters);

        return response()->json($overview);
    }

    /**
     * Export overview metrics to CSV.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $filters = [
            'date_from' => $request->input('date_from', now()->format('Y-m-d')),
            'date_to' => $request->input('date_to', now()->format('Y-m-d')),
            'visit_type' => $request->input('visit_type'),
            'group_by' => $request->input('group_by', 'day'),
        ];
        $overview = app(BjmpOverviewService::class)->getOverviewData($filters);

        $filename = 'bjmp-overview-'.now()->format('Y-m-d-His').'.csv';

        return response()->streamDownload(function () use ($overview) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Metric', 'Value']);
            foreach ($overview['kpis'] as $key => $value) {
                fputcsv($out, [str_replace('_', ' ', ucfirst($key)), $value]);
            }
            fputcsv($out, []);
            fputcsv($out, ['Recording storage total count', $overview['recordingStorageSummary']['total_count']]);
            fputcsv($out, ['Recording storage total hours', $overview['recordingStorageSummary']['total_hours']]);
            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
