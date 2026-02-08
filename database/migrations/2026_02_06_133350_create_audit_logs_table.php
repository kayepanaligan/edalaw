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
        if (Schema::hasTable('audit_logs')) {
            return;
        }

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('action'); // appeal_submitted, appeal_reviewed, appeal_auto_rejected
            $table->morphs('auditable'); // Can be Appeal, Visit, Eburol
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // User who performed the action
            $table->string('user_role')->nullable(); // Role of the user
            $table->text('description'); // Detailed description of the action
            $table->json('metadata')->nullable(); // Additional data (IP, user agent, etc.)
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index(['action', 'created_at']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
