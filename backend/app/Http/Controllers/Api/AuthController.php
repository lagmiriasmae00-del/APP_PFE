<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request) {
        // 1. Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'filiere_id' => 'required|exists:filieres,id',
        ]);

        // 2. Create User
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 3. Create UserProfile (العلاقة خاص تكون profile() فـ موديل User)
        $user->profile()->create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'role' => 'stagiaire',
            'filiere_id' => $request->filiere_id,
        ]);

        // 4. Generate Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('profile')
        ]);
    }

    public function login(Request $request) {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('profile.filiere')
        ]);
    }

    public function userProfile() {
        return response()->json(auth()->user()->load('profile.filiere'));
    }

    public function logout() {
        // كيمسح كاع الـ tokens ديال هاد الـ user
        auth()->user()->tokens()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}