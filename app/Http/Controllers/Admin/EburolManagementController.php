<?php

namespace App\Http\Controllers\Admin;

use App\EburolStatus;
use App\Http\Controllers\Controller;
use App\Models\Eburol;
use App\Models\User;
use App\Services\AuditLogService;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class EburolManagementController extends Controller
{
    /**
     * Display the e-burol management page.
     */
    public function index(Request $request): Response
    {
        $eburols = Eburol::with(['user', 'monitoringOfficer', 'visitSessions.inmateTunnels'])
            ->orderBy('wake_start_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($eburol) {
                $latestSession = $eburol->visitSessions->sortByDesc('scheduled_start')->first();
                $tunnel = $latestSession?->inmateTunnels->first();
                $inmateTunnelCode = $tunnel?->short_code;
                $inmateTunnelStatus = $tunnel ? ($tunnel->is_used ? 'used' : ($tunnel->expires_at->isPast() ? 'expired' : 'active')) : null;

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
                    'monitoring_officer_id' => $eburol->monitoring_officer_id,
                    'monitoring_officer_name' => $eburol->monitoringOfficer ? trim("{$eburol->monitoringOfficer->first_name} {$eburol->monitoringOfficer->middle_name} {$eburol->monitoringOfficer->last_name}") : null,
                    'death_certificate_path' => $eburol->death_certificate_path ? route('admin.eburols.document.death-certificate', $eburol) : null,
                    'relationship_proof_path' => $eburol->relationship_proof_path ? route('admin.eburols.document.relationship-proof', $eburol) : null,
                    'created_at' => $eburol->created_at->format('Y-m-d H:i:s'),
                    'inmate_tunnel_code' => $inmateTunnelCode,
                    'inmate_tunnel_status' => $inmateTunnelStatus,
                ];
            });

        $stats = [
            'total' => $eburols->count(),
            'pending' => $eburols->where('status', 'pending')->count(),
            'approved' => $eburols->where('status', 'approved')->count(),
            'rejected' => $eburols->where('status', 'rejected')->count(),
            'completed' => $eburols->where('status', 'completed')->count(),
        ];

        // Get all visitors for the create form
        $visitors = User::whereHas('role', function ($query) {
            $query->where('slug', 'visitor');
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

        // Get all monitoring officers
        $monitoringOfficers = User::whereHas('role', function ($query) {
            $query->where('slug', 'monitoring_officer');
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

        return Inertia::render('Admin/EburolManagement', [
            'eburols' => $eburols,
            'stats' => $stats,
            'visitors' => $visitors,
            'monitoringOfficers' => $monitoringOfficers,
        ]);
    }

    /**
     * Store a new e-burol application.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => ['required', 'exists:users,id'],
            'inmate_first_name' => ['required', 'string', 'max:255'],
            'inmate_middle_name' => ['nullable', 'string', 'max:255'],
            'inmate_last_name' => ['required', 'string', 'max:255'],
            'deceased_first_name' => ['required', 'string', 'max:255'],
            'deceased_middle_name' => ['nullable', 'string', 'max:255'],
            'deceased_last_name' => ['required', 'string', 'max:255'],
            'deceased_date_of_death' => ['required', 'date', 'before_or_equal:today'],
            'relationship_to_inmate' => ['required', 'string', 'max:255'],
            'wake_start_date' => ['required', 'date', 'after_or_equal:today'],
            'wake_end_date' => ['required', 'date', 'after_or_equal:wake_start_date'],
            'preferred_time' => ['nullable', 'date_format:H:i'],
            'wake_location' => ['required', 'string', 'max:1000'],
            'additional_details' => ['nullable', 'string', 'max:2000'],
            'death_certificate' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'relationship_proof' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'status' => ['nullable', 'in:pending,approved,rejected'],
            'monitoring_officer_id' => ['nullable', 'exists:users,id'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $deathCertificatePath = null;
        $relationshipProofPath = null;

        if ($request->hasFile('death_certificate')) {
            $deathCertificatePath = $request->file('death_certificate')->store('eburols/death_certificates', 'public');
        }

        if ($request->hasFile('relationship_proof')) {
            $relationshipProofPath = $request->file('relationship_proof')->store('eburols/relationship_proofs', 'public');
        }

        $eburol = Eburol::create([
            'user_id' => $request->user_id,
            'monitoring_officer_id' => $request->monitoring_officer_id,
            'inmate_first_name' => $request->inmate_first_name,
            'inmate_middle_name' => $request->inmate_middle_name,
            'inmate_last_name' => $request->inmate_last_name,
            'deceased_first_name' => $request->deceased_first_name,
            'deceased_middle_name' => $request->deceased_middle_name,
            'deceased_last_name' => $request->deceased_last_name,
            'deceased_date_of_death' => $request->deceased_date_of_death,
            'relationship_to_inmate' => $request->relationship_to_inmate,
            'wake_start_date' => $request->wake_start_date,
            'wake_end_date' => $request->wake_end_date,
            'preferred_time' => $request->preferred_time,
            'wake_location' => $request->wake_location,
            'additional_details' => $request->additional_details,
            'death_certificate_path' => $deathCertificatePath,
            'relationship_proof_path' => $relationshipProofPath,
            'status' => $request->status ?? EburolStatus::Pending,
        ]);

        if ($request->monitoring_officer_id) {
            NotificationService::notifyMonitoringOfficerAboutEburol($eburol);
        }

        if ($eburol->status !== EburolStatus::Pending) {
            NotificationService::createEburolNotification($eburol, $eburol->status->value);
        }

        AuditLogService::logAction(
            'eburol_created',
            $eburol,
            'E-Burol Management',
            "E-Burol application #{$eburol->id} created by admin for visitor {$eburol->user->first_name} {$eburol->user->last_name}",
            $request
        );

        return redirect()->route('admin.eburols.index')
            ->with('success', 'E-Burol application created successfully.');
    }

    /**
     * Update an e-burol application.
     */
    public function update(Request $request, Eburol $eburol): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => ['required', 'exists:users,id'],
            'inmate_first_name' => ['required', 'string', 'max:255'],
            'inmate_middle_name' => ['nullable', 'string', 'max:255'],
            'inmate_last_name' => ['required', 'string', 'max:255'],
            'deceased_first_name' => ['required', 'string', 'max:255'],
            'deceased_middle_name' => ['nullable', 'string', 'max:255'],
            'deceased_last_name' => ['required', 'string', 'max:255'],
            'deceased_date_of_death' => ['required', 'date', 'before_or_equal:today'],
            'relationship_to_inmate' => ['required', 'string', 'max:255'],
            'wake_start_date' => ['required', 'date'],
            'wake_end_date' => ['required', 'date', 'after_or_equal:wake_start_date'],
            'preferred_time' => ['nullable', 'date_format:H:i'],
            'wake_location' => ['required', 'string', 'max:1000'],
            'additional_details' => ['nullable', 'string', 'max:2000'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
            'death_certificate' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'relationship_proof' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'monitoring_officer_id' => ['nullable', 'exists:users,id'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $oldMonitoringOfficerId = $eburol->monitoring_officer_id;
        $updateData = [
            'user_id' => $request->user_id,
            'monitoring_officer_id' => $request->monitoring_officer_id,
            'inmate_first_name' => $request->inmate_first_name,
            'inmate_middle_name' => $request->inmate_middle_name,
            'inmate_last_name' => $request->inmate_last_name,
            'deceased_first_name' => $request->deceased_first_name,
            'deceased_middle_name' => $request->deceased_middle_name,
            'deceased_last_name' => $request->deceased_last_name,
            'deceased_date_of_death' => $request->deceased_date_of_death,
            'relationship_to_inmate' => $request->relationship_to_inmate,
            'wake_start_date' => $request->wake_start_date,
            'wake_end_date' => $request->wake_end_date,
            'preferred_time' => $request->preferred_time,
            'wake_location' => $request->wake_location,
            'additional_details' => $request->additional_details,
            'admin_notes' => $request->admin_notes,
        ];

        if ($request->hasFile('death_certificate')) {
            // Delete old file if exists
            if ($eburol->death_certificate_path) {
                Storage::disk('public')->delete($eburol->death_certificate_path);
            }
            $updateData['death_certificate_path'] = $request->file('death_certificate')->store('eburols/death_certificates', 'public');
        }

        if ($request->hasFile('relationship_proof')) {
            // Delete old file if exists
            if ($eburol->relationship_proof_path) {
                Storage::disk('public')->delete($eburol->relationship_proof_path);
            }
            $updateData['relationship_proof_path'] = $request->file('relationship_proof')->store('eburols/relationship_proofs', 'public');
        }

        $eburol->update($updateData);

        // Notify monitoring officer if assigned and it's a new assignment
        if ($request->monitoring_officer_id && $oldMonitoringOfficerId !== $request->monitoring_officer_id) {
            NotificationService::notifyMonitoringOfficerAboutEburol($eburol);
        }

        AuditLogService::logAction(
            'eburol_updated',
            $eburol,
            'E-Burol Management',
            "E-Burol application #{$eburol->id} updated by admin",
            $request
        );

        return redirect()->route('admin.eburols.index')
            ->with('success', 'E-Burol application updated successfully.');
    }

    /**
     * Delete an e-burol application.
     */
    public function destroy(Request $request, Eburol $eburol): RedirectResponse
    {
        AuditLogService::logAction(
            'eburol_deleted',
            $eburol,
            'E-Burol Management',
            "E-Burol application #{$eburol->id} deleted by admin",
            $request
        );

        // Delete associated files
        if ($eburol->death_certificate_path) {
            Storage::disk('public')->delete($eburol->death_certificate_path);
        }
        if ($eburol->relationship_proof_path) {
            Storage::disk('public')->delete($eburol->relationship_proof_path);
        }

        $eburol->delete();

        return redirect()->route('admin.eburols.index')
            ->with('success', 'E-Burol application deleted successfully.');
    }

    /**
     * Serve death certificate file for viewing (super admin).
     */
    public function deathCertificate(Eburol $eburol): BinaryFileResponse
    {
        if (! $eburol->death_certificate_path || ! Storage::disk('public')->exists($eburol->death_certificate_path)) {
            abort(404, 'Document not found.');
        }

        return response()->file(Storage::disk('public')->path($eburol->death_certificate_path), [
            'Content-Disposition' => 'inline; filename="'.basename($eburol->death_certificate_path).'"',
        ]);
    }

    /**
     * Serve relationship proof file for viewing (super admin).
     */
    public function relationshipProof(Eburol $eburol): BinaryFileResponse
    {
        if (! $eburol->relationship_proof_path || ! Storage::disk('public')->exists($eburol->relationship_proof_path)) {
            abort(404, 'Document not found.');
        }

        return response()->file(Storage::disk('public')->path($eburol->relationship_proof_path), [
            'Content-Disposition' => 'inline; filename="'.basename($eburol->relationship_proof_path).'"',
        ]);
    }

    /**
     * Approve an e-burol application.
     */
    public function approve(Request $request, Eburol $eburol): RedirectResponse
    {
        $request->validate([
            'monitoring_officer_id' => ['required', 'exists:users,id'],
        ]);

        $oldMonitoringOfficerId = $eburol->monitoring_officer_id;

        $updateData = [
            'status' => EburolStatus::Approved,
            'monitoring_officer_id' => $request->monitoring_officer_id,
        ];

        // Create VideoSDK room and visit session (with inmate tunnel) before approving
        $videoSdkService = new \App\Services\VideoSdkService;
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
        $updateData['daily_co_room_id'] = $roomId;
        $updateData['daily_co_room_name'] = $roomResult['room_name'] ?? $roomName;
        $updateData['daily_co_room_url'] = $roomResult['room_url'] ?? null;
        $updateData['room_created_at'] = now();

        // Create monitoring session
        \App\Models\MonitoringSession::create([
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

        // Notify monitoring officer if assigned and it's a new assignment
        if ($request->monitoring_officer_id && $oldMonitoringOfficerId !== $request->monitoring_officer_id) {
            NotificationService::notifyMonitoringOfficerAboutEburol($eburol);
        }

        NotificationService::createEburolNotification($eburol, 'approved');

        AuditLogService::logAction(
            'eburol_approved',
            $eburol,
            'E-Burol Management',
            "E-Burol application #{$eburol->id} approved by admin",
            $request
        );

        return redirect()->route('admin.eburols.index')
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

        NotificationService::createEburolNotification($eburol, 'rejected');

        AuditLogService::logAction(
            'eburol_rejected',
            $eburol,
            'E-Burol Management',
            "E-Burol application #{$eburol->id} rejected by admin. Reason: ".substr($request->rejection_reason, 0, 100),
            $request,
            ['rejection_reason' => $request->rejection_reason]
        );

        return redirect()->route('admin.eburols.index')
            ->with('success', 'E-Burol application rejected successfully.');
    }

    /**
     * Update e-burol status.
     */
    public function updateStatus(Request $request, Eburol $eburol): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed',
            'rejection_reason' => ['required_if:status,rejected', 'string', 'min:10', 'max:1000'],
            'monitoring_officer_id' => ['nullable', 'exists:users,id'],
        ]);

        $oldMonitoringOfficerId = $eburol->monitoring_officer_id;
        $oldStatus = $eburol->status->value;

        $updateData = [
            'status' => EburolStatus::from($request->status),
            'monitoring_officer_id' => $request->monitoring_officer_id,
        ];

        // If rejecting, require and store rejection reason
        if ($request->status === 'rejected') {
            $updateData['rejection_reason'] = $request->rejection_reason;
        } else {
            // Clear rejection reason if status changes from rejected
            $updateData['rejection_reason'] = null;
        }

        $eburol->update($updateData);

        // Notify monitoring officer if assigned and it's a new assignment
        if ($request->monitoring_officer_id && $oldMonitoringOfficerId !== $request->monitoring_officer_id && in_array($request->status, ['approved', 'pending'])) {
            NotificationService::notifyMonitoringOfficerAboutEburol($eburol);
        }

        if ($request->status !== 'pending') {
            NotificationService::createEburolNotification($eburol, $request->status);
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

        return redirect()->route('admin.eburols.index')
            ->with('success', 'E-Burol status updated successfully.');
    }
}
