<?php

use App\ApprovalStatus;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('super admin can view user management page', function () {
    $superAdmin = User::factory()->superAdmin()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $response = $this->actingAs($superAdmin)->get(route('admin.users.index'));

    $response->assertSuccessful();
});

test('non-super admin cannot access user management page', function () {
    $bjmpOfficer = User::factory()->bjmpOfficer()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $response = $this->actingAs($bjmpOfficer)->get(route('admin.users.index'));

    $response->assertForbidden();
});

test('super admin can approve a pending user', function () {
    $superAdmin = User::factory()->superAdmin()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $pendingUser = User::factory()->visitor()->create([
        'approval_status' => ApprovalStatus::Pending,
    ]);

    $response = $this->actingAs($superAdmin)->post(route('admin.users.approve', $pendingUser));

    $response->assertRedirect();
    expect($pendingUser->fresh()->approval_status)->toBe(ApprovalStatus::Approved);
});

test('super admin can reject a pending user', function () {
    $superAdmin = User::factory()->superAdmin()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $pendingUser = User::factory()->visitor()->create([
        'approval_status' => ApprovalStatus::Pending,
    ]);

    $response = $this->actingAs($superAdmin)->post(route('admin.users.reject', $pendingUser));

    $response->assertRedirect();
    expect($pendingUser->fresh()->approval_status)->toBe(ApprovalStatus::Rejected);
});

test('user management page displays all users with their status', function () {
    $superAdmin = User::factory()->superAdmin()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $pendingUser = User::factory()->visitor()->create([
        'approval_status' => ApprovalStatus::Pending,
    ]);

    $approvedUser = User::factory()->bjmpOfficer()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $response = $this->actingAs($superAdmin)->get(route('admin.users.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/UserManagement')
        ->has('users', 3)
        ->where('users.0.id', $superAdmin->id)
        ->where('users.1.id', $pendingUser->id)
        ->where('users.2.id', $approvedUser->id)
    );
});

test('unauthenticated users cannot access user management', function () {
    $response = $this->get(route('admin.users.index'));

    $response->assertRedirect(route('login'));
});
