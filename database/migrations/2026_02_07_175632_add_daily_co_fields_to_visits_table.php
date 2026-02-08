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
        Schema::table('visits', function (Blueprint $table) {
            $table->string('daily_co_room_id')->nullable()->after('meeting_link');
            $table->string('daily_co_room_name')->nullable()->after('daily_co_room_id');
            $table->string('daily_co_room_url')->nullable()->after('daily_co_room_name');
            $table->json('daily_co_config')->nullable()->after('daily_co_room_url');
            $table->string('inmate_token')->nullable()->after('daily_co_config');
            $table->timestamp('room_created_at')->nullable()->after('inmate_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
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
