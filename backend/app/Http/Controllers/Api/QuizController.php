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
        // On reçoit les réponses sous la forme [question_id => choice_id]
        $userAnswers = $request->input('answers'); 
        
        $totalQuestions = 0;
        $correctAnswersCount = 0;

        // On récupère toutes les questions de ce Quiz pour vérifier les réponses
        $quiz = Quizze::with('questions.choices')->findOrFail($quizId);

        foreach ($quiz->questions as $question) {
            $totalQuestions++;
            $submittedChoiceId = $userAnswers[$question->id] ?? null;

            if ($submittedChoiceId) {
                // On enregistre la réponse de l'étudiant dans la base de données
                UserReponse::create([
                    'user_id' => $user->id,
                    'question_id' => $question->id,
                    'choice_id' => $submittedChoiceId
                ]);

                // On vérifie si le choix fait par l'étudiant est correct
                $isCorrect = Choice::where('id', $submittedChoiceId)
                    ->where('question_id', $question->id)
                    ->where('est_correcte', true)
                    ->exists();

                if ($isCorrect) {
                    $correctAnswersCount++;
                }
            }
        }

        // Calcul du score (ex: sur 100)
        $score = ($totalQuestions > 0) ? ($correctAnswersCount / $totalQuestions) * 100 : 0;
        $passed = $score >= 50; // Réussi s'il obtient 50% ou plus

        // Enregistrement du résultat final dans la table results
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
    public function myResults()
    {
        $user = auth()->user();
        
        // On récupère tous les résultats de l'étudiant avec les informations du Quiz et de son module
        $results = Result::with('quizze.module')
            ->where('user_id', $user->id)
            ->orderBy('date_passe', 'desc')
            ->get();

        return response()->json($results);
    }
}