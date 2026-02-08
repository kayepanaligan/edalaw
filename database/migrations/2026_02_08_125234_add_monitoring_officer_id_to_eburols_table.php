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
            $table->foreignId('monitoring_officer_id')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('eburols', function (Blueprint $table) {
            $table->dropForeign(['monitoring_officer_id']);
            $table->dropColumn('monitoring_officer_id');
        });
    }
};
