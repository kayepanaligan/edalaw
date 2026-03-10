<?php

namespace App\Http\Controllers\BjmpOfficer;

use App\EburolStatus;
use App\Http\Controllers\Controller;
use App\Models\Eburol;
use App\Models\MonitoringSession;
use App\Services\AuditLogService;
use App\Services\VideoSdkService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EburolManagementController extends Controller
{
    /**
     * Display the e-burol management page.
     */
    public function index(): Response
    {
        $eburols = Eburol::with('user')
            ->orderBy('wake_start_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($eburol) {
                return [
                    'id' => $eburol->id,
                    'user_id' => $eburol->user_id,
                    'visitor_name' => trim("{$eburol->user->first_name} {$eburol->user->middle_name} {$eburol->user->last_name}"),
                    'visitor_email' => $eburol->user->email,
                    'inmate_first_name' => $eburol->inmate_first_name,
                    'inmate_middle_name' => $eburol->inmate_middle_name,
                    'inmate_last_name' => $eburol->inmate_last_name,
                    'inmate_name' => trim("{$eburol->inmate_first_name} {$eburol->inmate_middle_name} {$eburol->inmate_last_name}"),
                    'deceased_first_name' => $eburol->deceased_first_name,
                    'deceased_middle_name' => $eburol->deceased_middle_name,
                    'deceased_last_name' => $eburol->deceased_last_name,
                    'deceased_name' => trim("{$eburol->deceased_first_name} {$eburol->deceased_middle_name} {$eburol->deceased_last_name}"),
                    'deceased_date_of_death' => $eburol->deceased_date_of_death->format('Y-m-d'),
                    'relationship_to_inmate' => $eburol->relationship_to_inmate,
                    'wake_start_date' => $eburol->wake_start_date->format('Y-m-d'),
                    'wake_end_date' => $eburol->wake_end_date->format('Y-m-d'),
                    'preferred_time' => $eburol->preferred_time,
                    'wake_location' => $eburol->wake_location,
                    'additional_details' => $eburol->additional_details,
                    'status' => $eburol->status->value,
                    'admin_notes' => $eburol->admin_notes,
                    'rejection_reason' => $eburol->rejection_reason,
                    'jail_officer_id' => $eburol->jail_officer_id,
                    'death_certificate_path' => $eburol->death_certificate_path ? route('bjmp-officer.eburols.document.death-certificate', $eburol) : null,
                    'relationship_proof_path' => $eburol->relationship_proof_path ? route('bjmp-officer.eburols.document.relationship-proof', $eburol) : null,
                    'created_at' => $eburol->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $stats = [
            'total' => $eburols->count(),
            'pending' => $eburols->where('status', 'pending')->count(),
            'approved' => $eburols->where('status', 'approved')->count(),
            'rejected' => $eburols->where('status', 'rejected')->count(),
            'completed' => $eburols->where('status', 'completed')->count(),
        ];

        $monitoringOfficers = \App\Models\User::whereHas('role', function ($query) {
            $query->where('slug', 'jail_officer');
        })
            ->where('approval_status', 'approved')
            ->orderBy('first_name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => trim("{$user->first_name} {$user->middle_name} {$user->last_name}"),
                    'email' => $user->email,
                ];
            });

        return Inertia::render('BjmpOfficer/EburolManagement', [
            'eburols' => $eburols,
            'stats' => $stats,
            'monitoringOfficers' => $monitoringOfficers,
        ]);
    }

    /**
     * Approve an e-burol application.
     */
    public function approve(Request $request, Eburol $eburol): RedirectResponse
    {
        $request->validate([
            'jail_officer_id' => ['required', 'exists:users,id'],
        ]);

        // Create VideoSDK room and visit session (with inmate tunnel) before approving
        $videoSdkService = new VideoSdkService;
        $roomName = "eburol-{$eburol->id}-".uniqid();
        $roomResult = $videoSdkService->createRoom($roomName);

        if (! ($roomResult['success'] ?? false)) {
            $errorMessage = $roomResult['error'] ?? 'Video room could not be created.';
            \Illuminate\Support\Facades\Log::error('VideoSDK room creation failed during e-burol approval', [
                'eburol_id' => $eburol->id,
                'error' => $errorMessage,
            ]);

            return redirect()->back()
                ->withErrors(['approve' => 'E-Burol cannot be approved: '.$errorMessage.' Please check VideoSDK configuration and try again.']);
        }

        $roomId = $roomResult['room_id'] ?? null;
        $updateData = [
            'status' => EburolStatus::Approved,
            'jail_officer_id' => $request->jail_officer_id,
            'daily_co_room_id' => $roomId,
            'daily_co_room_name' => $roomResult['room_name'] ?? $roomName,
            'daily_co_room_url' => $roomResult['room_url'] ?? null,
            'room_created_at' => now(),
        ];

        MonitoringSession::create([
            'eburol_id' => $eburol->id,
            'visitor_id' => $eburol->user_id,
            'session_type' => 'eburol',
            'session_token' => $roomId ?? $roomName,
            'status' => 'pending',
            'started_at' => now(),
        ]);

        $eburol->update($updateData);

        $visitSession = app(\App\Services\VisitSessionService::class)->createForEburol($eburol, $roomId);
        if (! $visitSession) {
            \Illuminate\Support\Facades\Log::error('Visit session (inmate tunnel) creation failed during e-burol approval', ['eburol_id' => $eburol->id]);
            $eburol->update(['status' => EburolStatus::Pending]);

            return redirect()->back()
                ->withErrors(['approve' => 'E-Burol could not be approved: visit session and inmate tunnel could not be created. Please ensure a monitoring officer is assigned and try again.']);
        }

        $eburol->refresh();
        \App\Services\NotificationService::notifyMonitoringOfficerAboutEburol($eburol);
        \App\Services\NotificationService::createEburolNotification($eburol, 'approved');

        AuditLogService::logAction(
            'eburol_approved',
            $eburol,
            'E-Burol Management',
            "E-Burol application #{$eburol->id} approved for visitor {$eburol->user->first_name} {$eburol->user->last_name}",
            $request
        );

        return redirect()->route('bjmp-officer.eburols.index')
            ->with('success', 'E-Burol application approved successfully.');
    }

    /**
     * Reject an e-burol application.
     */
    public function reject(Request $request, Eburol $eburol): RedirectResponse
    {
        $request->validate([
            'rejection_reason' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $eburol->update([
            'status' => EburolStatus::Rejected,
            'rejection_reason' => $request->rejection_reason,
        ]);

        \App\Services\NotificationService::createEburolNotification($eburol, 'rejected');

        AuditLogService::logAction(
            'eburol_rejected',
            $eburol,
            'E-Burol Management',
            "E-Burol application #{$eburol->id} rejected for visitor {$eburol->user->first_name} {$eburol->user->last_name}. Reason: ".substr($request->rejection_reason, 0, 100),
            $request,
            ['rejection_reason' => $request->rejection_reason]
        );

        return redirect()->route('bjmp-officer.eburols.index')
            ->with('success', 'E-Burol application rejected successfully.');
    }

    /**
     * Update e-burol status.
     */
    public function updateStatus(Request $request, Eburol $eburol): RedirectResponse
    {
        $request->merge([
            'jail_officer_id' => $request->filled('jail_officer_id') ? $request->jail_officer_id : null,
        ]);

        $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed',
            'rejection_reason' => ['required_if:status,rejected', 'string', 'min:10', 'max:1000'],
            'jail_officer_id' => ['nullable', 'exists:users,id'],
        ]);

        $oldStatus = $eburol->status->value;
        $oldJailOfficerId = $eburol->jail_officer_id;
        $updateData = ['status' => EburolStatus::from($request->status)];

        // If rejecting, require and store rejection reason
        if ($request->status === 'rejected') {
            $updateData['rejection_reason'] = $request->rejection_reason;
        } else {
            // Clear rejection reason if status changes from rejected
            $updateData['rejection_reason'] = null;
        }

        if ($request->filled('jail_officer_id')) {
            $updateData['jail_officer_id'] = $request->jail_officer_id;
        } elseif (in_array($request->status, ['pending', 'rejected', 'completed'], true)) {
            $updateData['jail_officer_id'] = null;
        }

        $eburol->update($updateData);

        $eburol->refresh();
        if ($request->jail_officer_id && $oldJailOfficerId != $request->jail_officer_id && in_array($request->status, ['approved', 'pending'])) {
            \App\Services\NotificationService::notifyMonitoringOfficerAboutEburol($eburol);
        }

        if ($request->status !== 'pending') {
            \App\Services\NotificationService::createEburolNotification($eburol, $request->status);
        }

        $metadata = [
            'old_status' => $oldStatus,
            'new_status' => $request->status,
        ];
        if ($request->status === 'rejected' && $request->rejection_reason) {
            $metadata['rejection_reason'] = $request->rejection_reason;
        }

        AuditLogService::logAction(
            'eburol_status_updated',
            $eburol,
            'E-Burol Management',
            "E-Burol application #{$eburol->id} status updated from {$oldStatus} to {$request->status}",
            $request,
            $metadata
        );

        return redirect()->route('bjmp-officer.eburols.index')
            ->with('success', 'E-Burol status updated successfully.');
    }

    /**
     * Serve death certificate file for viewing (BJMP officer).
     */
    public function deathCertificate(Eburol $eburol): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        if (! $eburol->death_certificate_path || ! Storage::disk('public')->exists($eburol->death_certificate_path)) {
            abort(404, 'Document not found.');
        }

        return response()->file(Storage::disk('public')->path($eburol->death_certificate_path), [
            'Content-Disposition' => 'inline; filename="'.basename($eburol->death_certificate_path).'"',
        ]);
    }

    /**
     * Serve relationship proof file for viewing (BJMP officer).
     */
    public function relationshipProof(Eburol $eburol): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        if (! $eburol->relationship_proof_path || ! Storage::disk('public')->exists($eburol->relationship_proof_path)) {
            abort(404, 'Document not found.');
        }

        return response()->file(Storage::disk('public')->path($eburol->relationship_proof_path), [
            'Content-Disposition' => 'inline; filename="'.basename($eburol->relationship_proof_path).'"',
        ]);
    }
}
