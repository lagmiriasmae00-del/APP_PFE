import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Play, FileText, CheckCircle2, Trophy, HelpCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import subjectsData from '../data/subjects.json';
import { motion } from 'framer-motion';

export default function Module() {
  const { subId, modId } = useParams();
  const navigate = useNavigate();
  const { progress } = useAppContext();
  
  const subject = subjectsData.find(s => s.id === subId);
  const module = subject?.modules.find(m => m.id === modId);

  if (!module) return <div>Module introuvable</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(`/subject/${subId}`)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-bold"
        >
          <ArrowLeft size={18} />
          Retour à {subject.name}
        </button>
        
        <div className="flex items-center gap-4">
           <span className="text-sm font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-xl">Module {modId.replace('m', '')}</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-50" />
        
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-outfit font-bold text-slate-800 mb-4">{module.title}</h1>
          <p className="text-slate-500 text-lg max-w-2xl mb-10">
            Suivez les leçons, regardez les explications vidéo et téléchargez les supports de cours pour maîtriser ce module.
          </p>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
               <h2 className="text-2xl font-bold font-outfit flex items-center gap-2 text-slate-800">
                 <Play size={24} className="text-primary-500" /> Leçons & Contenu
               </h2>
               
               <div className="space-y-3">
                  {module.lessons.map((lesson, index) => {
                    const isCompleted = progress[lesson.id];
                    return (
                      <motion.div 
                        key={lesson.id}
                        whileHover={{ x: 10 }}
                        className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-white border-2 border-transparent hover:border-primary-100 transition-all cursor-pointer group shadow-sm active:translate-y-1"
                        onClick={() => navigate(`/lesson/${subId}/${modId}/${lesson.id}`)}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${lesson.type === 'video' ? 'bg-primary-50 text-primary-600' : 'bg-orange-50 text-orange-500'}`}>
                               {lesson.type === 'video' ? <Play size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{lesson.title}</h4>
                               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{lesson.type}</p>
                            </div>
                         </div>
                         {isCompleted && <CheckCircle2 className="text-success" size={24} />}
                      </motion.div>
                    )
                  })}
               </div>
            </div>

            <div className="space-y-6">
               <h2 className="text-2xl font-bold font-outfit flex items-center gap-2 text-slate-800">
                 <Trophy size={24} className="text-warning" /> Quiz & Validation
               </h2>
               
               <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-xl flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-warning/10 text-warning rounded-full flex items-center justify-center mb-6 border-4 border-warning/20">
                     <HelpCircle size={40} />
                  </div>
                  <h4 className="text-2xl font-bold font-outfit text-slate-800 mb-2">Testez vos acquis</h4>
                  <p className="text-slate-500 mb-8 max-w-[250px]">
                    Validez ce module en réussissant le quiz final avec un score supérieur à 70%.
                  </p>
                  
                  <button 
                    onClick={() => navigate(`/quiz/${module.quiz}`)}
                    className="w-full py-4 bg-warning text-white rounded-2xl font-bold shadow-3d-warning hover:bg-yellow-400 transition-all active:translate-y-1 active:shadow-none font-outfit text-lg"
                  >
                    Lancer le Quiz
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
