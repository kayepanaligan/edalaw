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
        Schema::create('call_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('phone_number');
            $table->string('call_type')->default('outgoing'); // incoming, outgoing
            $table->timestamp('call_date');
            $table->integer('duration')->nullable(); // duration in seconds
            $table->text('notes')->nullable();
            $table->string('status')->default('completed'); // completed, missed, failed
            $table->timestamps();
            
            $table->index(['user_id', 'call_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('call_logs');
    }
};
