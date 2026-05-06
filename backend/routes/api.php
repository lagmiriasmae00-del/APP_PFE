<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\ModuleController;

// 1. Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2. Protected Routes (خاص يكون عندو Token)
Route::middleware('auth:sanctum')->group(function () {
    
    // --- كولشي يقدر يدخل لهادو (Admin + Stagiaire) ---
    Route::get('/profile', [AuthController::class, 'userProfile']); 
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/check-auth', fn() => response()->json(['authenticated' => true]));
    Route::get('/dashboard-stats', [AuthController::class, 'getStats']);

    // --- صلاحيات الطالب (Stagiaire) ---
    Route::middleware('role:stagiaire,admin')->group(function () {
        Route::get('/my-modules', [ModuleController::class, 'index']); 
        Route::get('/module/{id}', [ModuleController::class, 'show']);
        Route::post('/quiz/{id}/submit', [QuizController::class, 'submit']);
        Route::get('/my-results', [QuizController::class, 'myResults']);
    });

    // --- صلاحيات الـ Admin (زيادة وتعديل الداتا) ---
    Route::middleware('role:admin')->group(function () {
        Route::post('/modules', [ModuleController::class, 'store']); // زيادة مادة
        Route::post('/quizzes', [QuizController::class, 'store']);  // زيادة امتحان
        Route::get('/users', [AuthController::class, 'allUsers']); // كيشوف كاع الطلبة
        Route::delete('/users/{id}', [AuthController::class, 'deleteUser']); // يمسح مستخدم
        // تقدر تزيد هنا Delete و Update من بعد
    });
});