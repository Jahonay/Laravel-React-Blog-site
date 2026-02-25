<?php

use Illuminate\Support\Facades\Route;

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
