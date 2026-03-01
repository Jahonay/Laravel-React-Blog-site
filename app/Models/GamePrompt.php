<?php
// App\Models\GamePrompt.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class GamePrompt extends Model
{
    protected $fillable = ['game_room_id', 'game_player_id', 'text'];
}
