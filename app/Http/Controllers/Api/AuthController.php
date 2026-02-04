<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        // Auto login after register
        Auth::login($user); 
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registered successfully',
            'user' => $user,
            'token' => $token,
            'redirect_url' => '/'
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt standard Web Login (Creates Session Cookie for Admin Panel)
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            
            // Create API Token (For React Frontend)
            $token = $user->createToken('auth_token')->plainTextToken;

            // Determine Redirect URL
            $redirectUrl = ($user->role === 'admin') ? '/admin' : '/';

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
                'redirect_url' => $redirectUrl // Send this to Frontend
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['Invalid credentials provided.'],
        ]);
    }

    public function logout(Request $request)
    {
        // Logout Web Session
        Auth::guard('web')->logout();
        
        // Delete API Token
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $request->validate(['name' => 'required', 'email' => 'required|email']);
        $user->update($request->only('name', 'email'));
        return response()->json(['message' => 'Profile updated', 'user' => $user]);
    }
}