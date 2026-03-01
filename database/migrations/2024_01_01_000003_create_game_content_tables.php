<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_prompts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_player_id')->constrained()->cascadeOnDelete();
            $table->string('text');
            $table->timestamps();
        });

        Schema::create('game_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_player_id')->constrained()->cascadeOnDelete();
            $table->string('url'); // base64 data URL or stored path
            $table->integer('votes')->default(0);
            $table->timestamps();
        });

        Schema::create('game_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('voter_player_id')->constrained('game_players')->cascadeOnDelete();
            $table->foreignId('game_photo_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['game_room_id', 'voter_player_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_votes');
        Schema::dropIfExists('game_photos');
        Schema::dropIfExists('game_prompts');
    }
};
