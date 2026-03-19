<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Visit;
use App\Models\VisitSession;
use App\Services\VideoSdkService;

// Find all approved virtual visits
$visits = Visit::where('status', 'approved')
    ->where('visit_type', 'virtual')
    ->get();

echo 'Found '.$visits->count()." approved virtual visits\n\n";

$videoSdk = new VideoSdkService;

foreach ($visits as $visit) {
    echo "Processing Visit ID: {$visit->id}\n";
    echo "  Old Room ID: {$visit->daily_co_room_id}\n";

    // Create a new v1 room
    $roomName = "visit-{$visit->id}-".uniqid();
    $roomResult = $videoSdk->createRoom($roomName);

    if (! $roomResult['success']) {
        echo '  ERROR: Failed to create room - '.($roomResult['error'] ?? 'Unknown')."\n\n";

        continue;
    }

    $newRoomId = $roomResult['room_id'];
    $roomUrl = $roomResult['room_url'] ?? null;

    // Update the visit
    $visit->update([
        'daily_co_room_id' => $newRoomId,
        'daily_co_room_name' => $roomResult['room_name'] ?? $roomName,
        'daily_co_room_url' => $roomUrl,
        'meeting_link' => $roomUrl,
        'room_created_at' => now(),
    ]);

    echo "  New Room ID: {$newRoomId}\n";

    // Update the associated VisitSession
    $session = VisitSession::where('visit_id', $visit->id)->first();
    if ($session) {
        $session->update(['room_id' => $newRoomId]);
        echo "  Session ID {$session->id} updated with new room_id\n";
    } else {
        echo "  WARNING: No session found for this visit\n";
    }

    echo "  Done!\n\n";
}

echo "All visits processed.\n";
