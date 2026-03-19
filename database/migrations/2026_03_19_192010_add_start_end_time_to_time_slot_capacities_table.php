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
            $table->time('start_time')->default('07:00:00')->after('visit_type');
            $table->time('end_time')->default('18:00:00')->after('start_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_slot_capacities', function (Blueprint $table) {
            $table->dropColumn(['start_time', 'end_time']);
        });
    }
};
