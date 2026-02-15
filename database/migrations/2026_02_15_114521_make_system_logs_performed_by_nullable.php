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
        Schema::table('system_logs', function (Blueprint $table) {
            $table->dropForeign(['performed_by']);
            $table->unsignedBigInteger('performed_by')->nullable()->change();
            $table->foreign('performed_by')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('system_logs', function (Blueprint $table) {
            $table->dropForeign(['performed_by']);
            $table->unsignedBigInteger('performed_by')->nullable(false)->change();
            $table->foreign('performed_by')->references('id')->on('users')->cascadeOnDelete();
        });
    }
};
