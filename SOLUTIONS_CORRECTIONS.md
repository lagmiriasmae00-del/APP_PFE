# SOLUTIONS ET CORRECTIONS DE CODE

---

## 🔧 SOLUTION 1: Ajouter les Routes Manquantes

**Fichier:** `routes/api.php`

Remplacez:
```php
Route::middleware('role:admin')->group(function () {
    Route::post('/modules', [ModuleController::class, 'store']); // زيادة مادة
    Route::post('/quizzes', [QuizController::class, 'store']);  // زيادة امتحان
    Route::get('/users', [AuthController::class, 'allUsers']); // كيشوف كاع الطلبة
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']); // يمسح مستخدم
});
```

Par:
```php
Route::middleware('role:admin')->group(function () {
    // Modules
    Route::post('/modules', [ModuleController::class, 'store']);
    Route::put('/modules/{id}', [ModuleController::class, 'update']);
    Route::delete('/modules/{id}', [ModuleController::class, 'destroy']);
    
    // Quizzes
    Route::post('/quizzes', [QuizController::class, 'store']);
    Route::put('/quizzes/{id}', [QuizController::class, 'update']);
    Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);
    
    // Documents
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
    
    // Lessons
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    
    // Admin User Management
    Route::get('/users', [AuthController::class, 'allUsers']);
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
});
```

---

## 🔧 SOLUTION 2: Ajouter Rate Limiting

**Fichier:** `routes/api.php`

```php
// 1. Public Routes avec Rate Limiting
Route::middleware('throttle:5,1')->post('/register', [AuthController::class, 'register']);
Route::middleware('throttle:5,1')->post('/login', [AuthController::class, 'login']);

// OU configurer en config/cache.php
// À la racine du array 'default', ajouter:
'rate_limit' => [
    'login' => '5,1',      // 5 tentatives par minute
    'register' => '3,1',   // 3 tentatives par minute
    'api' => '60,1',       // 60 requêtes par minute pour l'API
],
```

---

## 🔧 SOLUTION 3: Sécuriser les Uploads de Fichiers

**Fichier:** `app/Http/Controllers/Api/DocumentController.php`

Remplacez la fonction `store()`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DocumentController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validation stricte
        $request->validate([
            'titre' => 'required|string|max:255',
            'type' => 'required|in:cc,regional,efm',
            'file' => 'required|file|mimes:pdf|max:10240', // 10MB max
            'module_id' => 'required|exists:modules,id'
        ]);

        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'Fichier manquant'], 422);
        }

        // 2. Vérifier le MIME type réel
        $file = $request->file('file');
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file->getRealPath());
        finfo_close($finfo);

        if ($mimeType !== 'application/pdf') {
            throw ValidationException::withMessages([
                'file' => 'Le fichier doit être un PDF valide'
            ]);
        }

        // 3. Vérifier la taille réelle
        $fileSize = filesize($file->getRealPath());
        if ($fileSize > 10240 * 1024) { // 10MB
            throw ValidationException::withMessages([
                'file' => 'Le fichier dépasse 10MB'
            ]);
        }

        // 4. Générer un nom sécurisé
        $fileName = Str::uuid() . '.pdf';
        $path = $file->storeAs('documents', $fileName, 'public');

        // 5. Sauvegarder en base
        $document = Document::create([
            'titre' => $request->titre,
            'type' => $request->type,
            'file_url' => $path,
            'module_id' => $request->module_id,
            'file_size' => $fileSize,
            'uploaded_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Document téléchargé avec succès',
            'document' => $document,
            'full_url' => asset('storage/' . $path)
        ], 201);
    }

    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        
        // Vérifier la permission
        if (auth()->user()->profile->role !== 'admin') {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Supprimer le fichier physique
        \Storage::disk('public')->delete($document->file_url);
        
        // Supprimer la base de données
        $document->delete();

        return response()->json(['message' => 'Document supprimé']);
    }
}
```

---

## 🔧 SOLUTION 4: Ajouter Transactions au Quiz Submit

**Fichier:** `app/Http/Controllers/Api/QuizController.php`

Remplacez la fonction `submit()`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quizze;
use App\Models\Choice;
use App\Models\Result;
use App\Models\UserReponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\JsonEncodingException;

class QuizController extends Controller
{
    public function submit(Request $request, $quizId)
    {
        $user = auth()->user();
        $userAnswers = $request->input('answers', []);

        // Validation
        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|integer|exists:choices,id'
        ]);

        try {
            // Utiliser une transaction
            return DB::transaction(function () use ($user, $quizId, $userAnswers) {
                $totalQuestions = 0;
                $correctAnswersCount = 0;

                // Récupérer le quiz
                $quiz = Quizze::with('questions.choices')->findOrFail($quizId);

                // Vérifier que l'utilisateur peut faire ce quiz
                if ($quiz->module->filiere_id !== $user->profile->filiere_id ||
                    $quiz->module->niveau !== $user->profile->niveau) {
                    return response()->json(['error' => 'Accès refusé'], 403);
                }

                // Supprimer les anciennes réponses si re-tentative
                UserReponse::where('user_id', $user->id)
                           ->whereIn('question_id', $quiz->questions->pluck('id'))
                           ->delete();

                // Traiter chaque question
                foreach ($quiz->questions as $question) {
                    $totalQuestions++;
                    $submittedChoiceId = $userAnswers[$question->id] ?? null;

                    if ($submittedChoiceId) {
                        // Vérifier que le choix appartient à cette question
                        $choice = Choice::where('id', $submittedChoiceId)
                                       ->where('question_id', $question->id)
                                       ->firstOrFail();

                        // Enregistrer la réponse
                        UserReponse::create([
                            'user_id' => $user->id,
                            'question_id' => $question->id,
                            'choice_id' => $submittedChoiceId
                        ]);

                        // Vérifier la correction
                        if ($choice->est_correcte) {
                            $correctAnswersCount++;
                        }
                    }
                }

                // Calculer le score
                $score = ($totalQuestions > 0) ? ($correctAnswersCount / $totalQuestions) * 100 : 0;
                $passed = $score >= config('quiz.passing_score', 50);

                // Enregistrer le résultat
                $result = Result::updateOrCreate(
                    ['user_id' => $user->id, 'quiz_id' => $quizId],
                    [
                        'score' => $score,
                        'passe' => $passed,
                        'date_passe' => now(),
                        'correct_answers' => $correctAnswersCount,
                        'total_questions' => $totalQuestions
                    ]
                );

                // Log l'action
                \Log::info('Quiz submitted', [
                    'user_id' => $user->id,
                    'quiz_id' => $quizId,
                    'score' => $score,
                    'ip' => request()->ip()
                ]);

                return response()->json([
                    'message' => 'Quiz complété avec succès',
                    'score' => round($score, 2),
                    'status' => $passed ? 'Réussi' : 'Échoué',
                    'correct_count' => $correctAnswersCount,
                    'total_questions' => $totalQuestions
                ]);
            });
        } catch (\Exception $e) {
            \Log::error('Quiz submission error', [
                'user_id' => $user->id,
                'quiz_id' => $quizId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Une erreur est survenue lors de la soumission du quiz'
            ], 500);
        }
    }

    public function myResults()
    {
        $user = auth()->user();
        
        $results = Result::with([
            'quizze.module',
            'quizze.questions'
        ])
        ->where('user_id', $user->id)
        ->orderBy('date_passe', 'desc')
        ->paginate(15); // Ajouter la pagination

        return response()->json($results);
    }
}
```

---

## 🔧 SOLUTION 5: Créer une Migration pour Supprimer la Duplication

**Fichier:** `database/migrations/2026_05_24_000000_remove_niveau_duplication.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Étape 1: Vérifier que user_profiles.niveau existe
        if (!Schema::hasColumn('user_profiles', 'niveau')) {
            Schema::table('user_profiles', function (Blueprint $table) {
                $table->integer('niveau')->nullable();
            });
        }

        // Étape 2: Copier les données de users.niveau vers user_profiles.niveau
        \DB::statement('
            UPDATE user_profiles up
            JOIN users u ON u.id = up.user_id
            SET up.niveau = u.niveau
            WHERE up.niveau IS NULL
        ');

        // Étape 3: Supprimer la colonne de users
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('niveau');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('niveau')->default(1);
        });
    }
};
```

**Exécuter:**
```bash
php artisan migrate
```

---

## 🔧 SOLUTION 6: Ajouter Soft Deletes

**Fichier:** `database/migrations/2026_05_24_000001_add_soft_deletes.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'modules', 'lessons', 'quizzes', 'questions', 
            'choices', 'documents', 'users', 'user_profiles'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && !Schema::hasColumn($table, 'deleted_at')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->softDeletes();
                });
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'modules', 'lessons', 'quizzes', 'questions',
            'choices', 'documents', 'users', 'user_profiles'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::table($table, function (Blueprint $table) {
                    $table->dropSoftDeletes();
                });
            }
        }
    }
};
```

**Puis mettre à jour les modèles:**

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Module extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    
    // reste du code...
}
```

---

## 🔧 SOLUTION 7: Ajouter Indexes

**Fichier:** `database/migrations/2026_05_24_000002_add_indexes.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Index composé pour les recherches de modules
        Schema::table('modules', function (Blueprint $table) {
            $table->index(['filiere_id', 'niveau']);
        });

        // Index pour les recherches de résultats par utilisateur
        Schema::table('results', function (Blueprint $table) {
            $table->index(['user_id', 'date_passe']);
        });

        // Index pour les réponses par utilisateur
        Schema::table('user_reponses', function (Blueprint $table) {
            $table->index(['user_id', 'question_id']);
        });

        // Index pour documents
        Schema::table('documents', function (Blueprint $table) {
            $table->index(['module_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropIndex(['filiere_id', 'niveau']);
        });

        Schema::table('results', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'date_passe']);
        });

        Schema::table('user_reponses', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'question_id']);
        });

        Schema::table('documents', function (Blueprint $table) {
            $table->dropIndex(['module_id', 'type']);
        });
    }
};
```

---

## 🔧 SOLUTION 8: Mettre à Jour User.php

**Fichier:** `app/Models/User.php`

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relations
    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function reponses()
    {
        return $this->hasMany(UserReponse::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }

    // Accesseur pour le niveau (depuis le profil)
    public function getNiveauAttribute()
    {
        return $this->profile?->niveau;
    }
}
```

---

## 🔧 SOLUTION 9: Config de Quiz

**Fichier:** `config/quiz.php` (créer ce fichier)

```php
<?php

return [
    // Score de passage (en pourcentage)
    'passing_score' => 50,

    // Niveaux valides d'études
    'valid_levels' => [1, 2, 3],

    // Types de documents
    'document_types' => ['cc', 'regional', 'efm'],

    // Limite de fichier
    'max_file_size_mb' => 10,

    // Formats acceptés
    'allowed_file_types' => ['pdf'],

    // Cache TTL pour les stats (en secondes)
    'stats_cache_ttl' => 3600, // 1 heure
];
```

---

## 🔧 SOLUTION 10: Config de Rate Limiting

**Fichier:** `config/cache.php` (ajouter au array)

```php
'rate_limit' => [
    'auth' => '5,1',        // 5 tentatives par minute
    'api' => '60,1',        // 60 requêtes par minute
    'password' => '3,60',   // 3 tentatives par 60 minutes
],
```

---

## 📝 CHECKLIST D'APPLICATION

- [ ] Créer les migrations de correction
- [ ] Exécuter `php artisan migrate`
- [ ] Mettre à jour les fichiers de code
- [ ] Ajouter les fichiers config
- [ ] Tester chaque endpoint
- [ ] Vérifier les logs
- [ ] Faire un test de sécurité
- [ ] Déployer en staging
- [ ] Valider en production

---

**Date:** 24 mai 2026
