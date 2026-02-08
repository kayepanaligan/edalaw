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
        Schema::create('time_slot_capacities', function (Blueprint $table) {
            $table->id();
            $table->string('time_slot', 5)->comment('Time slot in HH:MM format (e.g., "09:40")');
            $table->enum('visit_type', ['physical', 'virtual']);
            $table->integer('max_capacity')->default(4)->comment('Maximum number of visitors for this time slot');
            $table->timestamps();

            $table->unique(['time_slot', 'visit_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_slot_capacities');
    }
};
