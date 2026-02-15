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
        Schema::create('visit_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('eburol_id')->nullable()->constrained()->nullOnDelete();
            $table->string('room_id')->index();
            $table->foreignId('monitor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('scheduled_start');
            $table->dateTime('scheduled_end');
            $table->string('status')->default('scheduled'); // scheduled, active, completed, terminated
            $table->string('recording_status')->default('pending'); // pending, recording, saved, failed
            $table->string('recording_url')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->string('end_reason')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamp('terms_accepted_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'scheduled_start']);
            $table->index('monitor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visit_sessions');
    }
};
