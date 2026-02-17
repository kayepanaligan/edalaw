<?php

use App\ApprovalStatus;
use App\Models\User;
use App\Models\UserSession;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('super admin can view session management page', function () {
    $superAdmin = User::factory()->superAdmin()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $response = $this->actingAs($superAdmin)->get(route('admin.sessions.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/SessionManagement')
        ->has('sessions')
        ->has('stats')
        ->has('my_other_sessions_count')
    );
});

test('super admin can revoke all sessions for a user', function () {
    $superAdmin = User::factory()->superAdmin()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $targetUser = User::factory()->visitor()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    UserSession::create([
        'user_id' => $targetUser->id,
        'session_id' => 'fake-session-id-123',
        'ip_address' => '127.0.0.1',
        'is_current' => true,
        'last_activity' => now(),
    ]);

    expect(UserSession::where('user_id', $targetUser->id)->count())->toBe(1);

    $response = $this->actingAs($superAdmin)->post(route('admin.sessions.revoke-user-all', $targetUser->id));

    $response->assertRedirect();
    $response->assertSessionHas('success');
    expect(UserSession::where('user_id', $targetUser->id)->count())->toBe(0);
});

test('super admin can revoke own other sessions', function () {
    $superAdmin = User::factory()->superAdmin()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    UserSession::create([
        'user_id' => $superAdmin->id,
        'session_id' => 'other-session-1',
        'ip_address' => '192.168.1.1',
        'is_current' => false,
        'last_activity' => now(),
    ]);
    UserSession::create([
        'user_id' => $superAdmin->id,
        'session_id' => 'other-session-2',
        'ip_address' => '192.168.1.2',
        'is_current' => false,
        'last_activity' => now(),
    ]);

    expect(UserSession::where('user_id', $superAdmin->id)->count())->toBe(2);

    $response = $this->actingAs($superAdmin)->post(route('admin.sessions.revoke-my-other'));

    $response->assertRedirect();
    $response->assertSessionHas('success');
    expect(UserSession::where('user_id', $superAdmin->id)->count())->toBe(0);
});

test('non-super admin cannot access session management', function () {
    $bjmpOfficer = User::factory()->bjmpOfficer()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $response = $this->actingAs($bjmpOfficer)->get(route('admin.sessions.index'));

    $response->assertForbidden();
});
