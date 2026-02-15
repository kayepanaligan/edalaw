<?php

namespace App\Http\Controllers;

use App\Models\ChatExport;
use App\Models\VisitSession;
use App\Services\ChatExportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class VisitSessionChatExportController extends Controller
{
    /**
     * Generate chat export (PDF or DOCX) for the session. Monitor or super_admin only.
     */
    public function store(Request $request, VisitSession $session): JsonResponse
    {
        $user = $request->user();
        $canExport = $session->monitor_id === $user->id || $user->role?->slug === 'super_admin';
        if (! $canExport) {
            abort(403);
        }

        $request->validate(['format' => ['required', 'string', 'in:pdf,docx']]);

        $service = new ChatExportService;
        $export = $service->export($session, $request->input('format'), $user->id);

        return response()->json([
            'id' => $export->id,
            'visit_session_id' => $export->visit_session_id,
            'format' => $export->format,
            'file_path' => $export->file_path,
            'generated_at' => $export->created_at->toIso8601String(),
        ], 201);
    }

    /**
     * Download a chat export file. Monitor or super_admin; or generated_by user.
     */
    public function download(Request $request, ChatExport $chatExport): Response|\Illuminate\Http\RedirectResponse
    {
        $user = $request->user();
        $session = $chatExport->visitSession;
        $canDownload = $session->monitor_id === $user->id
            || $user->role?->slug === 'super_admin'
            || $chatExport->generated_by === $user->id;
        if (! $canDownload) {
            abort(403);
        }

        $disk = config('filesystems.chat_exports_disk', config('filesystems.default'));

        if (! Storage::disk($disk)->exists($chatExport->file_path)) {
            abort(404, 'Export file not found.');
        }

        if ($disk === 's3') {
            return redirect()->away(
                Storage::disk($disk)->temporaryUrl($chatExport->file_path, now()->addMinutes(30))
            );
        }

        $filename = sprintf('chat-export-session-%s.%s', $chatExport->visit_session_id, $chatExport->format);

        return Storage::disk($disk)->download($chatExport->file_path, $filename);
    }
}
