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
        // Rename monitoring_officer_id to jail_officer_id in visits table
        Schema::table('visits', function (Blueprint $table) {
            $table->dropForeign(['monitoring_officer_id']);
            $table->renameColumn('monitoring_officer_id', 'jail_officer_id');
            $table->foreign('jail_officer_id')->references('id')->on('users')->nullOnDelete();
        });

        // Rename monitoring_officer_id to jail_officer_id in eburols table
        Schema::table('eburols', function (Blueprint $table) {
            $table->dropForeign(['monitoring_officer_id']);
            $table->renameColumn('monitoring_officer_id', 'jail_officer_id');
            $table->foreign('jail_officer_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert visits table
        Schema::table('visits', function (Blueprint $table) {
            $table->dropForeign(['jail_officer_id']);
            $table->renameColumn('jail_officer_id', 'monitoring_officer_id');
            $table->foreign('monitoring_officer_id')->references('id')->on('users')->nullOnDelete();
        });

        // Revert eburols table
        Schema::table('eburols', function (Blueprint $table) {
            $table->dropForeign(['jail_officer_id']);
            $table->renameColumn('jail_officer_id', 'monitoring_officer_id');
            $table->foreign('monitoring_officer_id')->references('id')->on('users')->nullOnDelete();
        });
    }
};
