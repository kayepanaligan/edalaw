<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimeSlotCapacity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimeSlotConfigurationController extends Controller
{
    /**
     * Display the time slot capacity configuration page.
     */
    public function index(): Response
    {
        // Generate all time slots from 7:00 AM to 5:50 PM in 10-minute intervals
        $timeSlots = [];

        // AM slots: 7:00 AM to 11:50 AM
        for ($hour = 7; $hour < 12; $hour++) {
            for ($minute = 0; $minute < 60; $minute += 10) {
                $timeSlots[] = sprintf('%02d:%02d', $hour, $minute);
            }
        }

        // PM slots: 12:00 PM to 5:50 PM
        for ($hour = 12; $hour < 18; $hour++) {
            for ($minute = 0; $minute < 60; $minute += 10) {
                $timeSlots[] = sprintf('%02d:%02d', $hour, $minute);
            }
        }

        $visitTypes = ['physical', 'virtual'];

        // Get all existing capacities
        $capacities = TimeSlotCapacity::all()->keyBy(function ($capacity) {
            return $capacity->time_slot.'_'.$capacity->visit_type;
        });

        // Organize data for the frontend
        $capacityData = [];
        foreach ($timeSlots as $timeSlot) {
            foreach ($visitTypes as $visitType) {
                $key = $timeSlot.'_'.$visitType;
                $capacity = $capacities->get($key);

                $capacityData[] = [
                    'id' => $capacity?->id,
                    'time_slot' => $timeSlot,
                    'visit_type' => $visitType,
                    'max_capacity' => $capacity?->max_capacity ?? 4,
                ];
            }
        }

        // Check if request is from settings route
        $isSettingsRoute = request()->routeIs('settings.time-slot-capacity');

        if ($isSettingsRoute) {
            return Inertia::render('settings/time-slot-capacity', [
                'capacities' => $capacityData,
            ]);
        }

        return Inertia::render('Admin/TimeSlotConfiguration', [
            'capacities' => $capacityData,
        ]);
    }

    /**
     * Update the capacity for a time slot.
     */
    public function update(Request $request, TimeSlotCapacity $timeSlotCapacity): RedirectResponse
    {
        $request->validate([
            'max_capacity' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        $timeSlotCapacity->update([
            'max_capacity' => $request->max_capacity,
        ]);

        return redirect()->back()
            ->with('success', 'Time slot capacity updated successfully.');
    }

    /**
     * Update or create capacity for a time slot (handles cases where capacity doesn't exist).
     */
    public function updateCapacity(Request $request): RedirectResponse
    {
        $request->validate([
            'time_slot' => ['required', 'string', 'regex:/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/'],
            'visit_type' => ['required', 'string', 'in:physical,virtual'],
            'max_capacity' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        TimeSlotCapacity::updateOrCreate(
            [
                'time_slot' => $request->time_slot,
                'visit_type' => $request->visit_type,
            ],
            [
                'max_capacity' => $request->max_capacity,
            ]
        );

        return redirect()->back()
            ->with('success', 'Time slot capacity updated successfully.');
    }
}
