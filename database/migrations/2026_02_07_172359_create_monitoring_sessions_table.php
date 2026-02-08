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
        Schema::create('monitoring_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('eburol_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('visitor_id')->constrained('users')->cascadeOnDelete();
            $table->string('session_type'); // 'visit' or 'eburol'
            $table->string('session_token')->unique();
            $table->string('status')->default('active'); // active, paused, terminated, completed
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->json('connection_health')->nullable(); // packet loss, disconnections, etc.
            $table->boolean('visitor_camera_enabled')->default(true);
            $table->boolean('visitor_microphone_enabled')->default(true);
            $table->boolean('chat_locked')->default(false);
            $table->boolean('video_locked')->default(false);
            $table->text('enforcement_notes')->nullable();
            $table->foreignId('monitored_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status', 'started_at']);
            $table->index('session_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monitoring_sessions');
    }
};
