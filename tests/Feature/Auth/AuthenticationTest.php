<?php

use App\ApprovalStatus;
use App\Models\OtpVerification;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->bjmpOfficer()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    if ($response->status() === 409) {
        $response->assertStatus(409);
        $response->assertHeader('X-Inertia-Location', route('dashboard'));
    } else {
        $response->assertRedirect(route('dashboard', absolute: false));
    }
});

test('approved visitor login redirects to OTP verification and does not log in', function () {
    Http::fake([
        'api.semaphore.co/*' => Http::response([['message_id' => 'test-123']], 200),
    ]);

    $user = User::factory()->visitor()->create([
        'contact_number' => '09171234567',
        'approval_status' => ApprovalStatus::Approved,
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertRedirect(route('otp-verification.show'));
    $response->assertSessionHas('login.user_id', $user->id);
    $response->assertSessionHas('login.requires_otp', true);
});

test('pending visitor login redirects to account pending page', function () {
    $user = User::factory()->visitor()->create([
        'approval_status' => ApprovalStatus::Pending,
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('account-pending'));
});

test('rejected visitor login redirects to account rejected page', function () {
    $user = User::factory()->visitor()->create([
        'approval_status' => ApprovalStatus::Rejected,
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('account-rejected'));
});

test('approved visitor with no contact number gets validation error and no OTP created', function () {
    $user = User::factory()->visitor()->create([
        'approval_status' => ApprovalStatus::Approved,
        'contact_number' => null,
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
    $this->assertEquals(0, OtpVerification::where('user_id', $user->id)->where('type', 'login')->count());
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->bjmpOfficer()->create();

    $user->forceFill([
        'two_factor_secret' => encrypt('test-secret'),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => now(),
    ])->save();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->visitor()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->visitor()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $this->assertGuest();
    $response->assertRedirect(route('home'));
});

test('users are rate limited', function () {
    $user = User::factory()->visitor()->create();

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});
