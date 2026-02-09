<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Visit;
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
    public function index(Request $request): Response
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
                    'status' => $visit->status->value,
                    'notes' => $visit->notes,
                    'meeting_link' => $visit->meeting_link ?? $visit->daily_co_room_url,
                    'access_key' => $visit->access_key,
                    'access_key_expires_at' => $visit->access_key_expires_at?->format('Y-m-d H:i:s'),
                    'rejection_reason' => $visit->rejection_reason,
                    'monitoring_officer_id' => $visit->monitoring_officer_id,
                    'monitoring_officer_name' => $visit->monitoringOfficer ? trim("{$visit->monitoringOfficer->first_name} {$visit->monitoringOfficer->middle_name} {$visit->monitoringOfficer->last_name}") : null,
                    'created_at' => $visit->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Get all visitors for the create schedule form
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

        return Inertia::render('Admin/ScheduleManagement', [
            'visits' => $visits,
            'visitors' => $visitors,
            'monitoringOfficers' => $monitoringOfficers,
        ]);
    }

    /**
     * Approve a visit schedule.
     */
    public function approve(Request $request, Visit $visit): RedirectResponse
    {
        $request->validate([
            'monitoring_officer_id' => ['nullable', 'exists:users,id'],
            'access_key' => ['nullable', 'string', 'regex:/^[A-Z0-9]{8,12}$/'],
        ]);

        $oldMonitoringOfficerId = $visit->monitoring_officer_id;

        $updateData = [
            'status' => VisitStatus::Approved,
            'monitoring_officer_id' => $request->monitoring_officer_id,
        ];

        // Create VideoSDK room for virtual visits
        if ($visit->visit_type === \App\VisitType::Virtual) {
            $videoSdkService = new \App\Services\VideoSdkService;
            $roomName = "visit-{$visit->id}-".uniqid();
            $roomResult = $videoSdkService->createRoom($roomName);

            if ($roomResult['success']) {
                $updateData['meeting_link'] = $roomResult['room_url'] ?? null;
                $updateData['daily_co_room_id'] = $roomResult['room_id'] ?? null;
                $updateData['daily_co_room_name'] = $roomResult['room_name'] ?? $roomName;
                $updateData['daily_co_room_url'] = $roomResult['room_url'] ?? null;
                $updateData['room_created_at'] = now();

                // Create monitoring session
                \App\Models\MonitoringSession::create([
                    'visit_id' => $visit->id,
                    'visitor_id' => $visit->user_id,
                    'session_type' => 'visit',
                    'session_token' => $roomResult['room_id'] ?? $roomName,
                    'status' => 'pending',
                    'started_at' => now(),
                ]);
            } else {
                // Log error but don't block approval - admin can manually add meeting link
                \Illuminate\Support\Facades\Log::error('VideoSDK room creation failed during approval', [
                    'visit_id' => $visit->id,
                    'error' => $roomResult['error'] ?? 'Unknown error',
                ]);

                // If VideoSDK fails, check if manual meeting link was provided
                if ($request->filled('meeting_link')) {
                    $updateData['meeting_link'] = $request->meeting_link;
                } else {
                    // Show warning message
                    return redirect()->back()
                        ->with('warning', 'Schedule approved, but video room creation failed: '.($roomResult['error'] ?? 'Unknown error').'. Please add meeting link manually.')
                        ->withInput();
                }
            }
        }

        // Handle access key for physical visits
        if ($visit->visit_type === \App\VisitType::Physical) {
            if ($request->access_key) {
                // Use provided access key
                $updateData['access_key'] = strtoupper($request->access_key);
            } elseif (! $visit->access_key) {
                // Generate new access key if not provided and doesn't exist
                $updateData['access_key'] = Visit::generateAccessKey();
            }

            // Set expiration to scheduled visit time (not 24 hours after)
            $scheduledDateTime = $visit->scheduled_date->copy();
            if ($visit->scheduled_time) {
                [$hours, $minutes] = explode(':', $visit->scheduled_time);
                $scheduledDateTime->setTime((int) $hours, (int) $minutes);
            }
            // Access key expires at the scheduled visit time
            $updateData['access_key_expires_at'] = $scheduledDateTime;
        }

        $visit->update($updateData);

        // Refresh visit to get updated meeting_link
        $visit->refresh();

        // Notify monitoring officer if assigned and it's a new assignment
        if ($request->monitoring_officer_id && $oldMonitoringOfficerId !== $request->monitoring_officer_id) {
            \App\Services\NotificationService::notifyMonitoringOfficerAboutVisit($visit);
        }

        // Send notification with meeting link
        NotificationService::createVisitNotification($visit, 'approved');

        return redirect()->route('admin.schedules.index')
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

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Schedule rejected successfully.');
    }

    /**
     * Update visit status.
     */
    public function updateStatus(Request $request, Visit $visit): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed,missed,cancelled',
            'rejection_reason' => ['required_if:status,rejected', 'string', 'min:10', 'max:1000'],
            'monitoring_officer_id' => ['nullable', 'exists:users,id'],
        ]);

        $oldMonitoringOfficerId = $visit->monitoring_officer_id;
        $updateData = ['status' => $request->status];

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

        // Generate access key for physical visits when approved
        if ($request->status === 'approved' && $visit->visit_type === \App\VisitType::Physical && ! $visit->access_key) {
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

        // Notify monitoring officer if assigned and it's a new assignment
        if ($request->monitoring_officer_id && $oldMonitoringOfficerId !== $request->monitoring_officer_id && in_array($request->status, ['approved', 'pending'])) {
            \App\Services\NotificationService::notifyMonitoringOfficerAboutVisit($visit);
        }

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Schedule status updated successfully.');
    }

    /**
     * Generate or regenerate access key for a physical visit.
     */
    public function generateAccessKey(Visit $visit): RedirectResponse
    {
        if ($visit->visit_type !== \App\VisitType::Physical) {
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

        return redirect()->route('admin.schedules.index')
            ->with('success', "Access key generated successfully: {$accessKey}");
    }

    /**
     * Create a new schedule (auto-approved).
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => ['required', 'exists:users,id'],
            'scheduled_date' => ['required', 'date', 'after_or_equal:today'],
            'scheduled_time' => ['required', 'date_format:H:i'],
            'visit_type' => ['required', 'in:virtual,physical'],
            'inmate_first_name' => ['required', 'string', 'max:255'],
            'inmate_middle_name' => ['nullable', 'string', 'max:255'],
            'inmate_last_name' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'meeting_link' => ['nullable', 'url', 'required_if:visit_type,virtual'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Check if the user is a visitor
        $user = User::findOrFail($request->user_id);
        if ($user->role?->slug !== 'visitor') {
            return redirect()->back()
                ->withErrors(['user_id' => 'Selected user must be a visitor.'])
                ->withInput();
        }

        // Check for time slot conflicts
        $conflictingVisit = Visit::where('scheduled_date', $request->scheduled_date)
            ->where('scheduled_time', $request->scheduled_time)
            ->whereIn('status', [VisitStatus::Pending, VisitStatus::Approved])
            ->first();

        if ($conflictingVisit) {
            return redirect()->back()
                ->withErrors(['scheduled_time' => 'This time slot is already booked.'])
                ->withInput();
        }

        $visit = Visit::create([
            'user_id' => $request->user_id,
            'scheduled_date' => $request->scheduled_date,
            'scheduled_time' => $request->scheduled_time,
            'visit_type' => VisitType::from($request->visit_type),
            'inmate_first_name' => $request->inmate_first_name,
            'inmate_middle_name' => $request->inmate_middle_name,
            'inmate_last_name' => $request->inmate_last_name,
            'status' => VisitStatus::Approved, // Auto-approved when created by super admin
            'notes' => $request->notes,
            'meeting_link' => $request->meeting_link,
        ]);

        // Send notification to the visitor
        NotificationService::createVisitNotification($visit, 'approved');

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Schedule created and approved successfully.');
    }

    /**
     * Update a visit schedule.
     */
    public function update(Request $request, Visit $visit): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'scheduled_date' => ['required', 'date', 'after_or_equal:today'],
            'scheduled_time' => ['required', 'date_format:H:i'],
            'visit_type' => ['required', 'in:virtual,physical'],
            'inmate_first_name' => ['required', 'string', 'max:255'],
            'inmate_middle_name' => ['nullable', 'string', 'max:255'],
            'inmate_last_name' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'meeting_link' => ['nullable', 'url', 'required_if:visit_type,virtual'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Check for time slot conflicts (excluding current visit)
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

        $visit->update([
            'scheduled_date' => $request->scheduled_date,
            'scheduled_time' => $request->scheduled_time,
            'visit_type' => VisitType::from($request->visit_type),
            'inmate_first_name' => $request->inmate_first_name,
            'inmate_middle_name' => $request->inmate_middle_name,
            'inmate_last_name' => $request->inmate_last_name,
            'notes' => $request->notes,
            'meeting_link' => $request->meeting_link,
        ]);

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Schedule updated successfully.');
    }

    /**
     * Delete a visit schedule.
     */
    public function destroy(Visit $visit): RedirectResponse
    {
        $visit->delete();

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Schedule deleted successfully.');
    }
}
