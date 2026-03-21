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
        Schema::table('chat_flags', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['flagged_by']);
            
            // Make flagged_by nullable
            $table->foreignId('flagged_by')->nullable()->change();
            
            // Re-add the foreign key with null on delete
            $table->foreign('flagged_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chat_flags', function (Blueprint $table) {
            // Revert to non-nullable
            $table->foreignId('flagged_by')->nullable(false)->change();
            $table->dropForeign(['flagged_by']);
            $table->foreign('flagged_by')->references('id')->on('users')->cascadeOnDelete();
        });
    }
};
