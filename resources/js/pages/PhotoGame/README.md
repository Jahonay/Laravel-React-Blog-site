# SnapJudge — Photo Game Integration Guide

## Overview
A Jackbox-style party photo game. Players join via a 5-digit code, submit prompts, photograph a randomly chosen prompt, vote for their favorite photo, and see the winner.

---

## File Placement

### Backend (Laravel)

| Generated File | Place At |
|---|---|
| `migrations/2024_01_01_000001_create_game_rooms_table.php` | `database/migrations/` |
| `migrations/2024_01_01_000002_create_game_players_table.php` | `database/migrations/` |
| `migrations/2024_01_01_000003_create_game_content_tables.php` | `database/migrations/` |
| `models/GameRoom.php` | `app/Models/GameRoom.php` |
| `models/GamePlayer.php` | `app/Models/GamePlayer.php` |
| `models/GamePrompt.php` | `app/Models/GamePrompt.php` |
| `models/GamePhoto.php` | `app/Models/GamePhoto.php` |
| `models/GameVote.php` | `app/Models/GameVote.php` |
| `controllers/PhotoGameController.php` | `app/Http/Controllers/PhotoGameController.php` |
| `events/GameStateChanged.php` | `app/Events/GameStateChanged.php` |

### Frontend (React/Inertia)

| Generated File | Place At |
|---|---|
| `react/pages/Index.jsx` | `resources/js/Pages/PhotoGame/Index.jsx` |
| `react/pages/Room.jsx` | `resources/js/Pages/PhotoGame/Room.jsx` |
| `react/components/shared.js` | `resources/js/Pages/PhotoGame/shared.js` |
| `react/pages/PhotoGame/LobbyPhase.jsx` | `resources/js/Pages/PhotoGame/LobbyPhase.jsx` |
| `react/pages/PhotoGame/PromptsPhase.jsx` | `resources/js/Pages/PhotoGame/PromptsPhase.jsx` |
| `react/pages/PhotoGame/PhotosPhase.jsx` | `resources/js/Pages/PhotoGame/PhotosPhase.jsx` |
| `react/pages/PhotoGame/VotingPhase.jsx` | `resources/js/Pages/PhotoGame/VotingPhase.jsx` |
| `react/pages/PhotoGame/ResultsPhase.jsx` | `resources/js/Pages/PhotoGame/ResultsPhase.jsx` |

---

## routes/web.php

Add this near the bottom of your routes file:

```php
use App\Http\Controllers\PhotoGameController;

Route::prefix('photo-game')->name('photo-game.')->group(function () {
    // Pages (Inertia)
    Route::get('/', [PhotoGameController::class, 'index'])->name('index');
    Route::get('/{code}', [PhotoGameController::class, 'room'])->name('room');

    // API actions
    Route::post('/api/create', [PhotoGameController::class, 'create'])->name('create');
    Route::post('/api/join', [PhotoGameController::class, 'join'])->name('join');
    Route::get('/api/{code}/state', [PhotoGameController::class, 'state'])->name('state');
    Route::post('/api/{code}/start', [PhotoGameController::class, 'start'])->name('start');
    Route::post('/api/{code}/prompts', [PhotoGameController::class, 'submitPrompts'])->name('prompts');
    Route::post('/api/{code}/photo', [PhotoGameController::class, 'submitPhoto'])->name('photo');
    Route::post('/api/{code}/vote', [PhotoGameController::class, 'vote'])->name('vote');
    Route::post('/api/{code}/reset', [PhotoGameController::class, 'reset'])->name('reset');
    Route::post('/api/{code}/leave', [PhotoGameController::class, 'leave'])->name('leave');
});
```

---

## Run Migrations

```bash
php artisan migrate
```

---

## Session Driver

The game uses Laravel sessions to identify players (no auth required). Make sure your session driver is `database`, `file`, or `redis` (not `cookie`-only) so session IDs persist correctly:

```env
SESSION_DRIVER=database
```

And if using database sessions:
```bash
php artisan session:table
php artisan migrate
```

---

## Real-Time (Optional but recommended)

The game **works via polling** (every 2 seconds) out of the box. For real-time updates, set up Laravel Broadcasting with Pusher or Reverb:

```env
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=mt1
```

And in your frontend bootstrap (resources/js/bootstrap.js), make sure Laravel Echo is configured with the matching Pusher credentials. The Room.jsx component will automatically use it if `window.Echo` is available.

---

## Photo Storage Note

Photos are stored as **base64 data URLs in the database** — simple to set up, no disk config needed. For production with many players, consider switching to proper file storage: accept uploads via `multipart/form-data` in `submitPhoto`, store with `Storage::put()`, and save the public URL instead.

---

## Game Flow Summary

```
/photo-game          ← Entry page (host or join)
  ↓
/photo-game/{CODE}   ← Room page (all game phases render here)

Phases: lobby → prompts → photos → voting → results → (loop back to lobby)
```

- **Lobby**: Host waits for players, starts when ready (min 2)
- **Prompts**: All players submit 2–3 prompts; transitions auto when all done
- **Photos**: Random prompt revealed; players upload/take a photo; auto-transitions
- **Voting**: Players vote (can't vote for own photo); auto-transitions
- **Results**: Winner displayed; host can restart or everyone can leave
