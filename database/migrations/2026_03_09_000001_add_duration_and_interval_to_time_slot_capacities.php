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
        Schema::table('time_slot_capacities', function (Blueprint $table) {
            $table->unsignedInteger('duration_minutes')->default(20)->after('max_capacity')->comment('Duration of each visit in minutes');
            $table->unsignedInteger('interval_minutes')->default(5)->after('duration_minutes')->comment('Interval between visits in minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_slot_capacities', function (Blueprint $table) {
            $table->dropColumn(['duration_minutes', 'interval_minutes']);
        });
    }
};
