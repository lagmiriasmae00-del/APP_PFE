<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// 1. Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2. Protected Routes (خاص الطالب يكون عندو Token)
Route::middleware('auth:sanctum')->group(function () {
    
// كيجيب معلومات الطالب والبروفايل ديالو والشعبة
Route::get('/profile', [AuthController::class, 'userProfile']); 

Route::post('/logout', [AuthController::class, 'logout']);

// هاد الـ Route تقدر تزيدها باش الـ React يعرف واش الطالب مزال مكونيكطي
Route::get('/check-auth', function (Request $request) {
    return response()->json(['authenticated' => true], 200);
});
});