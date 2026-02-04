<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    // GET /api/user/wishlist - List all liked items
    public function index(Request $request)
    {
        $items = Wishlist::with('product')
            ->where('user_id', $request->user()->id)
            ->get();
            
        return response()->json(['data' => $items]);
    }

    // POST /api/user/wishlist/toggle - Add or Remove
    public function toggle(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);
        
        $userId = $request->user()->id;
        $productId = $request->product_id;

        $existing = Wishlist::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['message' => 'Removed from wishlist', 'added' => false]);
        } else {
            Wishlist::create(['user_id' => $userId, 'product_id' => $productId]);
            return response()->json(['message' => 'Added to wishlist', 'added' => true]);
        }
    }
}