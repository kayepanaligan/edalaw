<?php

use App\Models\Visit;
use App\Models\User;
use App\VisitStatus;
use App\VisitType;
use Carbon\Carbon;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('expire pending visits command marks past pending visits as rejected', function () {
    $user = User::factory()->visitor()->create();
    $pastDate = Carbon::yesterday();

    $visit = Visit::create([
        'user_id' => $user->id,
        'scheduled_date' => $pastDate,
        'scheduled_time' => '10:00',
        'visit_type' => VisitType::Virtual,
        'inmate_first_name' => 'Test',
        'inmate_last_name' => 'Inmate',
        'status' => VisitStatus::Pending,
    ]);

    $this->artisan('visits:expire-pending')->assertSuccessful();

    $visit->refresh();
    expect($visit->status)->toBe(VisitStatus::Rejected)
        ->and($visit->rejection_reason)->toContain('This scheduled time has passed');
});

test('expire pending visits command leaves future pending visits unchanged', function () {
    $user = User::factory()->visitor()->create();
    $futureDate = Carbon::tomorrow();

    $visit = Visit::create([
        'user_id' => $user->id,
        'scheduled_date' => $futureDate,
        'scheduled_time' => '14:00',
        'visit_type' => VisitType::Virtual,
        'inmate_first_name' => 'Test',
        'inmate_last_name' => 'Inmate',
        'status' => VisitStatus::Pending,
    ]);

    $this->artisan('visits:expire-pending')->assertSuccessful();

    $visit->refresh();
    expect($visit->status)->toBe(VisitStatus::Pending);
});
