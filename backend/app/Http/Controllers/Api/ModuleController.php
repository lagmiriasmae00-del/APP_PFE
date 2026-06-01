<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ModuleController extends Controller
{
    
    public function adminIndex(): JsonResponse
    {
        $modules = Module::with(['filiere', 'quizzes', 'lessons'])->get();
        return response()->json($modules);
    }

    public function index(): JsonResponse
    {
        $user = auth()->user()->load('profile');
        
        $modules = Module::where('filiere_id', $user->profile->filiere_id)
                    ->where('niveau', $user->profile->niveau)
                    ->with(['filiere', 'quizzes', 'lessons'])
                    ->get();

        return response()->json($modules);
    }

    
    public function show(int $id): JsonResponse
    {
        $user = auth()->user();
        
        $isAdmin = ($user->role === 'admin') || ($user->profile && $user->profile->role === 'admin');
        
        $module = Module::with(['filiere', 'quizzes.questions', 'lessons.videos', 'documents.files'])->findOrFail($id);

        if (!$isAdmin) {
            $filiere_id = $user->profile ? $user->profile->filiere_id : null;
            $niveau = $user->profile ? $user->profile->niveau : null;

            if ($module->filiere_id !== $filiere_id || $module->niveau !== $niveau) {
                return response()->json(['error' => 'Access denied'], 403);
            }
        }

        return response()->json($module);
    }

    
    public function store(Request $request): JsonResponse
    {
        

        if ($request->has('nom') && !$request->has('titre')) {
            $request->merge(['titre' => $request->nom]);
        }

        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'niveau' => 'required|integer|in:1,2', 
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

    
    public function update(Request $request, int $id): JsonResponse
    {
        $module = Module::findOrFail($id);

        if ($request->has('nom') && !$request->has('titre')) {
            $request->merge(['titre' => $request->nom]);
        }

        $validated = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'niveau' => 'sometimes|integer|in:1,2', 
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