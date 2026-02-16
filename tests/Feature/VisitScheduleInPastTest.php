<?php

use App\Models\User;
use App\Models\Visit;
use App\VisitStatus;
use App\VisitType;
use Carbon\Carbon;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('visit is schedule in past returns true when virtual slot has ended', function () {
    $user = User::factory()->visitor()->create();
    $yesterday = Carbon::yesterday();

    $visit = Visit::create([
        'user_id' => $user->id,
        'scheduled_date' => $yesterday,
        'scheduled_time' => '10:00',
        'visit_type' => VisitType::Virtual,
        'inmate_first_name' => 'Test',
        'inmate_last_name' => 'Inmate',
        'status' => VisitStatus::Pending,
    ]);

    expect($visit->isScheduleInPast())->toBeTrue();
});

test('visit is schedule in past returns false when virtual slot is in future', function () {
    $user = User::factory()->visitor()->create();
    $tomorrow = Carbon::tomorrow();

    $visit = Visit::create([
        'user_id' => $user->id,
        'scheduled_date' => $tomorrow,
        'scheduled_time' => '10:00',
        'visit_type' => VisitType::Virtual,
        'inmate_first_name' => 'Test',
        'inmate_last_name' => 'Inmate',
        'status' => VisitStatus::Pending,
    ]);

    expect($visit->isScheduleInPast())->toBeFalse();
});

test('visit is schedule started returns true when slot start has passed', function () {
    $user = User::factory()->visitor()->create();
    $yesterday = Carbon::yesterday();

    $visit = Visit::create([
        'user_id' => $user->id,
        'scheduled_date' => $yesterday,
        'scheduled_time' => '10:00',
        'visit_type' => VisitType::Virtual,
        'inmate_first_name' => 'Test',
        'inmate_last_name' => 'Inmate',
        'status' => VisitStatus::Pending,
    ]);

    expect($visit->isScheduleStarted())->toBeTrue();
});

test('visit is schedule started returns false when slot has not yet started', function () {
    $user = User::factory()->visitor()->create();
    $tomorrow = Carbon::tomorrow();

    $visit = Visit::create([
        'user_id' => $user->id,
        'scheduled_date' => $tomorrow,
        'scheduled_time' => '14:00',
        'visit_type' => VisitType::Virtual,
        'inmate_first_name' => 'Test',
        'inmate_last_name' => 'Inmate',
        'status' => VisitStatus::Pending,
    ]);

    expect($visit->isScheduleStarted())->toBeFalse();
});
