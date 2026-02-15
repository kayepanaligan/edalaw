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
            $table->timestamp('visitor_joined_at')->nullable()->after('terms_accepted_at');
            $table->timestamp('inmate_joined_at')->nullable()->after('visitor_joined_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visit_sessions', function (Blueprint $table) {
            $table->dropColumn(['visitor_joined_at', 'inmate_joined_at']);
        });
    }
};
