<?php

use App\ApprovalStatus;
use App\Models\ChatLog;
use App\Models\User;
use App\Models\Visit;
use App\Models\VisitSession;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('visitor can list chat messages for own session', function () {
    $visitor = User::factory()->visitor()->create(['approval_status' => ApprovalStatus::Approved]);
    $monitor = User::factory()->monitoringOfficer()->create();
    $visit = Visit::create([
        'user_id' => $visitor->id,
        'scheduled_date' => now()->toDateString(),
        'scheduled_time' => '10:00',
        'visit_type' => 'virtual',
        'inmate_first_name' => 'Test',
        'inmate_last_name' => 'Inmate',
        'status' => 'approved',
    ]);
    $session = VisitSession::create([
        'visit_id' => $visit->id,
        'room_id' => 'room-'.uniqid(),
        'monitor_id' => $monitor->id,
        'scheduled_start' => now(),
        'scheduled_end' => now()->addHour(),
        'status' => 'active',
    ]);

    $response = $this->actingAs($visitor)->getJson(route('visit-session.chat.index', $session));

    $response->assertOk()
        ->assertJsonStructure(['messages', 'chat_locked'])
        ->assertJson(['messages' => [], 'chat_locked' => false]);
});

test('visitor can send chat message and it is stored', function () {
    $visitor = User::factory()->visitor()->create(['approval_status' => ApprovalStatus::Approved]);
    $monitor = User::factory()->monitoringOfficer()->create();
    $visit = Visit::create([
        'user_id' => $visitor->id,
        'scheduled_date' => now()->toDateString(),
        'scheduled_time' => '10:00',
        'visit_type' => 'virtual',
        'inmate_first_name' => 'Test',
        'inmate_last_name' => 'Inmate',
        'status' => 'approved',
    ]);
    $session = VisitSession::create([
        'visit_id' => $visit->id,
        'room_id' => 'room-'.uniqid(),
        'monitor_id' => $monitor->id,
        'scheduled_start' => now(),
        'scheduled_end' => now()->addHour(),
        'status' => 'active',
    ]);

    $response = $this->actingAs($visitor)->postJson(route('visit-session.chat.store', $session), [
        'message' => 'Hello',
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['sender' => 'visitor', 'message' => 'Hello']);
    expect(ChatLog::where('visit_session_id', $session->id)->count())->toBe(1);
});
