<?php

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('super admin can access super admin dashboard', function () {
    $user = User::factory()->superAdmin()->create();

    $response = $this->actingAs($user)->get(route('dashboard.super-admin'));

    $response->assertSuccessful();
});

test('bjmp officer can access bjmp officer dashboard', function () {
    $user = User::factory()->bjmpOfficer()->create();

    $response = $this->actingAs($user)->get(route('dashboard.bjmp-officer'));

    $response->assertSuccessful();
});

test('visitor can access visitor dashboard', function () {
    $user = User::factory()->visitor()->create();

    $response = $this->actingAs($user)->get(route('dashboard.visitor'));

    $response->assertSuccessful();
});

test('super admin is redirected to super admin dashboard from main dashboard route', function () {
    $user = User::factory()->superAdmin()->create();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('dashboard.super-admin'));
});

test('bjmp officer is redirected to bjmp officer dashboard from main dashboard route', function () {
    $user = User::factory()->bjmpOfficer()->create();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('dashboard.bjmp-officer'));
});

test('visitor is redirected to visitor dashboard from main dashboard route', function () {
    $user = User::factory()->visitor()->create();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('dashboard.visitor'));
});

test('super admin cannot access bjmp officer dashboard', function () {
    $user = User::factory()->superAdmin()->create();

    $response = $this->actingAs($user)->get(route('dashboard.bjmp-officer'));

    $response->assertForbidden();
});

test('super admin cannot access visitor dashboard', function () {
    $user = User::factory()->superAdmin()->create();

    $response = $this->actingAs($user)->get(route('dashboard.visitor'));

    $response->assertForbidden();
});

test('bjmp officer cannot access super admin dashboard', function () {
    $user = User::factory()->bjmpOfficer()->create();

    $response = $this->actingAs($user)->get(route('dashboard.super-admin'));

    $response->assertForbidden();
});

test('bjmp officer cannot access visitor dashboard', function () {
    $user = User::factory()->bjmpOfficer()->create();

    $response = $this->actingAs($user)->get(route('dashboard.visitor'));

    $response->assertForbidden();
});

test('visitor cannot access super admin dashboard', function () {
    $user = User::factory()->visitor()->create();

    $response = $this->actingAs($user)->get(route('dashboard.super-admin'));

    $response->assertForbidden();
});

test('visitor cannot access bjmp officer dashboard', function () {
    $user = User::factory()->visitor()->create();

    $response = $this->actingAs($user)->get(route('dashboard.bjmp-officer'));

    $response->assertForbidden();
});

test('unauthenticated users cannot access dashboards', function () {
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('login'));
});

test('new users are assigned visitor role by default', function () {
    $user = User::factory()->create();

    expect($user->role->slug)->toBe('visitor');
});
