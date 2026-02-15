<?php

use App\ApprovalStatus;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('bjmp officer can access dashboard overview page', function () {
    $user = User::factory()->bjmpOfficer()->create(['approval_status' => ApprovalStatus::Approved]);

    $response = $this->actingAs($user)->get(route('dashboard.bjmp-officer'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Dashboard/BjmpOfficer')
        ->has('kpis')
        ->has('filters')
        ->has('visitVolumeOverTime')
        ->has('sessionStatusDistribution')
        ->has('facilityUtilization')
        ->has('recentCriticalEvents')
        ->has('overviewDataUrl')
        ->has('exportOverviewUrl')
    );
});

test('bjmp officer can fetch overview data as json', function () {
    $user = User::factory()->bjmpOfficer()->create(['approval_status' => ApprovalStatus::Approved]);

    $response = $this->actingAs($user)->getJson(route('dashboard.bjmp-officer.overview-data').'?date_from='.now()->format('Y-m-d').'&date_to='.now()->format('Y-m-d'));

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'kpis' => [
            'total_visits_today',
            'active_sessions_now',
            'pending_approvals',
            'recording_compliance_rate',
        ],
        'filters',
        'visitVolumeOverTime',
        'sessionStatusDistribution',
        'facilityUtilization',
        'violationFlagTrend',
        'recordingStorageSummary' => ['total_count', 'total_hours'],
    ]);
});

test('bjmp officer can export overview csv', function () {
    $user = User::factory()->bjmpOfficer()->create(['approval_status' => ApprovalStatus::Approved]);

    $response = $this->actingAs($user)->get(route('dashboard.bjmp-officer.export-overview').'?date_from='.now()->format('Y-m-d').'&date_to='.now()->format('Y-m-d'));

    $response->assertSuccessful();
    $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
});

test('guest cannot access bjmp officer overview', function () {
    $response = $this->get(route('dashboard.bjmp-officer'));

    $response->assertRedirect();
});
