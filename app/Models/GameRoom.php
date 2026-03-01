<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameRoom extends Model
{
    protected $fillable = ['code', 'phase', 'selected_prompt', 'host_session'];

    public function players(): HasMany
    {
        return $this->hasMany(GamePlayer::class);
    }

    public function prompts(): HasMany
    {
        return $this->hasMany(GamePrompt::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(GamePhoto::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(GameVote::class);
    }

    public static function generateCode(): string
    {
        do {
            $code = strtoupper(substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 5));
        } while (self::where('code', $code)->exists());

        return $code;
    }

    public function allPlayersSubmittedPrompts(): bool
    {
        return $this->players()->where('prompts_submitted', false)->doesntExist();
    }

    public function allPlayersSubmittedPhotos(): bool
    {
        return $this->players()->where('photo_submitted', false)->doesntExist();
    }

    public function allPlayersVoted(): bool
    {
        return $this->players()->where('vote_submitted', false)->doesntExist();
    }
}
