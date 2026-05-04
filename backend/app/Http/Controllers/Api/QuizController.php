<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quizze;
use App\Models\Choice;
use App\Models\Result;
use App\Models\UserReponse;

class QuizController extends Controller
{
    public function submit(Request $request, $quizId)
    {
        $user = auth()->user();
        // كنستقبلو الإجابات على شكل [question_id => choice_id]
        $userAnswers = $request->input('answers'); 
        
        $totalQuestions = 0;
        $correctAnswersCount = 0;

        // كنجيبو كاع الأسئلة ديال هاد الـ Quiz باش نتأكدو من الإجابات
        $quiz = Quizze::with('questions.choices')->findOrFail($quizId);

        foreach ($quiz->questions as $question) {
            $totalQuestions++;
            $submittedChoiceId = $userAnswers[$question->id] ?? null;

            if ($submittedChoiceId) {
                // كنسجلو إجابة الطالب في الداتابيز
                UserReponse::create([
                    'user_id' => $user->id,
                    'question_id' => $question->id,
                    'choice_id' => $submittedChoiceId
                ]);

                // كنتأكدو واش الاختيار اللي دار الطالب صحيح
                $isCorrect = Choice::where('id', $submittedChoiceId)
                    ->where('question_id', $question->id)
                    ->where('est_correcte', true)
                    ->exists();

                if ($isCorrect) {
                    $correctAnswersCount++;
                }
            }
        }

        // حساب السكور (مثلا على 100)
        $score = ($totalQuestions > 0) ? ($correctAnswersCount / $totalQuestions) * 100 : 0;
        $passed = $score >= 50; // كينجح إلا جاب 50% أو أكثر

        // تسجيل النتيجة النهائية في جدول results
        $result = Result::updateOrCreate(
            ['user_id' => $user->id, 'quiz_id' => $quizId],
            [
                'score' => $score,
                'passe' => $passed,
                'date_passe' => now()
            ]
        );

        return response()->json([
            'message' => 'Quiz terminé avec succès',
            'score' => $score,
            'status' => $passed ? 'Réussi' : 'Échoué',
            'correct_count' => $correctAnswersCount,
            'total_questions' => $totalQuestions
        ]);
    }
}