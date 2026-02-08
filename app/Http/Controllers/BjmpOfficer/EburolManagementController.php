<?php

namespace App\Http\Controllers\BjmpOfficer;

use App\EburolStatus;
use App\Http\Controllers\Controller;
use App\Models\Eburol;
use App\Models\MonitoringSession;
use App\Services\AuditLogService;
use App\Services\DailyCoService;
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
                    'death_certificate_path' => $eburol->death_certificate_path ? Storage::disk('public')->url($eburol->death_certificate_path) : null,
                    'relationship_proof_path' => $eburol->relationship_proof_path ? Storage::disk('public')->url($eburol->relationship_proof_path) : null,
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

        return Inertia::render('BjmpOfficer/EburolManagement', [
            'eburols' => $eburols,
            'stats' => $stats,
        ]);
    }

    /**
     * Approve an e-burol application.
     */
    public function approve(Request $request, Eburol $eburol): RedirectResponse
    {
        // Create Daily.co room for e-burol session
        $dailyCoService = app(DailyCoService::class);
        $roomName = "eburol-{$eburol->id}-".uniqid();
        $roomConfig = [
            'properties' => [
                'enable_chat' => true,
                'enable_screenshare' => false,
                'enable_recording' => 'cloud',
                'enable_knocking' => false,
                'enable_prejoin_ui' => true,
                'exp' => strtotime($eburol->wake_end_date) + (2 * 60 * 60), // 2 hours after wake end
                'max_participants' => 5,
            ],
        ];

        $room = $dailyCoService->createRoom($roomName, $roomConfig);

        $updateData = [
            'status' => EburolStatus::Approved,
        ];

        if ($room) {
            // Generate inmate token
            $inmateToken = $dailyCoService->createInmateToken($roomName, "eburol-{$eburol->id}");

            $updateData['daily_co_room_id'] = $room['room_id'];
            $updateData['daily_co_room_name'] = $room['room_name'];
            $updateData['daily_co_room_url'] = $room['room_url'];
            $updateData['daily_co_config'] = $room['config'];
            $updateData['inmate_token'] = $inmateToken;
            $updateData['room_created_at'] = now();

            // Create monitoring session
            MonitoringSession::create([
                'eburol_id' => $eburol->id,
                'visitor_id' => $eburol->user_id,
                'session_type' => 'eburol',
                'session_token' => $roomName,
                'status' => 'pending',
                'started_at' => now(),
            ]);
        }

        $eburol->update($updateData);

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
        $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed',
            'rejection_reason' => ['required_if:status,rejected', 'string', 'min:10', 'max:1000'],
        ]);

        $oldStatus = $eburol->status->value;
        $updateData = ['status' => EburolStatus::from($request->status)];

        // If rejecting, require and store rejection reason
        if ($request->status === 'rejected') {
            $updateData['rejection_reason'] = $request->rejection_reason;
        } else {
            // Clear rejection reason if status changes from rejected
            $updateData['rejection_reason'] = null;
        }

        $eburol->update($updateData);

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
}
