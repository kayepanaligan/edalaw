<?php

use App\Models\Role;
use App\Models\User;
use App\Models\Visit;
use App\Models\VisitSession;
use App\Services\VideoSdkService;
use Carbon\Carbon;

it('updates visit_sessions.room_id and visits.daily_co_room_id', function () {
    $this->app->instance(VideoSdkService::class, new class extends VideoSdkService
    {
        public function __construct() {}

        public function isV2Rooms(): bool
        {
            return true;
        }

        public function createRoom(string $name, array $options = []): array
        {
            return ['success' => true, 'room_id' => 'new-room-id'];
        }
    });

    $visitorRole = Role::query()->create(['name' => 'Visitor', 'slug' => 'visitor']);
    $user = User::factory()->create(['role_id' => $visitorRole->id]);

    $visit = Visit::query()->create([
        'user_id' => $user->id,
        'scheduled_date' => now()->toDateString(),
        'scheduled_time' => '08:00:00',
        'visit_type' => 'virtual',
        'inmate_first_name' => 'Test',
        'inmate_last_name' => 'Inmate',
        'status' => 'approved',
    ]);

    $session = VisitSession::query()->create([
        'visit_id' => $visit->id,
        'eburol_id' => null,
        'room_id' => 'old-room-id',
        'monitor_id' => null,
        'scheduled_start' => Carbon::now(),
        'scheduled_end' => Carbon::now()->addHour(),
        'status' => 'scheduled',
        'recording_status' => 'pending',
    ]);

    $this->artisan('videosdk:fix-room-ids', ['--session' => [$session->id]])
        ->assertExitCode(0);

    expect($session->refresh()->room_id)->toBe('new-room-id');
    expect($visit->refresh()->daily_co_room_id)->toBe('new-room-id');
});

it('does not write changes in dry-run mode', function () {
    $this->app->instance(VideoSdkService::class, new class extends VideoSdkService
    {
        public function __construct() {}

        public function isV2Rooms(): bool
        {
            return true;
        }

        public function createRoom(string $name, array $options = []): array
        {
            return ['success' => true, 'room_id' => 'new-room-id'];
        }
    });

    $visitorRole = Role::query()->create(['name' => 'Visitor', 'slug' => 'visitor']);
    $user = User::factory()->create(['role_id' => $visitorRole->id]);

    $visit = Visit::query()->create([
        'user_id' => $user->id,
        'scheduled_date' => now()->toDateString(),
        'scheduled_time' => '08:00:00',
        'visit_type' => 'virtual',
        'inmate_first_name' => 'Test',
        'inmate_last_name' => 'Inmate',
        'status' => 'approved',
    ]);

    $session = VisitSession::query()->create([
        'visit_id' => $visit->id,
        'eburol_id' => null,
        'room_id' => 'old-room-id',
        'monitor_id' => null,
        'scheduled_start' => Carbon::now(),
        'scheduled_end' => Carbon::now()->addHour(),
        'status' => 'scheduled',
        'recording_status' => 'pending',
    ]);

    $this->artisan('videosdk:fix-room-ids', ['--session' => [$session->id], '--dry-run' => true])
        ->assertExitCode(0);

    expect($session->refresh()->room_id)->toBe('old-room-id');
    expect($visit->refresh()->daily_co_room_id)->toBeNull();
});
