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

        // Super Admin
        User::updateOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'first_name' => 'Super',
                'middle_name' => null,
                'last_name' => 'Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1980-01-01',
                'gender' => 'male',
                'street' => '123 Admin Street',
                'brgy' => 'Admin Barangay',
                'municipality' => 'Admin City',
                'province' => 'Metro Manila',
                'postal_code' => '1000',
                'role_id' => $superAdminRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        // BJMP Officer
        User::updateOrCreate(
            ['email' => 'bjmp@example.com'],
            [
                'name' => 'BJMP Officer',
                'first_name' => 'BJMP',
                'middle_name' => null,
                'last_name' => 'Officer',
                'email' => 'bjmp@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1985-05-15',
                'gender' => 'female',
                'street' => '456 BJMP Avenue',
                'brgy' => 'BJMP Barangay',
                'municipality' => 'BJMP City',
                'province' => 'Cebu',
                'postal_code' => '6000',
                'role_id' => $bjmpOfficerRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );

        // Visitor
        User::updateOrCreate(
            ['email' => 'visitor@example.com'],
            [
                'name' => 'Visitor',
                'first_name' => 'John',
                'middle_name' => 'Doe',
                'last_name' => 'Visitor',
                'email' => 'visitor@example.com',
                'password' => Hash::make('asdf1234'),
                'dob' => '1990-10-20',
                'gender' => 'male',
                'street' => '789 Visitor Road',
                'brgy' => 'Visitor Barangay',
                'municipality' => 'Visitor Town',
                'province' => 'Laguna',
                'postal_code' => '4000',
                'role_id' => $visitorRole->id,
                'approval_status' => ApprovalStatus::Approved,
                'email_verified_at' => now(),
            ]
        );
    }
}
