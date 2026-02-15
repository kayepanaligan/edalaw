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
        Schema::create('inmate_tunnels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_session_id')->constrained()->cascadeOnDelete();
            $table->string('tunnel_token', 64)->unique()->index();
            $table->timestamp('expires_at');
            $table->boolean('is_used')->default(false);
            $table->timestamps();

            $table->index(['tunnel_token', 'expires_at', 'is_used']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inmate_tunnels');
    }
};
