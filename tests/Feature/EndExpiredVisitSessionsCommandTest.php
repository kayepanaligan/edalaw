<?php

use App\Models\User;
use App\Models\VisitSession;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('end expired visit sessions command sets status to completed', function () {
    $monitor = User::factory()->monitoringOfficer()->create();
    $session = VisitSession::create([
        'room_id' => 'room-'.uniqid(),
        'monitor_id' => $monitor->id,
        'scheduled_start' => now()->subHours(2),
        'scheduled_end' => now()->subHour(),
        'status' => 'scheduled',
        'recording_status' => 'pending',
    ]);

    $this->artisan('visit-sessions:end-expired')
        ->assertSuccessful();

    $session->refresh();
    expect($session->status)->toBe('completed')
        ->and($session->ended_at)->not->toBeNull();
});
