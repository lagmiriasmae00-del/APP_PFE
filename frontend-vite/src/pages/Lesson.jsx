import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, Play, FileText, ChevronLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import subjectsData from '../data/subjects.json';
import { motion } from 'framer-motion';

export default function Lesson() {
  const { subId, modId, lesId } = useParams();
  const navigate = useNavigate();
  const { progress, completeLesson } = useAppContext();
  
  const subject = subjectsData.find(s => s.id === subId);
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

  if (!lesson) return <div>Leçon introuvable</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => navigate(`/module/${subId}/${modId}`)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-bold"
        >
          <ArrowLeft size={18} />
          Retour au module
        </button>

        <div className="flex items-center gap-2">
           <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 disabled:opacity-50" disabled><ChevronLeft size={24} /></button>
           <span className="text-sm font-bold text-slate-500">{lesson.title}</span>
           <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronRight size={24} /></button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-12">
            <div className="flex items-center gap-4 mb-8">
               <div className={`p-4 rounded-[1.5rem] ${lesson.type === 'video' ? 'bg-primary-50 text-primary-600' : 'bg-orange-50 text-orange-500'}`}>
                   {lesson.type === 'video' ? <Play size={32} /> : <FileText size={32} />}
               </div>
               <div>
                  <h1 className="text-3xl font-outfit font-bold text-slate-800">{lesson.title}</h1>
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">{lesson.type === 'video' ? 'Vidéo Explicative' : 'Document PDF'}</p>
               </div>
            </div>

            <div className="aspect-video w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-slate-900 flex items-center justify-center">
                {lesson.type === 'video' ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={lesson.content} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  />
                ) : (
                  <div className="text-white flex flex-col items-center gap-4">
                     <FileText size={64} className="text-orange-400" />
                     <p className="text-xl font-bold">Document de cours PDF</p>
                     <button className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold shadow-3d-danger active:translate-y-1 active:shadow-none transition-all">Consulter le PDF</button>
                  </div>
                )}
            </div>

            <div className="prose max-w-4xl mx-auto mt-12 text-slate-600">
                <p className="text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-6 lg:p-8 flex items-center justify-between border-t border-slate-100">
           <div className="flex items-center gap-2">
              {isCompleted ? (
                 <span className="flex items-center gap-2 text-success font-bold bg-success/10 px-4 py-2 rounded-xl">
                   <CheckCircle2 size={20} /> Leçon terminée
                 </span>
              ) : (
                 <span className="text-slate-400 font-bold">Pas encore terminé</span>
              )}
           </div>

           <button 
             onClick={handleComplete}
             className={`px-8 py-4 rounded-2xl font-bold font-outfit text-white shadow-3d-success transition-all active:translate-y-1 active:shadow-none flex items-center gap-2 ${isCompleted ? 'bg-success/60' : 'bg-success hover:bg-green-500'}`}
           >
             Continuer <ChevronRight size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
