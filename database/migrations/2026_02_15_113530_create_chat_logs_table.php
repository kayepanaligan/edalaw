<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_session_id')->constrained()->cascadeOnDelete();
            $table->string('sender'); // visitor, inmate, monitor
            $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('message');
            $table->timestamp('sent_at');
            $table->boolean('flagged')->default(false);
            $table->text('flag_reason')->nullable();
            $table->foreignId('flagged_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('flagged_at')->nullable();
            $table->timestamps();

            $table->index(['visit_session_id', 'sent_at']);
            $table->index(['visit_session_id', 'flagged']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_logs');
    }
};
