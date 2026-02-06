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
        Schema::create('eburols', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('inmate_first_name');
            $table->string('inmate_middle_name')->nullable();
            $table->string('inmate_last_name');
            $table->string('deceased_first_name');
            $table->string('deceased_middle_name')->nullable();
            $table->string('deceased_last_name');
            $table->date('deceased_date_of_death');
            $table->string('relationship_to_inmate');
            $table->date('wake_start_date');
            $table->date('wake_end_date');
            $table->time('preferred_time')->nullable();
            $table->text('wake_location');
            $table->text('additional_details')->nullable();
            $table->string('death_certificate_path')->nullable();
            $table->string('relationship_proof_path')->nullable();
            $table->string('status')->default('pending');
            $table->text('admin_notes')->nullable();
            $table->index(['user_id', 'status']);
            $table->index(['wake_start_date', 'wake_end_date']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eburols');
    }
};
