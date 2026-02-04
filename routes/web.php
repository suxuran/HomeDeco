<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. Fix the "Route [filament.admin.auth.login] not defined" error.
// We redirect to the URL string directly. It is safer.
Route::get('/login', function () {
    return redirect('/admin/login');
})->name('login');


// 2. The React "Catch-All" Route (Must be last!)
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!admin|api|up).*$');