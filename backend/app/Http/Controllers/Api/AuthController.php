<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Result;
use App\Models\Module;
use App\Models\Document;
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
            'niveau' => 'required|integer',
            'filiere_id' => 'required|exists:filieres,id',
        ]);

        // 2. Create User
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'niveau'   => $request->niveau, // Indispensable car présent dans la table users et ne peut pas être vide
        ]);

        // 3. Create UserProfile (La relation doit être profile() dans le modèle User)
        $user->profile()->create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'role' => 'stagiaire',
            'niveau' => $request->niveau,
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
        // Supprime tous les tokens de cet utilisateur
        auth()->user()->tokens()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
    public function getStats() {
    $user = auth()->user();
    
    // عدد الموديلات الخاصة بشعبة ومستوى الطالب
    $modulesCount = Module::where('filiere_id', $user->profile->filiere_id)
        ->where('niveau', $user->profile->niveau)
        ->count();

    // عدد الكويزات اللي دوزها الطالب بصح
    $completedQuizzes = Result::where('user_id', $user->id)->count();

    // عدد الامتحانات (الوثائق) المتوفرة لهاد الطالب
    $examsCount = Document::whereHas('module', function($query) use ($user) {
        $query->where('filiere_id', $user->profile->filiere_id)
              ->where('niveau', $user->profile->niveau);
    })->count();

    return response()->json([
        'modules_total' => $modulesCount,
        'quizzes_completed' => $completedQuizzes,
        'exams_total' => $examsCount,
        'user_name' => $user->profile->nom . ' ' . $user->profile->prenom
    ]);
}
}