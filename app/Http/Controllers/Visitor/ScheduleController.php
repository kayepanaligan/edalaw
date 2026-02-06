<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use App\Services\NotificationService;
use App\VisitStatus;
use App\VisitType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    /**
     * Display the schedule management page.
     */
    public function index(Request $request): Response
    {
        $visits = Visit::where('user_id', auth()->id())
            ->orderBy('scheduled_date', 'desc')
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
                    'meeting_link' => $visit->meeting_link,
                    'created_at' => $visit->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Get booked time slots for the requested date (if provided)
        $bookedTimeSlots = [];
        if ($request->has('date')) {
            $bookedTimeSlots = Visit::where('scheduled_date', $request->date)
                ->whereIn('status', ['pending', 'approved'])
                ->whereNotNull('scheduled_time')
                ->get()
                ->map(function ($visit) {
                    // Convert time to HH:MM format
                    $time = $visit->scheduled_time;
                    if ($time instanceof \Carbon\Carbon) {
                        return $time->format('H:i');
                    }
                    if (is_string($time)) {
                        // If it's already in H:i format, return as is
                        if (preg_match('/^\d{2}:\d{2}$/', $time)) {
                            return $time;
                        }
                        // Try to parse and format
                        try {
                            return \Carbon\Carbon::createFromFormat('H:i:s', $time)->format('H:i');
                        } catch (\Exception $e) {
                            return $time;
                        }
                    }

                    return (string) $time;
                })
                ->filter()
                ->unique()
                ->values()
                ->toArray();
        }

        return Inertia::render('Visitor/ScheduleManagement', [
            'visits' => $visits,
            'bookedTimeSlots' => $bookedTimeSlots,
        ]);
    }

    /**
     * Get booked time slots for a specific date.
     */
    public function getBookedTimeSlots(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'date' => ['required', 'date'],
        ]);

        $bookedTimeSlots = Visit::where('scheduled_date', $request->date)
            ->whereIn('status', ['pending', 'approved'])
            ->whereNotNull('scheduled_time')
            ->get()
            ->map(function ($visit) {
                // Convert time to HH:MM format
                $time = $visit->scheduled_time;
                if ($time instanceof \Carbon\Carbon) {
                    return $time->format('H:i');
                }
                if (is_string($time)) {
                    // If it's already in H:i format, return as is
                    if (preg_match('/^\d{2}:\d{2}$/', $time)) {
                        return $time;
                    }
                    // Try to parse and format
                    try {
                        return \Carbon\Carbon::createFromFormat('H:i:s', $time)->format('H:i');
                    } catch (\Exception $e) {
                        return $time;
                    }
                }

                return (string) $time;
            })
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        return response()->json([
            'bookedTimeSlots' => $bookedTimeSlots,
        ]);
    }

    /**
     * Store a new visit schedule.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'scheduled_date' => ['required', 'date', 'after_or_equal:today'],
            'scheduled_time' => ['required', 'date_format:H:i'],
            'visit_type' => ['required', 'string', 'in:virtual,physical'],
            'inmate_first_name' => ['required', 'string', 'max:255'],
            'inmate_middle_name' => ['nullable', 'string', 'max:255'],
            'inmate_last_name' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Check if the time slot is already booked
        $isBooked = Visit::where('scheduled_date', $request->scheduled_date)
            ->where('scheduled_time', $request->scheduled_time)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($isBooked) {
            return redirect()->back()
                ->withErrors(['scheduled_time' => 'This time slot is already booked. Please select another time.'])
                ->withInput();
        }

        $visit = Visit::create([
            'user_id' => auth()->id(),
            'scheduled_date' => $request->scheduled_date,
            'scheduled_time' => $request->scheduled_time,
            'visit_type' => VisitType::from($request->visit_type),
            'inmate_first_name' => $request->inmate_first_name,
            'inmate_middle_name' => $request->inmate_middle_name,
            'inmate_last_name' => $request->inmate_last_name,
            'status' => VisitStatus::Pending,
            'notes' => $request->notes,
        ]);

        // Create notification that application was received
        NotificationService::createVisitSubmittedNotification($visit);
        NotificationService::notifySuperAdminsAboutVisit($visit);

        return redirect()->back()->with('success', 'Visit schedule submitted successfully. Your application has been sent to the BJMP officer for review. Please wait for approval.');
    }

    /**
     * Cancel a visit schedule.
     */
    public function cancel(Request $request, Visit $visit): RedirectResponse
    {
        // Ensure the visit belongs to the authenticated user
        if ($visit->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // Only allow cancellation of pending or approved visits
        if (! in_array($visit->status, [VisitStatus::Pending, VisitStatus::Approved])) {
            return redirect()->back()
                ->withErrors(['visit' => 'You can only cancel pending or approved visits.']);
        }

        $visit->update([
            'status' => VisitStatus::Cancelled,
        ]);

        // Create notification
        NotificationService::createVisitNotification($visit, 'cancelled');

        return redirect()->back()->with('success', 'Visit schedule cancelled successfully.');
    }

    /**
     * Reschedule a visit.
     */
    public function reschedule(Request $request, Visit $visit): RedirectResponse
    {
        // Ensure the visit belongs to the authenticated user
        if ($visit->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // Only allow rescheduling of pending or approved visits
        if (! in_array($visit->status, [VisitStatus::Pending, VisitStatus::Approved])) {
            return redirect()->back()
                ->withErrors(['visit' => 'You can only reschedule pending or approved visits.']);
        }

        $validator = Validator::make($request->all(), [
            'scheduled_date' => ['required', 'date', 'after_or_equal:today'],
            'scheduled_time' => ['required', 'date_format:H:i'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Check if the new time slot is already booked (excluding the current visit)
        $isBooked = Visit::where('scheduled_date', $request->scheduled_date)
            ->where('scheduled_time', $request->scheduled_time)
            ->whereIn('status', [VisitStatus::Pending, VisitStatus::Approved])
            ->where('id', '!=', $visit->id)
            ->exists();

        if ($isBooked) {
            return redirect()->back()
                ->withErrors(['scheduled_time' => 'This time slot is already booked. Please select another time.'])
                ->withInput();
        }

        // Update the visit status to pending after rescheduling
        $visit->update([
            'scheduled_date' => $request->scheduled_date,
            'scheduled_time' => $request->scheduled_time,
            'status' => VisitStatus::Pending,
            'meeting_link' => null, // Clear meeting link as it needs to be re-approved
        ]);

        // Create notification
        NotificationService::createVisitSubmittedNotification($visit);

        return redirect()->back()->with('success', 'Visit schedule rescheduled successfully. Your rescheduled request has been sent to the BJMP officer for review.');
    }
}
