<?php

namespace App\Http\Controllers;

use App\Events\GameStateChanged;
use App\Models\GamePhoto;
use App\Models\GamePlayer;
use App\Models\GameRoom;
use App\Models\GameVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PhotoGameController extends Controller
{
    // ─── Page Entry Points ───────────────────────────────────────────────

    /**
     * The main entry page (/photo-game)
     */
    public function index()
    {
        return Inertia::render('PhotoGame/Index');
    }

    /**
     * The actual game room page (/photo-game/{code})
     */
    public function room(string $code)
    {
        $room = GameRoom::where('code', strtoupper($code))->firstOrFail();
        return Inertia::render('PhotoGame/Room', ['code' => $room->code]);
    }

    // ─── API Actions ─────────────────────────────────────────────────────

    /**
     * Create a new game room (host)
     */
    public function create(Request $request)
    {
        $request->validate(['name' => 'required|string|max:20']);

        $room = GameRoom::create([
            'code' => GameRoom::generateCode(),
            'phase' => 'lobby',
            'host_session' => session()->getId(),
        ]);

        $player = $room->players()->create([
            'session_id' => session()->getId(),
            'name' => $request->name,
            'is_host' => true,
        ]);

        return response()->json([
            'code' => $room->code,
            'player_id' => $player->id,
        ]);
    }

    /**
     * Join an existing game room
     */
    public function join(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:5',
            'name' => 'required|string|max:20',
        ]);

        $room = GameRoom::where('code', strtoupper($request->code))->first();

        if (!$room) {
            return response()->json(['message' => 'Room not found.'], 404);
        }

        if ($room->phase !== 'lobby') {
            return response()->json(['message' => 'Game already in progress.'], 403);
        }

        // Check if session already in room
        $existing = $room->players()->where('session_id', session()->getId())->first();
        if ($existing) {
            return response()->json(['code' => $room->code, 'player_id' => $existing->id]);
        }

        $player = $room->players()->create([
            'session_id' => session()->getId(),
            'name' => $request->name,
            'is_host' => false,
        ]);

        broadcast(new GameStateChanged($room))->toOthers();

        return response()->json([
            'code' => $room->code,
            'player_id' => $player->id,
        ]);
    }

    /**
     * Get current game state (polling fallback + initial load)
     */
    public function state(string $code)
    {
        $room = GameRoom::where('code', strtoupper($code))
            ->with(['players', 'photos.player'])
            ->firstOrFail();

        $sessionId = session()->getId();
        $player = $room->players->firstWhere('session_id', $sessionId);

        return response()->json([
            'phase' => $room->phase,
            'selected_prompt' => $room->selected_prompt,
            'player_id' => $player?->id,
            'is_host' => $player?->is_host ?? false,
            'players' => $room->players->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'is_host' => $p->is_host,
                'prompts_submitted' => $p->prompts_submitted,
                'photo_submitted' => $p->photo_submitted,
                'vote_submitted' => $p->vote_submitted,
            ]),
            'photos' => ($room->phase === 'voting' || $room->phase === 'results')
                ? $room->photos->map(fn($ph) => [
                    'id' => $ph->id,
                    'url' => $ph->url,
                    'votes' => $ph->votes,
                    'player_name' => $room->phase === 'results' ? $ph->player->name : null,
                    'is_mine' => $ph->game_player_id === $player?->id,
                ])
                : [],
        ]);
    }

    /**
     * Host starts the game (moves from lobby → prompts)
     */
    public function start(Request $request, string $code)
    {
        $room = $this->findRoomForHost($code);

        if ($room->players()->count() < 2) {
            return response()->json(['message' => 'Need at least 2 players.'], 422);
        }

        $room->update(['phase' => 'prompts']);
        broadcast(new GameStateChanged($room));

        return response()->json(['ok' => true]);
    }

    /**
     * Submit prompts (2-3 per player)
     */
    public function submitPrompts(Request $request, string $code)
    {
        $request->validate([
            'prompts' => 'required|array|min:2|max:3',
            'prompts.*' => 'required|string|max:200',
        ]);

        $room = GameRoom::where('code', strtoupper($code))->firstOrFail();
        $player = $this->findPlayer($room);

        if ($player->prompts_submitted) {
            return response()->json(['message' => 'Already submitted.'], 422);
        }

        DB::transaction(function () use ($room, $player, $request) {
            foreach ($request->prompts as $text) {
                $room->prompts()->create([
                    'game_player_id' => $player->id,
                    'text' => trim($text),
                ]);
            }
            $player->update(['prompts_submitted' => true]);
        });

        // If everyone submitted, pick a random prompt and move to photos
        $room->refresh();
        if ($room->allPlayersSubmittedPrompts()) {
            $prompt = $room->prompts()->inRandomOrder()->first();
            $room->update([
                'phase' => 'photos',
                'selected_prompt' => $prompt->text,
            ]);
            // Reset photo_submitted flags just in case
            $room->players()->update(['photo_submitted' => false]);
        }

        broadcast(new GameStateChanged($room));

        return response()->json(['ok' => true]);
    }

    /**
     * Submit a photo (base64 data URL)
     */
    public function submitPhoto(Request $request, string $code)
    {
        $request->validate([
            'url' => 'required|string', // base64 data URL
        ]);

        $room = GameRoom::where('code', strtoupper($code))->firstOrFail();
        $player = $this->findPlayer($room);

        if ($player->photo_submitted) {
            return response()->json(['message' => 'Already submitted.'], 422);
        }

        DB::transaction(function () use ($room, $player, $request) {
            $room->photos()->create([
                'game_player_id' => $player->id,
                'url' => $request->url,
            ]);
            $player->update(['photo_submitted' => true]);
        });

        $room->refresh();
        if ($room->allPlayersSubmittedPhotos()) {
            $room->update(['phase' => 'voting']);
        }

        broadcast(new GameStateChanged($room));

        return response()->json(['ok' => true]);
    }

    /**
     * Cast a vote for a photo
     */
    public function vote(Request $request, string $code)
    {
        $request->validate(['photo_id' => 'required|integer']);

        $room = GameRoom::where('code', strtoupper($code))->firstOrFail();
        $player = $this->findPlayer($room);

        if ($player->vote_submitted) {
            return response()->json(['message' => 'Already voted.'], 422);
        }

        $photo = GamePhoto::where('id', $request->photo_id)
            ->where('game_room_id', $room->id)
            ->where('game_player_id', '!=', $player->id) // can't vote for yourself
            ->firstOrFail();

        DB::transaction(function () use ($room, $player, $photo) {
            $room->votes()->create([
                'voter_player_id' => $player->id,
                'game_photo_id' => $photo->id,
            ]);
            $photo->increment('votes');
            $player->update(['vote_submitted' => true]);
        });

        $room->refresh();
        if ($room->allPlayersVoted()) {
            $room->update(['phase' => 'results']);
        }

        broadcast(new GameStateChanged($room));

        return response()->json(['ok' => true]);
    }

    /**
     * Host resets the game back to lobby
     */
    public function reset(string $code)
    {
        $room = $this->findRoomForHost($code);

        DB::transaction(function () use ($room) {
            $room->prompts()->delete();
            $room->votes()->delete();
            $room->photos()->delete();
            $room->players()->update([
                'prompts_submitted' => false,
                'photo_submitted' => false,
                'vote_submitted' => false,
            ]);
            $room->update([
                'phase' => 'lobby',
                'selected_prompt' => null,
            ]);
        });

        broadcast(new GameStateChanged($room));

        return response()->json(['ok' => true]);
    }

    /**
     * Leave the room
     */
    public function leave(string $code)
    {
        $room = GameRoom::where('code', strtoupper($code))->first();
        if (!$room) return response()->json(['ok' => true]);

        $player = $room->players()->where('session_id', session()->getId())->first();
        if ($player) {
            $player->delete();
            $room->refresh();
            if ($room->players()->count() === 0) {
                $room->delete();
            } else {
                broadcast(new GameStateChanged($room));
            }
        }

        return response()->json(['ok' => true]);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────

    private function findRoomForHost(string $code): GameRoom
    {
        $room = GameRoom::where('code', strtoupper($code))->firstOrFail();
        $player = $room->players()->where('session_id', session()->getId())->firstOrFail();
        abort_unless($player->is_host, 403, 'Not host.');
        return $room;
    }

    private function findPlayer(GameRoom $room): GamePlayer
    {
        return $room->players()->where('session_id', session()->getId())->firstOrFail();
    }
}
