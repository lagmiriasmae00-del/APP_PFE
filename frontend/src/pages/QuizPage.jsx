import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Quiz.css';
import { Trophy, XCircle } from 'lucide-react';

// القراءة من URL عبر /quiz/:id
const QuizPage = () => {
    const { id: quizId } = useParams(); // ← يقرأ الـ ID من الـ URL
    const [quiz, setQuiz] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    // جلب بيانات الكويز
    useEffect(() => {
        api.get(`/quizzes/${quizId}`)
            .then(res => setQuiz(res.data))
            .catch(err => console.error("Erreur lors du chargement:", err));
    }, [quizId]);

    if (!quiz) return <div className="text-center p-20 font-bold text-gray-500">Chargement du quiz...</div>;

    if (!quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="text-center p-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ce quiz ne contient aucune question pour le moment.</h2>
                <button 
                    onClick={() => window.history.back()}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
                >
                    Retour
                </button>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentIndex];
    const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

    const handleChoiceSelect = (choiceId) => {
        setUserAnswers({ ...userAnswers, [currentQuestion.id]: choiceId });
    };

    const handleNext = () => {
        if (currentIndex < quiz.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = () => {
        setIsSubmitting(true);
        setSubmitError(null);
        // ✅ الـ route الصحيح هو /quiz/:id/submit (بالمفرد)
        api.post(`/quiz/${quizId}/submit`, { answers: userAnswers })
            .then(res => setResults(res.data))
            .catch(err => {
                console.error("Erreur lors de l'envoi:", err);
                const msg = err.response?.data?.error || 'Une erreur est survenue. Veuillez réessayer.';
                setSubmitError(msg);
            })
            .finally(() => setIsSubmitting(false));
    };

    // واجهة النتائج
    if (results) {
        return (
            <div className="flex justify-center p-6">
                <div className="result-card bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-gray-100">
                    <div className="flex justify-center mb-4">
                        {results.score >= 50
                            ? <Trophy className="w-16 h-16 text-yellow-400" strokeWidth={1.5} />
                            : <XCircle className="w-16 h-16 text-red-400" strokeWidth={1.5} />}
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 mb-2">{results.status}</h2>
                    <p className="text-gray-500 mb-6 font-medium text-lg">Votre score: <span className="text-indigo-600 font-bold">{results.score}%</span></p>
                    <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                        <p className="text-sm text-gray-600">Réponses correctes: {results.correct_count} / {results.total_questions}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition"
                    >
                        Réessayer le Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-10 flex justify-center">
            <div className="quiz-container w-full bg-white rounded-3xl shadow-xl p-6 md:p-10 flex flex-col">

                {/* Progress Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Question {currentIndex + 1} sur {quiz.questions.length}</span>
                        <span className="text-gray-400 text-sm font-medium">{Math.round(progress)}% complété</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div className="progress-bar-fill h-full bg-indigo-600" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="flex-grow">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-snug">
                        {currentQuestion.question}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQuestion.choices.map((choice) => (
                            <div
                                key={choice.id}
                                onClick={() => handleChoiceSelect(choice.id)}
                                className={`choice-item p-5 rounded-2xl cursor-pointer flex items-center gap-4 ${userAnswers[currentQuestion.id] === choice.id ? 'selected' : 'bg-white'}`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${userAnswers[currentQuestion.id] === choice.id ? 'border-white' : 'border-gray-300'}`}>
                                    {userAnswers[currentQuestion.id] === choice.id && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                </div>
                                <span className="text-lg font-semibold">{choice.text_choix}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-end gap-3">
                    {submitError && (
                        <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
                            ❌ {submitError}
                        </div>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={!userAnswers[currentQuestion.id] || isSubmitting}
                        className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                        {isSubmitting ? '⏳ Envoi en cours...' : (currentIndex === quiz.questions.length - 1 ? 'Terminer le Quiz ✓' : 'Suivant →')}
                    </button>
                </div>
            </div>
        </div>
        
    );
};

export default QuizPage;