import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, Trophy, Home } from 'lucide-react';
import quizzesData from '../data/quizzes.json';
import { motion } from 'framer-motion';

export default function Exam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questions = quizzesData[id] || [];
  
  const EXAM_TIME = 600; // 10 minutes
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState({});
  const [examScore, setExamScore] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmit();
    }
  }, [timeLeft, showResult]);

  const handleSelect = (qIdx, optIdx) => {
    if (showResult) return;
    setAnswers({ ...answers, [qIdx]: optIdx });
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, idx) => {
       if (answers[idx] === q.answer) score++;
    });
    setExamScore(score);
    setShowResult(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions.length) return <div>Examen introuvable</div>;

  if (showResult) {
    const pct = Math.round((examScore / questions.length) * 100);
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
         <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 max-w-xl w-full text-center">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-8 bg-primary-50 text-primary-600 border-4 border-primary-100`}>
               <Trophy size={48} />
            </div>
            <h2 className="text-4xl font-outfit font-bold text-slate-800 mb-2">Examen terminé</h2>
            <p className="text-xl text-slate-500 font-bold mb-8">Votre score final : {examScore} / {questions.length} ({pct}%)</p>
            <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-3d-info hover:bg-primary-500 flex items-center justify-center gap-2 font-outfit text-xl active:translate-y-1 active:shadow-none transition-all">
               <Home size={24} /> Terminer
            </button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
       <header className="sticky top-20 z-20 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-xl flex items-center justify-between">
          <div>
             <h1 className="text-2xl font-bold font-outfit text-slate-800 uppercase tracking-tight">Examen Blanc</h1>
             <p className="text-sm font-bold text-slate-400">Répondez à toutes les questions</p>
          </div>
          <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-2xl font-outfit border-2 ${timeLeft < 60 ? 'bg-danger/10 text-danger border-danger/20' : 'bg-primary-50 text-primary-600 border-primary-100'}`}>
             <Clock size={28} />
             {formatTime(timeLeft)}
          </div>
       </header>

       <div className="space-y-12">
          {questions.map((q, qIdx) => (
             <div key={qIdx} className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-lg">
                <h3 className="text-2xl font-bold font-outfit text-slate-800 mb-8 leading-relaxed">
                   <span className="text-primary-500 mr-2">Q{qIdx + 1}.</span> {q.question}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                   {q.options.map((opt, optIdx) => (
                      <button 
                         key={optIdx} 
                         onClick={() => handleSelect(qIdx, optIdx)}
                         className={`p-6 text-left rounded-2xl border-2 font-bold text-lg transition-all active:translate-y-1 active:shadow-none flex items-center justify-between ${answers[qIdx] === optIdx ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-3d-info' : 'bg-slate-50 border-transparent hover:border-slate-200 shadow-3d-gray'}`}
                      >
                         {opt}
                      </button>
                   ))}
                </div>
             </div>
          ))}
       </div>

       <div className="pt-12 pb-12 flex justify-center">
          <button 
             onClick={handleSubmit} 
             className="px-16 py-6 bg-success text-white rounded-[2rem] font-bold font-outfit text-2xl shadow-3d-success hover:bg-green-500 transition-all active:translate-y-1 active:shadow-none"
          >
             VALIDER TOUT L'EXAMEN
          </button>
       </div>
    </div>
  );
}
