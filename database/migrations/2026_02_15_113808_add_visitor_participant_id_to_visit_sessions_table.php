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
        Schema::table('visit_sessions', function (Blueprint $table) {
            $table->string('visitor_participant_id')->nullable()->after('inmate_joined_at');
        });
    }

    public function down(): void
    {
        Schema::table('visit_sessions', function (Blueprint $table) {
            $table->dropColumn('visitor_participant_id');
        });
    }
};
