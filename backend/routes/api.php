<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\LessonController;
use App\Models\Filiere;


// 1. Public Routes
Route::middleware('throttle:3,1')->post('/register', [AuthController::class, 'register']); // 3 attempts per minute
Route::middleware('throttle:5,1')->post('/login', [AuthController::class, 'login']); // 5 attempts per minute

// 2. Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/files/{id}/download', [DocumentController::class, 'downloadFile']);
    // Common routes (Admin + Stagiaire)
    Route::get('/profile', [AuthController::class, 'userProfile']); 
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/check-auth', fn() => response()->json(['authenticated' => true]));
    Route::get('/dashboard-stats', [AuthController::class, 'getStats']);

    // Stagiaire routes
    Route::middleware('role:stagiaire,admin')->group(function () {
        Route::get('/my-modules', [ModuleController::class, 'index']); 
        Route::get('/module/{id}', [ModuleController::class, 'show']);
        Route::post('/quiz/{id}/submit', [QuizController::class, 'submit']);
        Route::get('/my-results', [QuizController::class, 'myResults']);
    });

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        // Modules CRUD
        Route::post('/modules', [ModuleController::class, 'store']);
        Route::put('/modules/{id}', [ModuleController::class, 'update']);
        Route::delete('/modules/{id}', [ModuleController::class, 'destroy']);
        
        // Quizzes CRUD
        Route::post('/quizzes', [QuizController::class, 'store']);
        Route::put('/quizzes/{id}', [QuizController::class, 'update']);
        Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);
        
        // Documents CRUD
        Route::post('/documents', [DocumentController::class, 'store']);
        Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
        
        // Lessons CRUD
        Route::post('/lessons', [LessonController::class, 'store']);
        Route::put('/lessons/{id}', [LessonController::class, 'update']);
        Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
        
        // User Management
        Route::get('/users', [AuthController::class, 'allUsers']);
        Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
    });
});

// Public Filieres endpoint
Route::get('/filieres', function () {
    return response()->json(Filiere::all());
});