import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, PlayCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import subjectsData from '../data/subjects.json';
import { motion } from 'framer-motion';

export default function Subject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress } = useAppContext();
  
  const subject = subjectsData.find(s => s.id === id);

  if (!subject) return <div>Matière introuvable</div>;

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
                   className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                   onClick={() => navigate(`/module/${subject.id}/${module.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-success text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600'} transition-colors`}>
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

                    <div className="flex flex-col items-end gap-2">
                       {isCompleted ? (
                         <span className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                           <CheckCircle2 size={14} /> Terminée
                         </span>
                       ) : (
                         <div className="text-right">
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{completedCount}/{module.lessons.length} leçons</span>
                           <div className="w-24 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-primary-500" style={{ width: `${(completedCount / module.lessons.length) * 100}%` }} />
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
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
                 {/* Circle progress mockup */}
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * 0.45)} className="text-primary-500" strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-outfit text-slate-800">45%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">terminé</span>
                 </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2">
                 <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">Quiz réussis</span>
                    <span className="text-primary-600">3/8</span>
                 </div>
                 <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">Heures étudiées</span>
                    <span className="text-primary-600">12h</span>
                 </div>
              </div>

              <button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-3d-info hover:bg-primary-500 transition-all active:translate-y-1 active:shadow-none font-outfit">
                 Télécharger le certificat
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
}

function Trophy(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}
