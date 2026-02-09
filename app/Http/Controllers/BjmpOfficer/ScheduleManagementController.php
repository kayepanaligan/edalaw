<?php

namespace App\Http\Controllers\BjmpOfficer;

use App\Http\Controllers\Controller;
use App\Models\MonitoringSession;
use App\Models\Visit;
use App\Services\AuditLogService;
use App\Services\NotificationService;
use App\Services\VideoSdkService;
use App\VisitStatus;
use App\VisitType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleManagementController extends Controller
{
    /**
     * Display the schedule management page.
     */
    public function index(): Response
    {
        $visits = Visit::with(['user', 'monitoringOfficer'])
            ->orderBy('scheduled_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($visit) {
                return [
                    'id' => $visit->id,
                    'user_id' => $visit->user_id,
                    'visitor_name' => trim("{$visit->user->first_name} {$visit->user->middle_name} {$visit->user->last_name}"),
                    'visitor_email' => $visit->user->email,
                    'scheduled_date' => $visit->scheduled_date->format('Y-m-d'),
                    'scheduled_time' => $visit->scheduled_time,
                    'visit_type' => $visit->visit_type->value,
                    'inmate_first_name' => $visit->inmate_first_name,
                    'inmate_middle_name' => $visit->inmate_middle_name,
                    'inmate_last_name' => $visit->inmate_last_name,
                    'inmate_name' => trim("{$visit->inmate_first_name} {$visit->inmate_middle_name} {$visit->inmate_last_name}"),
                    'status' => $visit->status->value,
                    'notes' => $visit->notes,
                    'meeting_link' => $visit->meeting_link ?? $visit->daily_co_room_url,
                    'access_key' => $visit->access_key,
                    'access_key_expires_at' => $visit->access_key_expires_at?->format('Y-m-d H:i:s'),
                    'monitoring_officer_id' => $visit->monitoring_officer_id,
                    'monitoring_officer_name' => $visit->monitoringOfficer ? trim("{$visit->monitoringOfficer->first_name} {$visit->monitoringOfficer->middle_name} {$visit->monitoringOfficer->last_name}") : null,
                    'rejection_reason' => $visit->rejection_reason,
                    'created_at' => $visit->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $stats = [
            'total' => $visits->count(),
            'pending' => $visits->where('status', 'pending')->count(),
            'approved' => $visits->where('status', 'approved')->count(),
            'rejected' => $visits->where('status', 'rejected')->count(),
            'completed' => $visits->where('status', 'completed')->count(),
            'missed' => $visits->where('status', 'missed')->count(),
        ];

        // Get all monitoring officers
        $monitoringOfficers = \App\Models\User::whereHas('role', function ($query) {
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

        return Inertia::render('BjmpOfficer/ScheduleManagement', [
            'visits' => $visits,
            'stats' => $stats,
            'monitoringOfficers' => $monitoringOfficers,
        ]);
    }

    /**
     * Approve a visit schedule.
     */
    public function approve(Request $request, Visit $visit): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'meeting_link' => ['nullable', 'url', 'required_if:visit_type,virtual'],
            'monitoring_officer_id' => ['nullable', 'exists:users,id'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $oldMonitoringOfficerId = $visit->monitoring_officer_id;
        $updateData = [
            'status' => VisitStatus::Approved,
            'monitoring_officer_id' => $request->monitoring_officer_id,
        ];

        // If virtual visit, create VideoSDK room
        if ($visit->visit_type === VisitType::Virtual) {
            $videoSdkService = new VideoSdkService;
            $roomName = "visit-{$visit->id}-".uniqid();
            $roomResult = $videoSdkService->createRoom($roomName);

            if ($roomResult['success']) {
                $updateData['meeting_link'] = $roomResult['room_url'] ?? null;
                $updateData['daily_co_room_id'] = $roomResult['room_id'] ?? null;
                $updateData['daily_co_room_name'] = $roomResult['room_name'] ?? $roomName;
                $updateData['daily_co_room_url'] = $roomResult['room_url'] ?? null;
                $updateData['room_created_at'] = now();

                // Create monitoring session
                MonitoringSession::create([
                    'visit_id' => $visit->id,
                    'visitor_id' => $visit->user_id,
                    'session_type' => 'visit',
                    'session_token' => $roomResult['room_id'] ?? $roomName,
                    'status' => 'pending',
                    'started_at' => now(),
                ]);
            } else {
                // Log error but don't block approval - officer can manually add meeting link
                \Illuminate\Support\Facades\Log::error('VideoSDK room creation failed during approval', [
                    'visit_id' => $visit->id,
                    'error' => $roomResult['error'] ?? 'Unknown error',
                ]);

                // If VideoSDK fails, check if manual meeting link was provided
                if ($request->filled('meeting_link')) {
                    $updateData['meeting_link'] = $request->meeting_link;
                } else {
                    // Still allow approval to proceed, but show warning
                    return redirect()->back()
                        ->with('warning', 'Schedule approved, but video room creation failed: '.($roomResult['error'] ?? 'Unknown error').'. Please add meeting link manually or try again.')
                        ->withInput();
                }
            }
        }

        // Generate access key for physical visits
        if ($visit->visit_type === VisitType::Physical && ! $visit->access_key) {
            $updateData['access_key'] = Visit::generateAccessKey();
            // Access key expires 24 hours after the scheduled visit time
            $scheduledDateTime = $visit->scheduled_date->copy();
            if ($visit->scheduled_time) {
                [$hours, $minutes] = explode(':', $visit->scheduled_time);
                $scheduledDateTime->setTime((int) $hours, (int) $minutes);
            }
            $updateData['access_key_expires_at'] = $scheduledDateTime->addHours(24);
        }

        $visit->update($updateData);

        // Refresh visit to get updated meeting_link
        $visit->refresh();

        // Notify monitoring officer if assigned and it's a new assignment
        if ($request->monitoring_officer_id && $oldMonitoringOfficerId !== $request->monitoring_officer_id) {
            NotificationService::notifyMonitoringOfficerAboutVisit($visit);
        }

        NotificationService::createVisitNotification($visit, 'approved');

        $metadata = [];
        if ($visit->visit_type === VisitType::Virtual && $request->meeting_link) {
            $metadata['meeting_link'] = $request->meeting_link;
        }

        AuditLogService::logAction(
            'visit_approved',
            $visit,
            'Visit Schedule Management',
            "Visit schedule #{$visit->id} approved for visitor {$visit->user->first_name} {$visit->user->last_name}",
            $request,
            $metadata
        );

        return redirect()->route('bjmp-officer.schedules.index')
            ->with('success', 'Schedule approved successfully.');
    }

    /**
     * Reject a visit schedule.
     */
    public function reject(Request $request, Visit $visit): RedirectResponse
    {
        $request->validate([
            'rejection_reason' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $visit->update([
            'status' => VisitStatus::Rejected,
            'rejection_reason' => $request->rejection_reason,
        ]);

        NotificationService::createVisitNotification($visit, 'rejected');

        AuditLogService::logAction(
            'visit_rejected',
            $visit,
            'Visit Schedule Management',
            "Visit schedule #{$visit->id} rejected for visitor {$visit->user->first_name} {$visit->user->last_name}. Reason: ".substr($request->rejection_reason, 0, 100),
            $request,
            ['rejection_reason' => $request->rejection_reason]
        );

        return redirect()->route('bjmp-officer.schedules.index')
            ->with('success', 'Schedule rejected successfully.');
    }

    /**
     * Update visit status.
     */
    public function updateStatus(Request $request, Visit $visit): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed,missed',
            'rejection_reason' => ['required_if:status,rejected', 'string', 'min:10', 'max:1000'],
            'meeting_link' => ['nullable', 'url'],
            'monitoring_officer_id' => ['nullable', 'exists:users,id'],
        ]);

        $oldMonitoringOfficerId = $visit->monitoring_officer_id;
        $updateData = ['status' => VisitStatus::from($request->status)];

        // If rejecting, require and store rejection reason
        if ($request->status === 'rejected') {
            $updateData['rejection_reason'] = $request->rejection_reason;
        } else {
            // Clear rejection reason if status changes from rejected
            $updateData['rejection_reason'] = null;
        }

        // Update monitoring officer if provided
        if ($request->has('monitoring_officer_id')) {
            $updateData['monitoring_officer_id'] = $request->monitoring_officer_id;
        }

        // If approving virtual visit, require meeting link
        if ($request->status === 'approved' && $visit->visit_type === VisitType::Virtual) {
            if (! $request->meeting_link) {
                return redirect()->back()
                    ->withErrors(['meeting_link' => 'Meeting link is required for virtual visits.'])
                    ->withInput();
            }
            $updateData['meeting_link'] = $request->meeting_link;
        }

        // Generate access key for physical visits when approved
        if ($request->status === 'approved' && $visit->visit_type === VisitType::Physical && ! $visit->access_key) {
            $updateData['access_key'] = Visit::generateAccessKey();
            // Access key expires 24 hours after the scheduled visit time
            $scheduledDateTime = $visit->scheduled_date->copy();
            if ($visit->scheduled_time) {
                [$hours, $minutes] = explode(':', $visit->scheduled_time);
                $scheduledDateTime->setTime((int) $hours, (int) $minutes);
            }
            $updateData['access_key_expires_at'] = $scheduledDateTime->addHours(24);
        }

        $oldStatus = $visit->status->value;
        $visit->update($updateData);

        // Notify monitoring officer if assigned and it's a new assignment
        if ($request->monitoring_officer_id && $oldMonitoringOfficerId !== $request->monitoring_officer_id && in_array($request->status, ['approved', 'pending'])) {
            NotificationService::notifyMonitoringOfficerAboutVisit($visit);
        }

        if ($request->status !== 'pending') {
            NotificationService::createVisitNotification($visit, $request->status);
        }

        $metadata = [
            'old_status' => $oldStatus,
            'new_status' => $request->status,
        ];
        if ($request->status === 'rejected' && $request->rejection_reason) {
            $metadata['rejection_reason'] = $request->rejection_reason;
        }
        if ($request->status === 'approved' && $visit->visit_type === VisitType::Virtual && $request->meeting_link) {
            $metadata['meeting_link'] = $request->meeting_link;
        }

        AuditLogService::logAction(
            'visit_status_updated',
            $visit,
            'Visit Schedule Management',
            "Visit schedule #{$visit->id} status updated from {$oldStatus} to {$request->status}",
            $request,
            $metadata
        );

        return redirect()->route('bjmp-officer.schedules.index')
            ->with('success', 'Schedule status updated successfully.');
    }

    /**
     * Generate or regenerate access key for a physical visit.
     */
    public function generateAccessKey(Visit $visit): RedirectResponse
    {
        if ($visit->visit_type !== VisitType::Physical) {
            return redirect()->back()
                ->withErrors(['error' => 'Access keys can only be generated for physical visits.']);
        }

        $accessKey = Visit::generateAccessKey();
        $scheduledDateTime = $visit->scheduled_date->copy();
        if ($visit->scheduled_time) {
            [$hours, $minutes] = explode(':', $visit->scheduled_time);
            $scheduledDateTime->setTime((int) $hours, (int) $minutes);
        }
        $expiresAt = $scheduledDateTime->addHours(24);

        $visit->update([
            'access_key' => $accessKey,
            'access_key_expires_at' => $expiresAt,
        ]);

        return redirect()->route('bjmp-officer.schedules.index')
            ->with('success', "Access key generated successfully: {$accessKey}");
    }

    /**
     * Reschedule a visit.
     */
    public function reschedule(Request $request, Visit $visit): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'scheduled_date' => ['required', 'date', 'after_or_equal:today'],
            'scheduled_time' => ['required', 'date_format:H:i'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Check for time slot conflicts
        $conflictingVisit = Visit::where('scheduled_date', $request->scheduled_date)
            ->where('scheduled_time', $request->scheduled_time)
            ->whereIn('status', [VisitStatus::Pending, VisitStatus::Approved])
            ->where('id', '!=', $visit->id)
            ->first();

        if ($conflictingVisit) {
            return redirect()->back()
                ->withErrors(['scheduled_time' => 'This time slot is already booked.'])
                ->withInput();
        }

        $oldDate = $visit->scheduled_date->format('Y-m-d');
        $oldTime = $visit->scheduled_time;

        $visit->update([
            'scheduled_date' => $request->scheduled_date,
            'scheduled_time' => $request->scheduled_time,
        ]);

        AuditLogService::logAction(
            'visit_rescheduled',
            $visit,
            'Visit Schedule Management',
            "Visit schedule #{$visit->id} rescheduled from {$oldDate} {$oldTime} to {$request->scheduled_date} {$request->scheduled_time}",
            $request,
            [
                'old_date' => $oldDate,
                'old_time' => $oldTime,
                'new_date' => $request->scheduled_date,
                'new_time' => $request->scheduled_time,
            ]
        );

        return redirect()->route('bjmp-officer.schedules.index')
            ->with('success', 'Schedule rescheduled successfully.');
    }
}
