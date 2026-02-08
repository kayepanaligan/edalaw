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
                    'status' => $visit->status->value,
                    'notes' => $visit->notes,
                    'meeting_link' => $visit->meeting_link,
                    'rejection_reason' => $visit->rejection_reason,
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

        return Inertia::render('Admin/ScheduleManagement', [
            'visits' => $visits,
            'visitors' => $visitors,
        ]);
    }

    /**
     * Approve a visit schedule.
     */
    public function approve(Visit $visit): RedirectResponse
    {
        $visit->update([
            'status' => VisitStatus::Approved,
        ]);

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
        ]);

        $updateData = ['status' => $request->status];

        // If rejecting, require and store rejection reason
        if ($request->status === 'rejected') {
            $updateData['rejection_reason'] = $request->rejection_reason;
        } else {
            // Clear rejection reason if status changes from rejected
            $updateData['rejection_reason'] = null;
        }

        $visit->update($updateData);

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Schedule status updated successfully.');
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
