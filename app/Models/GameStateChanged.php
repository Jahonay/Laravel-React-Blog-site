<?php

namespace App\Events;

use App\Models\GameRoom;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GameStateChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $payload;

    public function __construct(public GameRoom $room)
    {
        $room->load(['players', 'photos.player']);

        $this->payload = [
            'phase' => $room->phase,
            'selected_prompt' => $room->selected_prompt,
            'players' => $room->players->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'is_host' => $p->is_host,
                'prompts_submitted' => $p->prompts_submitted,
                'photo_submitted' => $p->photo_submitted,
                'vote_submitted' => $p->vote_submitted,
            ]),
            'photos' => $room->phase === 'voting' || $room->phase === 'results'
                ? $room->photos->map(fn($ph) => [
                    'id' => $ph->id,
                    'url' => $ph->url,
                    'votes' => $ph->votes,
                    'player_name' => $room->phase === 'results' ? $ph->player->name : null,
                ])
                : [],
        ];
    }

    public function broadcastOn(): array
    {
        return [new Channel('game-room.' . $this->room->code)];
    }

    public function broadcastAs(): string
    {
        return 'state.changed';
    }
}
