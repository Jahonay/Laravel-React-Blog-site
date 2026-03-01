<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_room_id')->constrained()->cascadeOnDelete();
            $table->string('session_id');
            $table->string('name');
            $table->boolean('is_host')->default(false);
            $table->boolean('prompts_submitted')->default(false);
            $table->boolean('photo_submitted')->default(false);
            $table->boolean('vote_submitted')->default(false);
            $table->timestamps();

            $table->unique(['game_room_id', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_players');
    }
};
