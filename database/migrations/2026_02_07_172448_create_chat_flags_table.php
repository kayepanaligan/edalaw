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
        Schema::create('chat_flags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_message_id')->constrained()->cascadeOnDelete();
            $table->foreignId('monitoring_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('flagged_by')->constrained('users')->cascadeOnDelete();
            $table->string('reason');
            $table->string('severity'); // 'low', 'medium', 'high', 'critical'
            $table->text('notes')->nullable();
            $table->integer('recording_timestamp')->nullable(); // timestamp in seconds from session start
            $table->boolean('escalated_to_admin')->default(false);
            $table->foreignId('escalated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('escalated_at')->nullable();
            $table->timestamps();

            $table->index(['monitoring_session_id', 'severity']);
            $table->index('escalated_to_admin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_flags');
    }
};
