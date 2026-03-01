<?php
// App\Models\GameVote.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class GameVote extends Model
{
    protected $fillable = ['game_room_id', 'voter_player_id', 'game_photo_id'];
}
