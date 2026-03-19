<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\VisitSession;
use App\Services\VideoSdkService;

echo "Fixing Visit Session Rooms...\n\n";

// Get all scheduled visit sessions
$sessions = VisitSession::where('status', 'scheduled')
    ->orderBy('id', 'desc')
    ->limit(10)
    ->get(['id', 'room_id', 'visit_id', 'eburol_id']);

echo "Found " . $sessions->count() . " scheduled sessions\n\n";

foreach ($sessions as $session) {
    echo "Session ID: {$session->id}\n";
    echo "  Old Room ID: {$session->room_id}\n";
    
    // Create new room
    $sdk = new VideoSdkService();
    $roomName = "visit-" . ($session->visit_id ?? $session->eburol_id) . "-fix-" . time();
    $result = $sdk->createRoom($roomName);
    
    if ($result['success']) {
        $newRoomId = $result['room_id'];
        
        // Update session
        $session->room_id = $newRoomId;
        $session->save();
        
        echo "  ✓ New Room ID: {$newRoomId}\n";
        echo "  ✓ Room URL: {$result['room_url']}\n";
    } else {
        echo "  ✗ Failed to create room: " . ($result['error'] ?? 'Unknown error') . "\n";
    }
    
    echo "\n";
}

echo "Done.\n";
