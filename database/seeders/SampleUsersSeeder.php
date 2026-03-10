<?php

namespace Database\Seeders;

use App\ApprovalStatus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SampleUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdminRole = Role::where('slug', 'super_admin')->first();
        $bjmpOfficerRole = Role::where('slug', 'bjmp_officer')->first();
        $visitorRole = Role::where('slug', 'visitor')->first();
        $monitoringOfficerRole = Role::where('slug', 'monitoring_officer')->first();
        $jailOfficerRole = Role::where('slug', 'jail_officer')->first();

        // Super Admin
        User::updateOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'first_name' => 'Kaye Antoinette',
                'middle_name' => 'Presores',
                'last_name' => 'Panaligan',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1980-01-01',
                'gender' => 'male',
                'street' => '123 Main Street',
                'brgy' => 'Aplaya',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $superAdminRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        // BJMP Officer
        User::updateOrCreate(
            ['email' => 'bjmp@example.com'],
            [
                'first_name' => 'Maria',
                'middle_name' => 'Santos',
                'last_name' => 'Garcia',
                'email' => 'bjmp@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1985-05-15',
                'gender' => 'female',
                'street' => '456 Rizal Avenue',
                'brgy' => 'San Miguel',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $bjmpOfficerRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        // Visitor
        User::updateOrCreate(
            ['email' => 'visitor@example.com'],
            [
                'first_name' => 'Juan',
                'middle_name' => 'Dela',
                'last_name' => 'Cruz',
                'email' => 'visitor@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1990-10-20',
                'gender' => 'male',
                'street' => '789 Bonifacio Street',
                'brgy' => 'Zone 1',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $visitorRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        // Monitoring Officer
        User::updateOrCreate(
            ['email' => 'monitoring@example.com'],
            [
                'first_name' => 'Ana',
                'middle_name' => 'Rose',
                'last_name' => 'Torres',
                'email' => 'monitoring@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1988-03-12',
                'gender' => 'female',
                'street' => '321 Quezon Boulevard',
                'brgy' => 'Zone 2',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $monitoringOfficerRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        // Jail Officer (Unified Role - combines BJMP Officer + Monitoring Officer)
        User::updateOrCreate(
            ['email' => 'jailofficer@example.com'],
            [
                'first_name' => 'Roberto',
                'middle_name' => 'Diaz',
                'last_name' => 'Fernandez',
                'email' => 'jailofficer@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1983-07-25',
                'gender' => 'male',
                'street' => '555 Jail Facility Road',
                'brgy' => 'Central',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $jailOfficerRole?->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        // Additional Super Admin Users
        User::updateOrCreate(
            ['email' => 'admin1@example.com'],
            [
                'first_name' => 'John',
                'middle_name' => 'Michael',
                'last_name' => 'Smith',
                'email' => 'admin1@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1985-06-15',
                'gender' => 'male',
                'street' => '456 Admin Street',
                'brgy' => 'Zone 3',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $superAdminRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        // Additional BJMP Officer Users
        User::updateOrCreate(
            ['email' => 'bjmp1@example.com'],
            [
                'first_name' => 'Carlos',
                'middle_name' => 'Reyes',
                'last_name' => 'Villanueva',
                'email' => 'bjmp1@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1987-09-22',
                'gender' => 'male',
                'street' => '789 Officer Lane',
                'brgy' => 'San Isidro',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $bjmpOfficerRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'bjmp2@example.com'],
            [
                'first_name' => 'Rosa',
                'middle_name' => 'Luna',
                'last_name' => 'Fernandez',
                'email' => 'bjmp2@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1990-11-08',
                'gender' => 'female',
                'street' => '321 Service Road',
                'brgy' => 'Rizal',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $bjmpOfficerRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        // Additional Visitor Users
        User::updateOrCreate(
            ['email' => 'visitor1@example.com'],
            [
                'first_name' => 'Maria',
                'middle_name' => 'Cruz',
                'last_name' => 'Santos',
                'email' => 'visitor1@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1992-04-18',
                'gender' => 'female',
                'street' => '654 Visitor Avenue',
                'brgy' => 'Zone 4',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $visitorRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'visitor2@example.com'],
            [
                'first_name' => 'Pedro',
                'middle_name' => 'Alvarez',
                'last_name' => 'Ramos',
                'email' => 'visitor2@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1989-07-25',
                'gender' => 'male',
                'street' => '987 Family Street',
                'brgy' => 'Zone 5',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $visitorRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'visitor3@example.com'],
            [
                'first_name' => 'Liza',
                'middle_name' => 'Mae',
                'last_name' => 'Bautista',
                'email' => 'visitor3@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1995-12-03',
                'gender' => 'female',
                'street' => '147 Community Road',
                'brgy' => 'Zone 6',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $visitorRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        // Additional Monitoring Officer Users
        User::updateOrCreate(
            ['email' => 'monitoring1@example.com'],
            [
                'first_name' => 'Roberto',
                'middle_name' => 'James',
                'last_name' => 'Mendoza',
                'email' => 'monitoring1@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1986-02-14',
                'gender' => 'male',
                'street' => '258 Monitor Boulevard',
                'brgy' => 'Zone 7',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $monitoringOfficerRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'monitoring2@example.com'],
            [
                'first_name' => 'Grace',
                'middle_name' => 'Ann',
                'last_name' => 'Lopez',
                'email' => 'monitoring2@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1991-08-30',
                'gender' => 'female',
                'street' => '369 Watch Street',
                'brgy' => 'Zone 8',
                'municipality' => 'Digos City',
                'province' => 'Davao del Sur',
                'postal_code' => '8002',
                'role_id' => $monitoringOfficerRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );
    }
}
