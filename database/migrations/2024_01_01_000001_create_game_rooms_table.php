<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('code', 5)->unique();
            $table->enum('phase', ['lobby', 'prompts', 'photos', 'voting', 'results'])->default('lobby');
            $table->string('selected_prompt')->nullable();
            $table->string('host_session')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_rooms');
    }
};
