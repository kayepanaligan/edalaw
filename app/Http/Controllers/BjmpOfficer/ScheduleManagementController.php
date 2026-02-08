<?php

namespace App\Http\Controllers\BjmpOfficer;

use App\Http\Controllers\Controller;
use App\Models\MonitoringSession;
use App\Models\Visit;
use App\Services\AuditLogService;
use App\Services\DailyCoService;
use App\Services\NotificationService;
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
        $visits = Visit::with('user')
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
                    'meeting_link' => $visit->meeting_link,
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

        return Inertia::render('BjmpOfficer/ScheduleManagement', [
            'visits' => $visits,
            'stats' => $stats,
        ]);
    }

    /**
     * Approve a visit schedule.
     */
    public function approve(Request $request, Visit $visit): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'meeting_link' => ['nullable', 'url', 'required_if:visit_type,virtual'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $updateData = [
            'status' => VisitStatus::Approved,
        ];

        // If virtual visit, create Daily.co room
        if ($visit->visit_type === VisitType::Virtual) {
            $dailyCoService = app(DailyCoService::class);
            $roomName = "visit-{$visit->id}-".uniqid();
            $roomConfig = [
                'properties' => [
                    'enable_chat' => true,
                    'enable_screenshare' => false,
                    'enable_recording' => 'cloud',
                    'enable_knocking' => false,
                    'enable_prejoin_ui' => true,
                    'exp' => strtotime($visit->scheduled_date.' '.($visit->scheduled_time ?? '00:00:00')) + (2 * 60 * 60), // 2 hours after scheduled time
                    'max_participants' => 5,
                ],
            ];

            $room = $dailyCoService->createRoom($roomName, $roomConfig);

            if ($room) {
                // Generate inmate token
                $inmateToken = $dailyCoService->createInmateToken($roomName, "visit-{$visit->id}");

                $updateData['daily_co_room_id'] = $room['room_id'];
                $updateData['daily_co_room_name'] = $room['room_name'];
                $updateData['daily_co_room_url'] = $room['room_url'];
                $updateData['daily_co_config'] = $room['config'];
                $updateData['inmate_token'] = $inmateToken;
                $updateData['meeting_link'] = $room['room_url'];
                $updateData['room_created_at'] = now();

                // Create monitoring session
                MonitoringSession::create([
                    'visit_id' => $visit->id,
                    'visitor_id' => $visit->user_id,
                    'session_type' => 'visit',
                    'session_token' => $roomName,
                    'status' => 'pending',
                    'started_at' => now(),
                ]);
            } else {
                return redirect()->back()
                    ->withErrors(['error' => 'Failed to create video room. Please try again.'])
                    ->withInput();
            }
        }

        $visit->update($updateData);

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
        ]);

        $updateData = ['status' => VisitStatus::from($request->status)];

        // If rejecting, require and store rejection reason
        if ($request->status === 'rejected') {
            $updateData['rejection_reason'] = $request->rejection_reason;
        } else {
            // Clear rejection reason if status changes from rejected
            $updateData['rejection_reason'] = null;
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

        $oldStatus = $visit->status->value;
        $visit->update($updateData);

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
