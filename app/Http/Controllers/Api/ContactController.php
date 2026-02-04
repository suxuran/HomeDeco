<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string|min:10',
            // Subject and phone are optional in validation if not strict, 
            // but ensure your Model has them in $fillable if you save them.
        ]);

        // We use all() to capture name, email, subject, message, phone
        ContactMessage::create($request->all());

        return response()->json(['message' => 'Message sent successfully!']);
    }
}