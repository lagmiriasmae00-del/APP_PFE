import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RefreshCcw, Home } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saveExamScore } = useAppContext();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await api.getQuizById(id);
        setQuestions(quizData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleVerify = () => {
    const correct = questions[currentQuestion].answer === selectedOption;
    if (correct) setScore(prev => prev + 1);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      // score state might be stale if verify was just clicked, but the user clicks Verify, THEN Next.
      // So score is already updated.
      const finalScore = score;
      const pct = Math.round((finalScore / questions.length) * 100);
      saveExamScore(id, pct);
    }
  };

  const restartQuiz = () => {
     setCurrentQuestion(0);
     setScore(0);
     setShowResult(false);
     setSelectedOption(null);
     setIsAnswered(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!questions.length) return <div>Quiz introuvable</div>;

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 font-inter">
        <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="bg-white rounded-[2.5rem] p-12 shadow-2xl max-w-lg w-full text-center border border-slate-100"
        >
           <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-8 border-4 ${passed ? 'bg-success/10 text-success border-success/20' : 'bg-red-50 text-danger border-red-100'}`}>
              {passed ? <Trophy size={48} /> : <XCircle size={48} />}
           </div>
           
           <h2 className="text-4xl font-outfit font-bold text-slate-800 mb-2">
             {passed ? 'Félicitations !' : 'Oups, réessayez !'}
           </h2>
           <p className="text-slate-500 text-lg mb-8 font-semibold">
             Vous avez obtenu {score} / {questions.length} ({pct}%)
           </p>

           <div className="space-y-4 flex flex-col items-center">
              <Button onClick={restartQuiz} className="w-full !py-4 flex gap-2">
                <RefreshCcw size={20} /> Recommencer le quiz
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dashboard')} className="w-full !py-4 flex gap-2">
                <Home size={20} /> Retour à l'accueil
              </Button>
           </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between gap-4">
         <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><ArrowLeft size={24} /></button>
         <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
             <motion.div 
               animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
               className="h-full bg-success rounded-full" 
             />
         </div>
         <span className="text-sm font-bold text-slate-400">{currentQuestion + 1} sur {questions.length}</span>
      </div>

      <div className="space-y-8">
         <h1 className="text-3xl font-outfit font-bold text-slate-800 leading-tight">
           {q.question}
         </h1>

         <div className="grid gap-4">
            {q.options.map((option, index) => {
               const isSelected = selectedOption === index;
               const isCorrect = q.answer === index;
               
               let style = "bg-white border-slate-200 text-slate-700 shadow-3d-gray hover:bg-slate-50";
               if (isSelected && !isAnswered) style = "bg-primary-50 border-primary-300 text-primary-700 shadow-3d-info scale-[1.02]";
               if (isAnswered) {
                  if (isCorrect) style = "bg-success text-white border-success shadow-3d-success scale-[1.02]";
                  else if (isSelected) style = "bg-danger text-white border-danger shadow-3d-danger scale-[1.02]";
                  else style = "bg-white border-slate-100 text-slate-300 shadow-none opacity-50";
               }

               return (
                 <button 
                   key={index}
                   onClick={() => handleOptionSelect(index)}
                   className={`p-6 rounded-2xl border-2 text-left font-bold text-xl transition-all active:translate-y-1 active:shadow-none flex items-center justify-between ${style}`}
                 >
                    {option}
                    {isAnswered && isCorrect && <CheckCircle2 size={24} />}
                    {isAnswered && !isCorrect && isSelected && <XCircle size={24} />}
                 </button>
               )
            })}
         </div>
      </div>

      <div className="pt-12 border-t border-slate-100">
         {!isAnswered ? (
            <Button 
              variant="success"
              disabled={selectedOption === null}
              onClick={handleVerify}
              className="w-full !py-5 font-outfit text-xl uppercase"
            >
              Vérifier
            </Button>
         ) : (
            <Button 
               onClick={handleNext}
               className="w-full !py-5 font-outfit text-xl uppercase"
            >
               Continuer
            </Button>
         )}
      </div>
    </div>
  );
}
