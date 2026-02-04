<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimony;
use Illuminate\Http\Request;

class TestimonyController extends Controller
{
    // GET /api/user/testimonies (Private: User's own history)
    public function index(Request $request)
    {
        $testimonies = Testimony::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $testimonies]);
    }

    // POST /api/user/testimonies (Private: Submit new)
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|min:10',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $testimony = Testimony::create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
            'rating' => $request->rating,
            'is_approved' => false, // Pending approval
        ]);

        return response()->json([
            'message' => 'Testimony submitted successfully',
            'data' => $testimony
        ], 201);
    }

    // DELETE /api/user/testimonies/{id} (Private: Delete own)
    public function destroy(Request $request, $id)
    {
        $testimony = Testimony::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $testimony->delete();

        return response()->json(['message' => 'Testimony deleted']);
    }

    // NEW: GET /api/testimonies (Public: Show approved reviews on Homepage)
    public function getPublicTestimonies()
    {
        $testimonies = Testimony::with('user:id,name') // Fetch user name
            ->where('is_approved', true)           // Only approved ones
            ->orderBy('created_at', 'desc')
            ->take(3)                              // Limit to 3 latest
            ->get();

        return response()->json(['data' => $testimonies]);
    }
}