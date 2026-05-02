import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, Play, FileText, ChevronLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

export default function Lesson() {
  const { subId, modId, lesId } = useParams();
  const navigate = useNavigate();
  const { progress, completeLesson } = useAppContext();
  
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const data = await api.getSubjectById(subId);
        setSubject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [subId]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
    </div>
  );

  const module = subject?.modules.find(m => m.id === modId);
  const lesson = module?.lessons.find(l => l.id === lesId);
  
  const isCompleted = progress[lesId];

  const handleComplete = () => {
    completeLesson(lesId);
    // Find next lesson
    const currentIndex = module.lessons.findIndex(l => l.id === lesId);
    if (currentIndex < module.lessons.length - 1) {
       const nextLesson = module.lessons[currentIndex + 1];
       navigate(`/lesson/${subId}/${modId}/${nextLesson.id}`);
    } else {
       navigate(`/module/${subId}/${modId}`);
    }
  };

  const currentIndex = module?.lessons.findIndex(l => l.id === lesId) ?? 0;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < (module?.lessons.length ?? 0) - 1;

  const navigatePrev = () => {
    if (hasPrevious) navigate(`/lesson/${subId}/${modId}/${module.lessons[currentIndex - 1].id}`);
  };
  
  const navigateNext = () => {
    if (hasNext) navigate(`/lesson/${subId}/${modId}/${module.lessons[currentIndex + 1].id}`);
  };

  if (!lesson) return <div>Leçon introuvable</div>;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => navigate(`/module/${subId}/${modId}`)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-bold"
        >
          <ArrowLeft size={18} />
          Retour au module
        </button>

        <div className="flex items-center gap-2">
           <button onClick={navigatePrev} disabled={!hasPrevious} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition">
              <ChevronLeft size={24} />
           </button>
           <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl truncate max-w-[200px]">{lesson.title}</span>
           <button onClick={navigateNext} disabled={!hasNext} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition">
              <ChevronRight size={24} />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-12 relative">
            <div className="flex items-center gap-4 mb-8">
               <div className={`p-4 rounded-[1.5rem] ${lesson.type === 'video' ? 'bg-primary-50 text-primary-600' : 'bg-orange-50 text-orange-500'}`}>
                   {lesson.type === 'video' ? <Play size={32} /> : <FileText size={32} />}
               </div>
               <div>
                  <h1 className="text-3xl font-outfit font-bold text-slate-800">{lesson.title}</h1>
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">{lesson.type === 'video' ? 'Vidéo Explicative' : 'Document PDF'}</p>
               </div>
            </div>

            <div className="aspect-video w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-slate-900 flex items-center justify-center relative z-10">
                {lesson.type === 'video' ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={lesson.content} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="absolute inset-0"
                  />
                ) : (
                  <div className="text-white flex flex-col items-center gap-4 p-8 text-center">
                     <FileText size={80} className="text-orange-400" />
                     <p className="text-2xl font-bold">Document de cours PDF</p>
                     <button className="px-8 py-3 mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-3d-danger active:translate-y-1 active:shadow-none transition-all">
                       Ouvrir le PDF
                     </button>
                  </div>
                )}
            </div>

            <div className="prose max-w-4xl mx-auto mt-12 text-slate-600">
                <p className="text-lg leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  Ceci est le contenu textuel d'accompagnement de la leçon. Il devrait contenir des explications supplémentaires, des formules, ou des notes importantes.
                </p>
            </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-6 lg:p-8 flex items-center justify-between border-t border-slate-200">
           <div className="flex items-center gap-2">
              {isCompleted ? (
                 <span className="flex items-center gap-2 text-success font-bold bg-success/10 px-4 py-2 rounded-xl">
                   <CheckCircle2 size={20} /> Leçon terminée
                 </span>
              ) : (
                 <span className="text-slate-400 font-bold bg-white px-4 py-2 rounded-xl border border-slate-200">À compléter</span>
              )}
           </div>

           <button 
             onClick={handleComplete}
             className={`px-8 py-4 rounded-2xl font-bold font-outfit text-white transition-all active:translate-y-1 flex items-center gap-2 ${isCompleted ? 'bg-success/80 shadow-none' : 'bg-success hover:bg-green-500 shadow-3d-success hover:shadow-lg'}`}
           >
             {hasNext && isCompleted ? 'Leçon suivante' : 'Continuer'} <ChevronRight size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
