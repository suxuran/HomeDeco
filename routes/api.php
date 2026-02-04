<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TestimonyController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PricingController;
use App\Http\Controllers\Api\UserDashboardController;
use App\Http\Controllers\Api\ContentBlockController; // <--- Import Added

/*
|--------------------------------------------------------------------------
| Public Routes (No Login Required)
|--------------------------------------------------------------------------
*/
// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Content Blocks (About Page, etc.)
Route::get('/content/{key}', [ContentBlockController::class, 'show']); // <--- Route Added

// Pricing Plans
Route::get('/pricing-plans', [PricingController::class, 'index']);

// Testimonies & Contact
Route::get('/testimonies', [TestimonyController::class, 'getPublicTestimonies']);
Route::post('/contact', [ContactController::class, 'store']);

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Login Required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // User Info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    // User Dashboard Stats
    Route::get('/user/stats', [UserDashboardController::class, 'stats']);

    // Orders
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::get('/user/orders', [OrderController::class, 'index']);

    // Wishlist
    Route::get('/user/wishlist', [WishlistController::class, 'index']);
    Route::post('/user/wishlist/toggle', [WishlistController::class, 'toggle']);

    // Testimonies (User Management)
    Route::get('/user/testimonies', [TestimonyController::class, 'index']);
    Route::post('/user/testimonies', [TestimonyController::class, 'store']);
    Route::delete('/user/testimonies/{id}', [TestimonyController::class, 'destroy']);

    // Admin Stats
    Route::get('/admin/stats', [AdminController::class, 'stats']);
    
});