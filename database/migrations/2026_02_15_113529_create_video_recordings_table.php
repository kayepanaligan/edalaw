<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('video_recordings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_session_id')->constrained()->cascadeOnDelete();
            $table->string('recording_url')->nullable();
            $table->string('file_path')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->string('end_reason')->nullable();
            $table->string('storage_disk')->default('s3');
            $table->timestamps();

            $table->index('visit_session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_recordings');
    }
};
