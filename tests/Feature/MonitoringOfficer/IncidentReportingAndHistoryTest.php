<?php

use App\ApprovalStatus;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('monitoring officer can access incidents index', function () {
    $user = User::factory()->monitoringOfficer()->create(['approval_status' => ApprovalStatus::Approved]);

    $response = $this->actingAs($user)->get(route('monitoring-officer.incidents.index'));

    $response->assertSuccessful();
});

test('monitoring officer can access history index', function () {
    $user = User::factory()->monitoringOfficer()->create(['approval_status' => ApprovalStatus::Approved]);

    $response = $this->actingAs($user)->get(route('monitoring-officer.history.index'));

    $response->assertSuccessful();
});

test('monitoring officer can filter assigned sessions by type', function () {
    $user = User::factory()->monitoringOfficer()->create(['approval_status' => ApprovalStatus::Approved]);

    $response = $this->actingAs($user)->get(route('monitoring-officer.assigned-sessions.index', [
        'type' => 'visit',
    ]));

    $response->assertSuccessful();
});
