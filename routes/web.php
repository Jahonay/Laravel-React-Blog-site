<?php

use Illuminate\Support\Facades\Route;
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

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| All routes are handed to the React SPA. Laravel handles API routes
| separately via routes/api.php.
*/

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
