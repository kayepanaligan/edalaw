<?php

namespace Database\Seeders;

use App\Models\TimeSlotCapacity;
use Illuminate\Database\Seeder;

class TimeSlotCapacitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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

        foreach ($timeSlots as $timeSlot) {
            foreach ($visitTypes as $visitType) {
                TimeSlotCapacity::firstOrCreate(
                    [
                        'time_slot' => $timeSlot,
                        'visit_type' => $visitType,
                    ],
                    [
                        'max_capacity' => 4, // Default capacity
                    ]
                );
            }
        }
    }
}
