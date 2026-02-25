<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('posts')->group(function () {
    Route::get('/',           [PostController::class, 'index']);
    Route::get('/featured',   [PostController::class, 'featured']);
    Route::get('/{slug}',     [PostController::class, 'show']);
});

Route::get('/categories', [PostController::class, 'categories']);
