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
        Schema::create('session_recordings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monitoring_session_id')->constrained()->cascadeOnDelete();
            $table->string('recording_type'); // 'video', 'audio', 'chat_transcript'
            $table->string('file_path');
            $table->string('file_name');
            $table->string('mime_type')->nullable();
            $table->bigInteger('file_size')->nullable(); // in bytes
            $table->integer('duration_seconds')->nullable();
            $table->timestamp('recorded_at');
            $table->json('metadata')->nullable(); // additional recording metadata
            $table->timestamps();

            $table->index(['monitoring_session_id', 'recording_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_recordings');
    }
};
