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
        Schema::create('user_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('session_id')->unique(); // Laravel session ID
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_type')->nullable(); // mobile, desktop, tablet
            $table->string('device_name')->nullable(); // iPhone, Windows, etc.
            $table->string('browser')->nullable(); // Chrome, Firefox, Safari, etc.
            $table->string('platform')->nullable(); // iOS, Windows, macOS, Android, etc.
            $table->string('location')->nullable(); // City, Country (can be populated via IP geolocation)
            $table->boolean('is_current')->default(false); // Is this the current session?
            $table->timestamp('last_activity')->nullable();
            $table->index(['user_id', 'is_current']);
            $table->index(['user_id', 'last_activity']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_sessions');
    }
};
