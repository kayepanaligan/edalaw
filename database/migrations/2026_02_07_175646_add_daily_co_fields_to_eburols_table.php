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
        Schema::table('eburols', function (Blueprint $table) {
            $table->string('daily_co_room_id')->nullable();
            $table->string('daily_co_room_name')->nullable();
            $table->string('daily_co_room_url')->nullable();
            $table->json('daily_co_config')->nullable();
            $table->string('inmate_token')->nullable();
            $table->timestamp('room_created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('eburols', function (Blueprint $table) {
            $table->dropColumn([
                'daily_co_room_id',
                'daily_co_room_name',
                'daily_co_room_url',
                'daily_co_config',
                'inmate_token',
                'room_created_at',
            ]);
        });
    }
};
