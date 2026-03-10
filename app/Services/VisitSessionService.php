<?php

namespace App\Services;

use App\Models\Eburol;
use App\Models\InmateTunnel;
use App\Models\Visit;
use App\Models\VisitSession;
use App\VisitType;
use Carbon\Carbon;
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

        if (! $visit->jail_officer_id) {
            Log::warning('VisitSessionService: Cannot create session for visit without jail officer', ['visit_id' => $visit->id]);

            return null;
        }

        $scheduledStart = $this->parseSlotStart($visit->scheduled_date, $visit->scheduled_time);
        $scheduledEnd = $scheduledStart->copy()->addHour();

        $session = VisitSession::create([
            'visit_id' => $visit->id,
            'eburol_id' => null,
            'room_id' => $roomId,
            'monitor_id' => $visit->jail_officer_id,
            'scheduled_start' => $scheduledStart,
            'scheduled_end' => $scheduledEnd,
            'status' => 'scheduled',
            'recording_status' => 'pending',
        ]);

        $this->createInmateTunnelForSession($session, $scheduledEnd);

        return $session;
    }

    /**
     * Create visit_sessions record when an eburol is approved (room already created by controller).
     */
    public function createForEburol(Eburol $eburol, string $roomId): ?VisitSession
    {
        if (! $eburol->jail_officer_id) {
            Log::warning('VisitSessionService: Cannot create session for eburol without jail officer', ['eburol_id' => $eburol->id]);

            return null;
        }

        $tz = config('app.timezone');
        $dateStr = $eburol->wake_start_date->format('Y-m-d');
        $timeStr = $eburol->preferred_time ?: '08:00';
        $scheduledStart = Carbon::parse($dateStr.' '.$timeStr, $tz);
        $scheduledEnd = $scheduledStart->copy()->addHour();

        $session = VisitSession::create([
            'visit_id' => null,
            'eburol_id' => $eburol->id,
            'room_id' => $roomId,
            'monitor_id' => $eburol->jail_officer_id,
            'scheduled_start' => $scheduledStart,
            'scheduled_end' => $scheduledEnd,
            'status' => 'scheduled',
            'recording_status' => 'pending',
        ]);

        $this->createInmateTunnelForSession($session, $scheduledEnd);

        return $session;
    }

    /**
     * Parse slot start in application timezone (matches Visit::getSlotStart logic).
     */
    private function parseSlotStart($scheduledDate, ?string $scheduledTime): Carbon
    {
        $dateStr = $scheduledDate->format('Y-m-d');
        if (! $scheduledTime) {
            return Carbon::parse($dateStr, config('app.timezone'))->startOfDay();
        }
        $parts = explode(':', trim($scheduledTime), 2);
        $h = (int) ($parts[0] ?? 0);
        $m = (int) (isset($parts[1]) ? explode(' ', $parts[1])[0] : 0);
        $timeNormalized = sprintf('%02d:%02d', $h, $m);

        return Carbon::parse($dateStr.' '.$timeNormalized, config('app.timezone'));
    }

    /**
     * Create a single inmate tunnel for the session (activated during visit, expires at scheduled end).
     */
    private function createInmateTunnelForSession(VisitSession $session, \Carbon\CarbonInterface $expiresAt): void
    {
        InmateTunnel::create([
            'visit_session_id' => $session->id,
            'tunnel_token' => InmateTunnel::generateToken(),
            'short_code' => InmateTunnel::generateShortCode(),
            'expires_at' => $expiresAt,
            'is_used' => false,
        ]);
    }
}
