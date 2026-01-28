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
        Role::updateOrCreate(
            ['slug' => 'super_admin'],
            ['name' => 'Super Admin']
        );

        Role::updateOrCreate(
            ['slug' => 'bjmp_officer'],
            ['name' => 'BJMP Officer']
        );

        Role::updateOrCreate(
            ['slug' => 'visitor'],
            ['name' => 'Visitor']
        );
    }
}
