<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ModuleController extends Controller
{
    /**
     * Get modules (Admin sees all, Stagiaire sees only theirs)
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        
        // إذا كان أدمين، كيشوف الموديلات كاملين
        if ($user->profile && $user->profile->role === 'admin') {
            $modules = Module::with(['filiere', 'quizzes', 'lessons'])->get();
            return response()->json($modules);
        }
        
        // للطالب: تصفية حسب الشعبة والمستوى
        $modules = Module::where('filiere_id', $user->profile->filiere_id)
                    ->where('niveau', $user->profile->niveau)
                    ->with(['filiere', 'quizzes', 'lessons'])
                    ->get();

        return response()->json($modules);
    }

    /**
     * Get module details (Admin sees all, Stagiaire filtered)
     */
    public function show(int $id): JsonResponse
    {
        $user = auth()->user();

        // إذا كان أدمين، كيشوف الموديل بلا شروط التصفية
        if ($user->profile && $user->profile->role === 'admin') {
            $module = Module::with([
                'lessons.videos',
                'quizzes.questions.choices',
                'documents.files'
            ])->findOrFail($id);
            
            return response()->json($module);
        }

        // للطالب: كنجيبو الموديل بشرط يكون ديالو
        $module = Module::with([
            'lessons.videos',
            'quizzes.questions.choices',
            'documents.files'
        ])
        ->where('filiere_id', $user->profile->filiere_id)
        ->where('niveau', $user->profile->niveau)
        ->findOrFail($id);

        return response()->json($module);
    }

    /**
     * Create a new module (admin only)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'niveau' => 'required|integer|in:1,2', // تعويض مباشر
            'filiere_id' => 'required|integer|exists:filieres,id',
            'description' => 'nullable|string'
        ]);

        $module = Module::create($validated);

        Log::info('Module created', [
            'module_id' => $module->id,
            'admin_id' => auth()->id()
        ]);

        return response()->json([
            'message' => 'Module created successfully',
            'module' => $module
        ], 201);
    }

    /**
     * Update a module (admin only)
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $module = Module::findOrFail($id);

        $validated = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'niveau' => 'sometimes|integer|in:1,2', // تعويض مباشر
            'filiere_id' => 'sometimes|integer|exists:filieres,id',
            'description' => 'sometimes|nullable|string'
        ]);

        $module->update($validated);

        Log::info('Module updated', [
            'module_id' => $id,
            'admin_id' => auth()->id()
        ]);

        return response()->json([
            'message' => 'Module updated successfully',
            'module' => $module
        ]);
    }

    /**
     * Delete a module (admin only)
     */
    public function destroy(int $id): JsonResponse
    {
        $module = Module::findOrFail($id);
        $module->delete();

        Log::info('Module deleted', [
            'module_id' => $id,
            'admin_id' => auth()->id()
        ]);

        return response()->json(['message' => 'Module deleted successfully']);
    }
}