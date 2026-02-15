<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_exports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_session_id')->constrained()->cascadeOnDelete();
            $table->string('file_path');
            $table->string('format'); // pdf, docx
            $table->foreignId('generated_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['visit_session_id', 'format']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_exports');
    }
};
