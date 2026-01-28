<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, add role_id column as nullable
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('email');
        });

        // Migrate existing role data to role_id
        $roles = DB::table('roles')->pluck('id', 'slug');
        
        DB::table('users')->where('role', 'super_admin')->update(['role_id' => $roles['super_admin'] ?? 1]);
        DB::table('users')->where('role', 'bjmp_officer')->update(['role_id' => $roles['bjmp_officer'] ?? 2]);
        DB::table('users')->where('role', 'visitor')->orWhereNull('role')->update(['role_id' => $roles['visitor'] ?? 3]);

        // Now make role_id not nullable and add foreign key constraint
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable(false)->change();
            $table->foreign('role_id')->references('id')->on('roles');
        });

        // Drop the old role column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->nullable()->after('email');
        });

        // Migrate role_id back to role
        $roles = DB::table('roles')->pluck('slug', 'id');
        
        foreach ($roles as $id => $slug) {
            DB::table('users')->where('role_id', $id)->update(['role' => $slug]);
        }

        DB::table('users')->whereNull('role')->update(['role' => 'visitor']);

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
            $table->string('role')->nullable(false)->default('visitor')->change();
        });
    }
};
