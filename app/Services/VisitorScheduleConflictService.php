<?php

namespace App\Services;

use App\EburolStatus;
use App\Models\Eburol;
use App\Models\Visit;
use App\VisitStatus;

class VisitorScheduleConflictService
{
    /**
     * Check if the visitor already has a virtual visit or e-burol in the same time range on the same date.
     * Used to prevent double-booking.
     *
     * @param  int  $userId  Visitor user id
     * @param  string  $date  Date Y-m-d
     * @param  string  $timeStart  Slot start time e.g. "08:00"
     * @param  int  $durationMinutes  Slot duration (e.g. 60 for e-burol, 10 for virtual visit)
     */
    public function hasConflict(int $userId, string $date, string $timeStart, int $durationMinutes): bool
    {
        $newStart = $this->timeToMinutes($timeStart);
        $newEnd = $newStart + $durationMinutes;

        $visits = Visit::where('user_id', $userId)
            ->where('scheduled_date', $date)
            ->whereIn('status', [VisitStatus::Pending, VisitStatus::Approved])
            ->get();

        foreach ($visits as $visit) {
            $slotStart = $this->timeToMinutes($visit->scheduled_time);
            $slotDuration = $visit->visit_type->value === 'virtual' ? 10 : 60;
            $slotEnd = $slotStart + $slotDuration;
            if ($this->rangesOverlap($newStart, $newEnd, $slotStart, $slotEnd)) {
                return true;
            }
        }

        $eburols = Eburol::where('user_id', $userId)
            ->where('wake_start_date', '<=', $date)
            ->where('wake_end_date', '>=', $date)
            ->whereIn('status', [EburolStatus::Pending, EburolStatus::Approved])
            ->get();

        foreach ($eburols as $eburol) {
            if (! $eburol->preferred_time) {
                continue;
            }
            $slotStart = $this->timeToMinutes($eburol->preferred_time);
            $slotEnd = $slotStart + 60;
            if ($this->rangesOverlap($newStart, $newEnd, $slotStart, $slotEnd)) {
                return true;
            }
        }

        return false;
    }

    private function timeToMinutes(string $time): int
    {
        $parts = explode(':', trim($time), 3);
        $h = (int) ($parts[0] ?? 0);
        $m = (int) ($parts[1] ?? 0);

        return $h * 60 + $m;
    }

    private function rangesOverlap(int $start1, int $end1, int $start2, int $end2): bool
    {
        return $start1 < $end2 && $start2 < $end1;
    }
}
