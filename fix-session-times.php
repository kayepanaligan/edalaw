<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Fixing VisitSession scheduled_end times...\n\n";

$sessions = \App\Models\VisitSession::all();

foreach ($sessions as $session) {
    // Determine visit type
    $visitType = null;
    if ($session->visit_id) {
        $visit = $session->visit;
        if ($visit) {
            $visitType = $visit->visit_type->value;
        }
    } elseif ($session->eburol_id) {
        $visitType = 'virtual'; // Eburol uses virtual settings
    }
    
    if (!$visitType) {
        echo "Session {$session->id}: Skipping (no visit/eburol)\n";
        continue;
    }
    
    // Get duration from TimeSlotCapacity
    $timeSlot = $session->scheduled_start->format('H:i');
    $capacity = \App\Models\TimeSlotCapacity::where('visit_type', $visitType)
        ->where('time_slot', '<=', $timeSlot)
        ->orderBy('time_slot', 'desc')
        ->first();
    
    if (!$capacity) {
        $capacity = \App\Models\TimeSlotCapacity::where('visit_type', $visitType)->first();
    }
    
    $durationMinutes = $capacity?->duration_minutes ?? 20;
    $correctEnd = $session->scheduled_start->copy()->addMinutes($durationMinutes);
    
    // Only update if different
    if ($session->scheduled_end->diffInSeconds($correctEnd) > 0) {
        echo "Session {$session->id} ({$visitType}): ";
        echo "Start: {$session->scheduled_start->format('Y-m-d H:i')} | ";
        echo "Old End: {$session->scheduled_end->format('Y-m-d H:i')} | ";
        echo "New End: {$correctEnd->format('Y-m-d H:i')} ({$durationMinutes} mins)\n";
        
        $session->scheduled_end = $correctEnd;
        $session->duration_seconds = $durationMinutes * 60;
        $session->save();
    }
}

echo "\nDone!\n";
