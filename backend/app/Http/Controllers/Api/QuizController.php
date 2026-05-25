<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Quizze;
use App\Models\Choice;
use App\Models\Result;
use App\Models\UserReponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class QuizController extends Controller
{
    public function submit(Request $request, int $quizId): JsonResponse
    {
        $user = auth()->user();
        
        // Validate input
        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|integer|exists:choices,id'
        ]);

        try {
            // Use transaction for data integrity
            return DB::transaction(function () use ($user, $quizId, $validated) {
                $totalQuestions = 0;
                $correctAnswersCount = 0;

                // Fetch quiz with relations
                $quiz = Quizze::with('questions.choices', 'module')
                    ->findOrFail($quizId);

                // Verify user has access to this quiz
                if ($quiz->module->filiere_id !== $user->profile->filiere_id ||
                    $quiz->module->niveau !== $user->profile->niveau) {
                    Log::warning('Unauthorized quiz access attempt', [
                        'user_id' => $user->id,
                        'quiz_id' => $quizId,
                    ]);
                    return response()->json(['error' => 'Access denied'], 403);
                }

                // Delete old answers if retaking quiz
                UserReponse::where('user_id', $user->id)
                           ->whereIn('question_id', $quiz->questions->pluck('id'))
                           ->delete();

                // Process each question
                foreach ($quiz->questions as $question) {
                    $totalQuestions++;
                    $submittedChoiceId = $validated['answers'][$question->id] ?? null;

                    if ($submittedChoiceId) {
                        // Verify choice belongs to this question
                        $choice = Choice::where('id', $submittedChoiceId)
                                       ->where('question_id', $question->id)
                                       ->firstOrFail();

                        // Record answer
                        UserReponse::create([
                            'user_id' => $user->id,
                            'question_id' => $question->id,
                            'choice_id' => $submittedChoiceId
                        ]);

                        // Check if correct
                        if ($choice->est_correcte) {
                            $correctAnswersCount++;
                        }
                    }
                }

                // Calculate score
                $passingScore = config('quiz.passing_score', 50);
                $score = ($totalQuestions > 0) ? ($correctAnswersCount / $totalQuestions) * 100 : 0;
                $passed = $score >= $passingScore;

                // Record result
                $result = Result::updateOrCreate(
                    ['user_id' => $user->id, 'quiz_id' => $quizId],
                    [
                        'score' => round($score, 2),
                        'passe' => $passed,
                        'date_passe' => now(),
                        'correct_answers' => $correctAnswersCount,
                        'total_questions' => $totalQuestions
                    ]
                );

                Log::info('Quiz submitted', [
                    'user_id' => $user->id,
                    'quiz_id' => $quizId,
                    'score' => $score,
                    'passed' => $passed,
                    'ip' => request()->ip()
                ]);

                return response()->json([
                    'message' => 'Quiz completed successfully',
                    'score' => round($score, 2),
                    'status' => $passed ? 'Passed' : 'Failed',
                    'correct_count' => $correctAnswersCount,
                    'total_questions' => $totalQuestions,
                    'passing_score' => $passingScore
                ]);
            });
        } catch (\Throwable $e) {
            Log::error('Quiz submission error', [
                'user_id' => $user->id,
                'quiz_id' => $quizId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'An error occurred while submitting the quiz'
            ], 500);
        }
    }

    public function myResults(): JsonResponse
    {
        $user = auth()->user();
        
        $results = Result::with(['quizze.module', 'quizze.questions'])
            ->where('user_id', $user->id)
            ->orderBy('date_passe', 'desc')
            ->paginate(15);

        return response()->json($results);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'module_id' => 'required|integer|exists:modules,id',
            'description' => 'nullable|string'
        ]);

        $quiz = Quizze::create($validated);

        Log::info('Quiz created', [
            'quiz_id' => $quiz->id,
            'admin_id' => auth()->id()
        ]);

        return response()->json($quiz, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $quiz = Quizze::findOrFail($id);

        $validated = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string'
        ]);

        $quiz->update($validated);

        Log::info('Quiz updated', [
            'quiz_id' => $id,
            'admin_id' => auth()->id()
        ]);

        return response()->json($quiz);
    }

    public function destroy(int $id): JsonResponse
    {
        $quiz = Quizze::findOrFail($id);
        $quiz->delete();

        Log::info('Quiz deleted', [
            'quiz_id' => $id,
            'admin_id' => auth()->id()
        ]);

        return response()->json(['message' => 'Quiz deleted successfully']);
    }
}
