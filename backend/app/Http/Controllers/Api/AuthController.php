<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Models\Result;
use App\Models\Module;
use App\Models\Document;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'niveau' => 'required|integer|in:1,2',
            'filiere_id' => 'required|integer|exists:filieres,id',
        ]);

        try {
            

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            

            $user->profile()->create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'role' => 'stagiaire',
                'niveau' => $validated['niveau'],
                'filiere_id' => $validated['filiere_id'],
            ]);

            

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('User registered', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => request()->ip()
            ]);

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user->load('profile')
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration error', [
                'email' => $validated['email'] ?? null,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Registration failed'
            ], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        

        $user = User::where('email', $validated['email'])->first();

        

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            Log::warning('Failed login attempt', [
                'email' => $validated['email'],
                'ip' => request()->ip()
            ]);

            throw ValidationException::withMessages([
                'email' => 'Email ou mot de passe incorrect.',
            ]);
        }

        

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        Log::info('User logged in', [
            'user_id' => $user->id,
            'ip' => request()->ip()
        ]);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('profile.filiere')
        ]);
    }

    public function userProfile(): JsonResponse
    {
        return response()->json(auth()->user()->load('profile.filiere'));
    }

    public function logout(): JsonResponse
    {
        auth()->user()->tokens()->delete();
        
        Log::info('User logged out', [
            'user_id' => auth()->id()
        ]);

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function getStats(): JsonResponse
    {
        $user = auth()->user()->load('profile');

        if ($user->profile && $user->profile->role === 'admin') {
            $stats = [
                'modules_total'     => Module::count(),
                'quizzes_completed' => Result::count(), 
                'exams_total'       => Document::count(),
                'user_name'         => $user->profile->nom . ' ' . $user->profile->prenom
            ];
        } else {
            $stats = [
                'modules_total' => Module::where('filiere_id', $user->profile->filiere_id)
                    ->where('niveau', $user->profile->niveau)
                    ->count(),
                'quizzes_completed' => Result::where('user_id', $user->id)->count(),
                'exams_total' => Document::whereHas('module', function($query) use ($user) {
                    $query->where('filiere_id', $user->profile->filiere_id)
                          ->where('niveau', $user->profile->niveau);
                })->count(),
                'user_name' => $user->profile->nom . ' ' . $user->profile->prenom
            ];
        }

        return response()->json($stats);
    }

    public function allUsers(): JsonResponse
    {
        $users = User::with('profile.filiere')->paginate(20);
        return response()->json($users);
    }

    public function deleteUser(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        

        if (auth()->id() === $id) {
            return response()->json([
                'error' => 'Cannot delete your own account'
            ], 422);
        }

        $email = $user->email;
        $user->delete();

        Log::warning('User deleted', [
            'deleted_user_id' => $id,
            'deleted_email' => $email,
            'admin_id' => auth()->id()
        ]);

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}