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
        Schema::create('monitoring_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monitoring_session_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('monitor_id')->constrained('users')->cascadeOnDelete();
            $table->string('action'); // 'joined_session', 'flagged_message', 'ended_call', 'paused_session', 'terminated_session', 'disabled_camera', 'disabled_microphone', 'locked_chat', 'locked_video', 'force_disconnected'
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['monitor_id', 'created_at']);
            $table->index(['monitoring_session_id', 'action']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monitoring_logs');
    }
};
