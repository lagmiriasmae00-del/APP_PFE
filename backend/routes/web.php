<?php

use App\Http\Controllers\Api\QuizController;

Route::get('/quizze/{id}', [QuizController::class, 'show']);