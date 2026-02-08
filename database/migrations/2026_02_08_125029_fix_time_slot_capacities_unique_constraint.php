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
            // Drop the old unique constraint on time_slot only
            $table->dropUnique(['time_slot']);
            // The composite unique constraint should already exist, but ensure it does
            $table->unique(['time_slot', 'visit_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_slot_capacities', function (Blueprint $table) {
            $table->dropUnique(['time_slot', 'visit_type']);
            $table->unique('time_slot');
        });
    }
};
