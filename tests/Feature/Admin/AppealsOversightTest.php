<?php

use App\ApprovalStatus;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('super admin can view appeals oversight page', function () {
    $superAdmin = User::factory()->superAdmin()->create([
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $response = $this->actingAs($superAdmin)->get(route('admin.appeals.index'));

    $response->assertSuccessful();
});
