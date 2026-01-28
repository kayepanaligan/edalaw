<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('last_name')->nullable()->after('middle_name');
            $table->date('dob')->nullable()->after('last_name');
            $table->string('gender')->nullable()->after('dob');
            $table->string('street')->nullable()->after('gender');
            $table->string('brgy')->nullable()->after('street');
            $table->string('municipality')->nullable()->after('brgy');
            $table->string('province')->nullable()->after('municipality');
            $table->string('postal_code')->nullable()->after('province');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'middle_name',
                'last_name',
                'dob',
                'gender',
                'street',
                'brgy',
                'municipality',
                'province',
                'postal_code',
            ]);
        });
    }
};
