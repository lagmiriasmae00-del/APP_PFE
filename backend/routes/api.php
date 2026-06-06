<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\FiliereController;
use App\Models\Filiere;




Route::middleware('throttle:3,1')->post('/register', [AuthController::class, 'register']); 

Route::middleware('throttle:5,1')->post('/login', [AuthController::class, 'login']); 




Route::middleware('auth:sanctum')->group(function () {
    Route::get('/files/{id}/download', [DocumentController::class, 'downloadFile']);
    
    

    Route::get('/profile', [AuthController::class, 'userProfile']); 
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/check-auth', fn() => response()->json(['authenticated' => true]));
    Route::get('/dashboard-stats', [AuthController::class, 'getStats']);

    

    Route::middleware('role:stagiaire,admin')->group(function () {
        Route::get('/my-modules', [ModuleController::class, 'index']); 
        Route::get('/my-documents', [DocumentController::class, 'studentIndex']); 

        Route::get('/module/{id}', [ModuleController::class, 'show']);
        Route::get('/lessons/{id}', [LessonController::class, 'show']);
        Route::get('/quizzes/{id}', [QuizController::class, 'show']);
        Route::post('/quiz/{id}/submit', [QuizController::class, 'submit']);
        Route::get('/my-results', [QuizController::class, 'myResults']);
    });

    

    Route::middleware('role:admin')->group(function () {
        

        Route::get('/admin/modules', [ModuleController::class, 'adminIndex']); 

        Route::post('/modules', [ModuleController::class, 'store']);
        Route::put('/modules/{id}', [ModuleController::class, 'update']);
        Route::delete('/modules/{id}', [ModuleController::class, 'destroy']);
        
        

        Route::get('/admin/quizzes', [QuizController::class, 'adminIndex']); 

        Route::post('/quizzes', [QuizController::class, 'store']);
        Route::put('/quizzes/{id}', [QuizController::class, 'update']);
        Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);
        
        

        Route::get('/admin/documents', [DocumentController::class, 'index']);
        Route::post('/documents', [DocumentController::class, 'store']);
        Route::put('/documents/{id}', [DocumentController::class, 'update']);
        Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
        
        

        Route::get('/admin/lessons', [LessonController::class, 'adminIndex']); 

        Route::post('/lessons', [LessonController::class, 'store']);
        Route::put('/lessons/{id}', [LessonController::class, 'update']);
        Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
        
        

        Route::get('/users', [AuthController::class, 'allUsers']);
        Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);

        

        Route::get('/admin/filieres', [FiliereController::class, 'index']);
        Route::post('/admin/filieres', [FiliereController::class, 'store']);
        Route::put('/admin/filieres/{id}', [FiliereController::class, 'update']);
        Route::delete('/admin/filieres/{id}', [FiliereController::class, 'destroy']);
    });
});



Route::middleware('throttle:10,1')->get('/filieres', function () {
    return response()->json(App\Models\Filiere::all());
});