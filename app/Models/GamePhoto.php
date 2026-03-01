<?php
// App\Models\GamePhoto.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GamePhoto extends Model
{
    protected $fillable = ['game_room_id', 'game_player_id', 'url', 'votes'];

    public function player(): BelongsTo
    {
        return $this->belongsTo(GamePlayer::class, 'game_player_id');
    }
}
