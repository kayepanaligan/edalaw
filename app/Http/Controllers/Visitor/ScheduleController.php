<?php

namespace App\Http\Controllers\Visitor;

use App\AppealStatus;
use App\Http\Controllers\Controller;
use App\Models\Appeal;
use App\Models\Visit;
use App\Services\AuditLogService;
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
        $visits = Visit::with(['monitoringOfficer', 'visitSessions' => fn ($q) => $q->orderBy('scheduled_start', 'desc')->limit(1)])
            ->where('user_id', auth()->id())
            ->orderBy('scheduled_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($visit) {
                $canAppeal = false;
                $appealDeadline = null;
                if ($visit->status === VisitStatus::Rejected) {
                    $deadline = $visit->updated_at->copy()->addHours(48);
                    $canAppeal = now()->isBefore($deadline);
                    $appealDeadline = $deadline->format('Y-m-d H:i:s');

                    // Check if already has a pending or approved appeal
                    $hasActiveAppeal = Appeal::where('user_id', auth()->id())
                        ->where('appealable_type', Visit::class)
                        ->where('appealable_id', $visit->id)
                        ->where('status', '!=', AppealStatus::Rejected)
                        ->exists();

                    if ($hasActiveAppeal) {
                        $canAppeal = false;
                    }
                }

                $latestSession = $visit->visitSessions->first();
                $sessionPayload = null;
                if ($latestSession) {
                    $now = now();
                    $withinWindow = $now->between($latestSession->scheduled_start, $latestSession->scheduled_end);
                    $notCompleted = ! in_array($latestSession->status, ['completed', 'terminated'], true);
                    $sessionPayload = [
                        'id' => $latestSession->id,
                        'scheduled_start' => $latestSession->scheduled_start->toIso8601String(),
                        'scheduled_end' => $latestSession->scheduled_end->toIso8601String(),
                        'status' => $latestSession->status,
                        'terms_accepted_at' => $latestSession->terms_accepted_at?->toIso8601String(),
                        'can_join_video' => $visit->status === VisitStatus::Approved && $withinWindow && $notCompleted,
                    ];
                }

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
                    'meeting_link' => $visit->meeting_link ?? $visit->daily_co_room_url,
                    'access_key' => $visit->access_key,
                    'access_key_expires_at' => $visit->access_key_expires_at?->format('Y-m-d H:i:s'),
                    'monitoring_officer_id' => $visit->monitoring_officer_id,
                    'monitoring_officer_name' => $visit->monitoringOfficer ? trim("{$visit->monitoringOfficer->first_name} {$visit->monitoringOfficer->middle_name} {$visit->monitoringOfficer->last_name}") : null,
                    'rejection_reason' => $visit->rejection_reason,
                    'created_at' => $visit->created_at->format('Y-m-d H:i:s'),
                    'can_appeal' => $canAppeal,
                    'appeal_deadline' => $appealDeadline,
                    'visit_session' => $sessionPayload,
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
            'today_unavailable' => now()->format('H:i') >= '21:50',
        ]);
    }

    /**
     * Get booked time slots for a specific date with capacity information.
     */
    public function getBookedTimeSlots(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'date' => ['required', 'date'],
            'visit_type' => ['nullable', 'string', 'in:physical,virtual'],
        ]);

        $visitType = $request->visit_type ?? 'physical';
        $date = $request->date;
        $isPhysical = $visitType === 'physical';

        $dateCarbon = \Carbon\Carbon::parse($date)->startOfDay();
        $nowTime = now()->format('H:i');
        $dayCutoff = '21:50'; // After 9:50 PM, entire day is unavailable
        $latestSlotEnd = $isPhysical ? '17:00' : '17:50';
        $isDayUnavailable = $dateCarbon->isToday() && (
            $nowTime >= $dayCutoff || $nowTime > $latestSlotEnd
        );

        // Physical: hourly slots 07:00–17:00 (7am–6pm). Virtual: 10-minute slots 7:00–17:50
        $allTimeSlots = [];
        if ($isPhysical) {
            for ($hour = 7; $hour < 18; $hour++) {
                $allTimeSlots[] = sprintf('%02d:00', $hour);
            }
        } else {
            for ($hour = 7; $hour < 18; $hour++) {
                for ($minute = 0; $minute < 60; $minute += 10) {
                    $allTimeSlots[] = sprintf('%02d:%02d', $hour, $minute);
                }
            }
        }

        // Get capacity information for each slot (when day is unavailable, treat all as full)
        $slotCapacities = [];
        foreach ($allTimeSlots as $timeSlot) {
            if ($isDayUnavailable) {
                $slotCapacities[$timeSlot] = [
                    'current' => 999,
                    'max' => 1,
                    'isFull' => true,
                ];
            } else {
                $capacity = \App\Models\TimeSlotCapacity::getCapacity($timeSlot, $visitType);
                $currentBookings = \App\Models\TimeSlotCapacity::getCurrentBookings($date, $timeSlot, $visitType);
                $isFull = $currentBookings >= $capacity;

                $slotCapacities[$timeSlot] = [
                    'current' => $currentBookings,
                    'max' => $capacity,
                    'isFull' => $isFull,
                ];
            }
        }

        return response()->json([
            'slotCapacities' => $slotCapacities,
            'isDayUnavailable' => $isDayUnavailable,
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
            'relationship_proof' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'], // 10MB max
            'additional_proof' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'], // 10MB max
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $scheduledDate = \Carbon\Carbon::parse($request->scheduled_date)->startOfDay();
        if ($scheduledDate->isToday() && now()->format('H:i') >= '21:50') {
            return redirect()->back()
                ->withErrors(['scheduled_date' => 'This day is no longer available for scheduling (cutoff 9:50 PM). Please select another date.'])
                ->withInput();
        }
        $isPhysical = $request->visit_type === 'physical';
        $cutoff = $isPhysical ? '17:00' : '17:50';
        if ($scheduledDate->isToday() && $request->scheduled_time > $cutoff) {
            $message = $isPhysical
                ? 'Schedule times for today end at 5:00 PM. Please select another date or time.'
                : 'Schedule times for today end at 5:50 PM. Please select another date or time.';

            return redirect()->back()
                ->withErrors(['scheduled_time' => $message])
                ->withInput();
        }

        // Physical visits use hourly slots: normalize to HH:00 for capacity and storage
        $scheduledTime = $request->scheduled_time;
        if ($isPhysical && preg_match('/^(\d{2}):\d{2}$/', $scheduledTime, $m)) {
            $scheduledTime = $m[1].':00';
        }

        $isAvailable = \App\Models\TimeSlotCapacity::isAvailable(
            $request->scheduled_date,
            $scheduledTime,
            $request->visit_type
        );

        if (! $isAvailable) {
            $capacity = \App\Models\TimeSlotCapacity::getCapacity($scheduledTime, $request->visit_type);

            return redirect()->back()
                ->withErrors(['scheduled_time' => "This time slot is full (maximum capacity: {$capacity} visitors). Please select another time."])
                ->withInput();
        }

        // Store uploaded files
        $relationshipProofPath = null;
        $additionalProofPath = null;

        if ($request->hasFile('relationship_proof')) {
            $relationshipProofPath = $request->file('relationship_proof')->store('visits/relationship_proofs', 'public');
        }

        if ($request->hasFile('additional_proof')) {
            $additionalProofPath = $request->file('additional_proof')->store('visits/additional_proofs', 'public');
        }

        $visit = Visit::create([
            'user_id' => auth()->id(),
            'scheduled_date' => $request->scheduled_date,
            'scheduled_time' => $scheduledTime,
            'visit_type' => VisitType::from($request->visit_type),
            'inmate_first_name' => $request->inmate_first_name,
            'inmate_middle_name' => $request->inmate_middle_name,
            'inmate_last_name' => $request->inmate_last_name,
            'status' => VisitStatus::Pending,
            'notes' => $request->notes,
            'relationship_proof_path' => $relationshipProofPath,
            'additional_proof_path' => $additionalProofPath,
        ]);

        // Create notification that application was received
        NotificationService::createVisitSubmittedNotification($visit);
        NotificationService::notifySuperAdminsAboutVisit($visit);

        // Log the action
        $inmateName = trim("{$visit->inmate_first_name} {$visit->inmate_middle_name} {$visit->inmate_last_name}");
        AuditLogService::logAction(
            'visit_submitted',
            $visit,
            'Schedule Management',
            "Visit schedule submitted for {$inmateName}. Type: {$visit->visit_type->value}. Scheduled: {$visit->scheduled_date->format('M d, Y')} at {$visit->scheduled_time}",
            $request,
            [
                'inmate_name' => $inmateName,
                'visit_type' => $visit->visit_type->value,
                'scheduled_date' => $visit->scheduled_date->format('Y-m-d'),
                'scheduled_time' => $visit->scheduled_time,
            ]
        );

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

        // Log the action
        $inmateName = trim("{$visit->inmate_first_name} {$visit->inmate_middle_name} {$visit->inmate_last_name}");
        AuditLogService::logAction(
            'visit_cancelled',
            $visit,
            'Schedule Management',
            "Visit schedule cancelled for {$inmateName}. Was scheduled for: {$visit->scheduled_date->format('M d, Y')} at {$visit->scheduled_time}",
            $request,
            [
                'inmate_name' => $inmateName,
                'scheduled_date' => $visit->scheduled_date->format('Y-m-d'),
                'scheduled_time' => $visit->scheduled_time,
            ]
        );

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

        if (\Carbon\Carbon::parse($request->scheduled_date)->isToday() && now()->format('H:i') >= '21:50') {
            return redirect()->back()
                ->withErrors(['scheduled_date' => 'This day is no longer available for scheduling (cutoff 9:50 PM). Please select another date.'])
                ->withInput();
        }

        // Check if the new time slot has capacity (excluding the current visit)
        $isAvailable = \App\Models\TimeSlotCapacity::isAvailable(
            $request->scheduled_date,
            $request->scheduled_time,
            $visit->visit_type->value,
            $visit->id
        );

        if (! $isAvailable) {
            $capacity = \App\Models\TimeSlotCapacity::getCapacity($request->scheduled_time, $visit->visit_type->value);

            return redirect()->back()
                ->withErrors(['scheduled_time' => "This time slot is full (maximum capacity: {$capacity} visitors). Please select another time."])
                ->withInput();
        }

        $oldDate = $visit->scheduled_date->format('Y-m-d');
        $oldTime = $visit->scheduled_time;

        // Update the visit status to pending after rescheduling
        $visit->update([
            'scheduled_date' => $request->scheduled_date,
            'scheduled_time' => $request->scheduled_time,
            'status' => VisitStatus::Pending,
            'meeting_link' => null, // Clear meeting link as it needs to be re-approved
        ]);

        // Create notification
        NotificationService::createVisitSubmittedNotification($visit);

        // Log the action
        $inmateName = trim("{$visit->inmate_first_name} {$visit->inmate_middle_name} {$visit->inmate_last_name}");
        AuditLogService::logAction(
            'visit_rescheduled',
            $visit,
            'Schedule Management',
            "Visit schedule rescheduled for {$inmateName}. From: {$oldDate} {$oldTime} to {$request->scheduled_date} {$request->scheduled_time}",
            $request,
            [
                'inmate_name' => $inmateName,
                'old_date' => $oldDate,
                'old_time' => $oldTime,
                'new_date' => $request->scheduled_date,
                'new_time' => $request->scheduled_time,
            ]
        );

        return redirect()->back()->with('success', 'Visit schedule rescheduled successfully. Your rescheduled request has been sent to the BJMP officer for review.');
    }
}
