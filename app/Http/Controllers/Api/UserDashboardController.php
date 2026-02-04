<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Testimony;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserDashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'orders_count' => Order::where('user_id', $user->id)->count(),
            'testimonies_count' => Testimony::where('user_id', $user->id)->count(),
            'wishlist_count' => Wishlist::where('user_id', $user->id)->count(),
        ]);
    }
}