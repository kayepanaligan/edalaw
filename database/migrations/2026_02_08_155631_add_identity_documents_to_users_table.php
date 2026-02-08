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
        Schema::table('users', function (Blueprint $table) {
            $table->string('id_document_1_path')->nullable()->after('contact_number');
            $table->string('id_document_2_path')->nullable()->after('id_document_1_path');
            $table->boolean('email_verified_via_otp')->default(false)->after('email_verified_at');
            $table->boolean('phone_verified_via_otp')->default(false)->after('email_verified_via_otp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'id_document_1_path',
                'id_document_2_path',
                'email_verified_via_otp',
                'phone_verified_via_otp',
            ]);
        });
    }
};
