<?php

namespace App\Services;

use App\Models\Eburol;
use App\Models\Visit;
use App\Models\VisitSession;
use App\VisitType;
use Illuminate\Support\Facades\Log;

class VisitSessionService
{
    /**
     * Create visit_sessions record when a virtual visit is approved (room already created by controller).
     */
    public function createForVisit(Visit $visit, string $roomId): ?VisitSession
    {
        if ($visit->visit_type !== VisitType::Virtual) {
            return null;
        }

        if (! $visit->monitoring_officer_id) {
            Log::warning('VisitSessionService: Cannot create session for visit without monitoring officer', ['visit_id' => $visit->id]);

            return null;
        }

        $scheduledStart = $visit->scheduled_date->copy();
        if ($visit->scheduled_time) {
            [$h, $m] = explode(':', $visit->scheduled_time);
            $scheduledStart->setTime((int) $h, (int) $m);
        }
        $scheduledEnd = $scheduledStart->copy()->addHour();

        return VisitSession::create([
            'visit_id' => $visit->id,
            'eburol_id' => null,
            'room_id' => $roomId,
            'monitor_id' => $visit->monitoring_officer_id,
            'scheduled_start' => $scheduledStart,
            'scheduled_end' => $scheduledEnd,
            'status' => 'scheduled',
            'recording_status' => 'pending',
        ]);
    }

    /**
     * Create visit_sessions record when an eburol is approved (room already created by controller).
     */
    public function createForEburol(Eburol $eburol, string $roomId): ?VisitSession
    {
        if (! $eburol->monitoring_officer_id) {
            Log::warning('VisitSessionService: Cannot create session for eburol without monitoring officer', ['eburol_id' => $eburol->id]);

            return null;
        }

        $scheduledStart = $eburol->wake_start_date->copy()->setTime(8, 0);
        if ($eburol->preferred_time) {
            [$h, $m] = explode(':', $eburol->preferred_time);
            $scheduledStart->setTime((int) $h, (int) $m);
        }
        $scheduledEnd = $scheduledStart->copy()->addHour();

        return VisitSession::create([
            'visit_id' => null,
            'eburol_id' => $eburol->id,
            'room_id' => $roomId,
            'monitor_id' => $eburol->monitoring_officer_id,
            'scheduled_start' => $scheduledStart,
            'scheduled_end' => $scheduledEnd,
            'status' => 'scheduled',
            'recording_status' => 'pending',
        ]);
    }
}
