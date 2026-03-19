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
        'duration_minutes',
        'interval_minutes',
        'start_time',
        'end_time',
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
            'duration_minutes' => 'integer',
            'interval_minutes' => 'integer',
            'start_time' => 'datetime:H:i',
            'end_time' => 'datetime:H:i',
        ];
    }

    /**
     * Get the default start time for a visit type.
     */
    public static function getStartTime(string $visitType): string
    {
        $capacity = self::where('visit_type', $visitType)
            ->where('time_slot', '07:00') // Get first slot of the day
            ->first();

        return $capacity?->start_time?->format('H:i') ?? '07:00';
    }

    /**
     * Get the default end time for a visit type.
     */
    public static function getEndTime(string $visitType): string
    {
        $capacity = self::where('visit_type', $visitType)
            ->where('time_slot', '07:00') // Get first slot of the day
            ->first();

        // Default end times: virtual 22:00, physical 18:00
        $defaultEndTime = $visitType === 'virtual' ? '22:00' : '18:00';
        return $capacity?->end_time?->format('H:i') ?? $defaultEndTime;
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
     * Matches scheduled_time in H:i format (DB may store as HH:MM:SS).
     */
    public static function getCurrentBookings(string $date, string $timeSlot, string $visitType): int
    {
        return \App\Models\Visit::where('scheduled_date', $date)
            ->whereRaw('(scheduled_time = ? OR TIME_FORMAT(scheduled_time, \'%H:%i\') = ?)', [$timeSlot, $timeSlot])
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
