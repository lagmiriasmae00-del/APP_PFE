import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, PlayCircle, CheckCircle2, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';

export default function Subject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress, examScores } = useAppContext();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const data = await api.getSubjectById(id);
        setSubject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!subject) return <div>Matière introuvable</div>;

  const totalLessons = subject.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = subject.modules.reduce((acc, m) => {
    return acc + m.lessons.filter(l => progress[l.id]).length;
  }, 0);
  const globalProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  
  const completedQuizzes = subject.modules.filter(m => examScores[m.quiz] !== undefined).length;
  const totalQuizzes = subject.modules.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-bold"
      >
        <ArrowLeft size={18} />
        Retour au dashboard
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-outfit font-bold text-slate-800">{subject.name}</h1>
            <p className="text-slate-500 mt-2">Explorez les modules et développez vos compétences.</p>
          </div>

          <div className="space-y-4">
            {subject.modules.map((module, index) => {
              const completedCount = module.lessons.filter(l => progress[l.id]).length;
              const isCompleted = completedCount === module.lessons.length && module.lessons.length > 0;

              return (
                <motion.div 
                   key={module.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.1 }}
                >
                  <Card hover onClick={() => navigate(`/module/${subject.id}/${module.id}`)}>
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-success text-white shadow-3d-success' : 'bg-slate-100 text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600'} transition-colors`}>
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-outfit text-slate-800">{module.title}</h3>
                          <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Clock size={14} /> {module.lessons.length * 15} mins</span>
                            <span className="flex items-center gap-1"><PlayCircle size={14} /> {module.lessons.length} Leçons</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 w-32">
                         {isCompleted ? (
                           <span className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                             <CheckCircle2 size={14} /> Terminée
                           </span>
                         ) : (
                           <div className="w-full text-right flex flex-col justify-end">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block w-full">{completedCount}/{module.lessons.length} leçons</span>
                             <ProgressBar progress={(completedCount / module.lessons.length) * 100} showText={false} />
                           </div>
                         )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        <aside className="w-full md:w-80 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl sticky top-24">
           <h4 className="text-xl font-bold font-outfit text-slate-800 mb-6 flex items-center gap-2">
             <Trophy className="text-warning" /> Progression globale
           </h4>
           
           <div className="space-y-6">
              <div className="relative w-40 h-40 mx-auto">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * (globalProgress/100))} className="text-primary-500" strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-outfit text-slate-800">{Math.round(globalProgress)}%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">terminé</span>
                 </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2 border border-slate-100">
                 <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">Quiz réussis</span>
                    <span className="text-primary-600">{completedQuizzes}/{totalQuizzes}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">Heures étudiées</span>
                    <span className="text-primary-600">{Math.round(completedLessons * 15 / 60)}h</span>
                 </div>
              </div>

              <button 
                disabled={globalProgress < 100}
                className="w-full py-4 bg-primary-600 disabled:bg-slate-300 text-white rounded-2xl font-bold shadow-3d-info disabled:shadow-none transition-all active:translate-y-1 active:shadow-none font-outfit"
              >
                 Télécharger le certificat
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
}
