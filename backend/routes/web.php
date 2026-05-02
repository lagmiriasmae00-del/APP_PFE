<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuizzeController;

Route::get('/quizze/{id}', [QuizzeController::class, 'show']);