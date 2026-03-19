<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Services\VideoSdkService;

echo "Testing VideoSDK Configuration...\n\n";

$sdk = new VideoSdkService();

echo "Is V2 Rooms: " . ($sdk->isV2Rooms() ? 'YES' : 'NO') . "\n";
echo "API Endpoint: " . config('services.videosdk.api_endpoint') . "\n";
echo "API Key: " . (config('services.videosdk.api_key') ? 'SET' : 'NOT SET') . "\n";
echo "Secret Key: " . (config('services.videosdk.secret_key') ? 'SET' : 'NOT SET') . "\n";
echo "Token: " . (config('services.videosdk.token') ? 'SET (v1)' : 'NOT SET') . "\n\n";

// Try to create a test room
echo "Creating test room...\n";
$roomName = 'test-room-' . time();
$result = $sdk->createRoom($roomName);

if ($result['success']) {
    echo "✓ Room created successfully!\n";
    echo "  Room ID: " . ($result['room_id'] ?? 'N/A') . "\n";
    echo "  Room Name: " . ($result['room_name'] ?? 'N/A') . "\n";
    echo "  Room URL: " . ($result['room_url'] ?? 'N/A') . "\n\n";
    
    // Try to validate the room
    echo "Validating room...\n";
    $validation = $sdk->validateRoom($result['room_id']);
    if ($validation['success']) {
        echo "✓ Room validation successful!\n";
    } else {
        echo "✗ Room validation failed: " . ($validation['error'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "✗ Room creation failed: " . ($result['error'] ?? 'Unknown error') . "\n";
}

echo "\nDone.\n";
