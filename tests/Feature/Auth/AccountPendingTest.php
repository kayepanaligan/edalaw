<?php

use App\ApprovalStatus;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('approved user visiting account pending page is logged out and redirected to login', function () {
    $user = User::factory()->visitor()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $response = $this->actingAs($user)->get(route('account-pending'));

    $response->assertRedirect(route('login'));
    $this->assertGuest();
});
