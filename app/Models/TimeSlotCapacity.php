<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeSlotCapacity extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'time_slot',
        'visit_type',
        'max_capacity',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'max_capacity' => 'integer',
        ];
    }

    /**
     * Get the default capacity for a time slot if not configured.
     */
    public static function getCapacity(string $timeSlot, string $visitType, int $default = 4): int
    {
        $capacity = self::where('time_slot', $timeSlot)
            ->where('visit_type', $visitType)
            ->first();

        return $capacity ? $capacity->max_capacity : $default;
    }

    /**
     * Get the current booking count for a time slot on a specific date.
     */
    public static function getCurrentBookings(string $date, string $timeSlot, string $visitType): int
    {
        return \App\Models\Visit::where('scheduled_date', $date)
            ->where('scheduled_time', $timeSlot)
            ->where('visit_type', $visitType)
            ->whereIn('status', [\App\VisitStatus::Pending, \App\VisitStatus::Approved])
            ->count();
    }

    /**
     * Check if a time slot is available.
     */
    public static function isAvailable(string $date, string $timeSlot, string $visitType, ?int $excludeVisitId = null): bool
    {
        $capacity = self::getCapacity($timeSlot, $visitType);
        $currentBookings = self::getCurrentBookings($date, $timeSlot, $visitType);

        // Exclude the current visit if rescheduling
        if ($excludeVisitId) {
            $excludeVisit = \App\Models\Visit::find($excludeVisitId);
            if ($excludeVisit &&
                $excludeVisit->scheduled_date->format('Y-m-d') === $date &&
                $excludeVisit->scheduled_time === $timeSlot &&
                $excludeVisit->visit_type->value === $visitType) {
                $currentBookings--;
            }
        }

        return $currentBookings < $capacity;
    }
}
