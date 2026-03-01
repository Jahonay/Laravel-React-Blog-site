<?php
// App\Models\GamePlayer.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GamePlayer extends Model
{
    protected $fillable = [
        'game_room_id', 'session_id', 'name', 'is_host',
        'prompts_submitted', 'photo_submitted', 'vote_submitted',
    ];

    protected $casts = [
        'is_host' => 'boolean',
        'prompts_submitted' => 'boolean',
        'photo_submitted' => 'boolean',
        'vote_submitted' => 'boolean',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(GameRoom::class, 'game_room_id');
    }

    public function prompts(): HasMany
    {
        return $this->hasMany(GamePrompt::class);
    }

    public function photo(): HasMany
    {
        return $this->hasMany(GamePhoto::class);
    }
}
