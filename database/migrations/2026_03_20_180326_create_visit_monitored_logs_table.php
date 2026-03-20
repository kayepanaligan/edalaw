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
        Schema::create('visit_monitored_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->nullable()->constrained()->onDelete('set null');
            $table->string('meeting_id')->unique();
            $table->string('room_id')->nullable();
            $table->foreignId('jail_officer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('visitor_id')->constrained('users')->onDelete('cascade');
            $table->string('visitor_name');
            $table->string('inmate_name')->nullable();
            $table->enum('visit_type', ['virtual', 'physical']);
            $table->timestamp('session_started_at');
            $table->timestamp('session_ended_at')->nullable();
            $table->integer('duration_seconds')->default(0);
            $table->integer('unique_participants_count')->default(0);
            $table->json('participants')->nullable(); // Store participant details
            $table->json('session_stats')->nullable(); // Store session statistics
            $table->json('traces')->nullable(); // Store trace logs
            $table->json('errors')->nullable(); // Store error logs
            $table->string('status')->default('completed'); // completed, failed, interrupted
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['meeting_id', 'status']);
            $table->index(['jail_officer_id', 'session_started_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visit_monitored_logs');
    }
};
