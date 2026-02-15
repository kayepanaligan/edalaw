<?php

use App\ApprovalStatus;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('super admin can access incident reporting index', function () {
    $user = User::factory()->superAdmin()->create(['approval_status' => ApprovalStatus::Approved]);

    $response = $this->actingAs($user)->get(route('admin.incident-reporting.index'));

    $response->assertSuccessful();
});

test('super admin can filter incident reporting by date and search', function () {
    $user = User::factory()->superAdmin()->create(['approval_status' => ApprovalStatus::Approved]);

    $response = $this->actingAs($user)->get(route('admin.incident-reporting.index', [
        'date_from' => '2025-01-01',
        'date_to' => '2025-12-31',
        'search' => 'test',
        'status' => 'open',
    ]));

    $response->assertSuccessful();
});

test('non super admin cannot access admin incident reporting', function () {
    $user = User::factory()->visitor()->create(['approval_status' => ApprovalStatus::Approved]);

    $response = $this->actingAs($user)->get(route('admin.incident-reporting.index'));

    $response->assertForbidden();
});
