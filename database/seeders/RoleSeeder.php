<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::firstOrCreate(
            ['slug' => 'super_admin'],
            ['name' => 'Super Admin']
        );

        Role::firstOrCreate(
            ['slug' => 'bjmp_officer'],
            ['name' => 'BJMP Officer']
        );

        Role::firstOrCreate(
            ['slug' => 'visitor'],
            ['name' => 'Visitor']
        );

        Role::firstOrCreate(
            ['slug' => 'monitoring_officer'],
            ['name' => 'Monitoring Officer']
        );
    }
}
