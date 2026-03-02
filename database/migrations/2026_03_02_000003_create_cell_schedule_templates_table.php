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
        Schema::create('cell_schedule_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cell_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('day_of_week'); // 0 = Sunday, 6 = Saturday
            $table->boolean('virtual_available')->default(false);
            $table->boolean('physical_available')->default(false);
            $table->json('time_slots')->nullable(); // For future flexibility
            $table->timestamps();

            $table->unique(['cell_id', 'day_of_week']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cell_schedule_templates');
    }
};
