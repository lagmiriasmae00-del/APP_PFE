import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, FlaskConical, Leaf, ChevronRight, Trophy, Star, Book } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import subjectsData from '../data/subjects.json';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { level, progress } = useAppContext();
  const navigate = useNavigate();

  const iconMap = {
    Calculator: <Calculator size={24} />,
    FlaskConical: <FlaskConical size={24} />,
    Leaf: <Leaf size={24} />
  };

  const colorMap = {
    primary: 'bg-primary-500 shadow-3d-info',
    danger: 'bg-danger shadow-3d-danger',
    success: 'bg-success shadow-3d-success'
  };

  const getProgress = (subjectId) => {
     // Mock progress calculation
     const subject = subjectsData.find(s => s.id === subjectId);
     const totalLessons = subject.modules.reduce((acc, m) => acc + m.lessons.length, 0);
     const completed = subject.modules.reduce((acc, m) => {
        return acc + m.lessons.filter(l => progress[l.id]).length;
     }, 0);
     return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard icon={<Trophy className="text-warning" />} label="Niveau" value={level} color="bg-warning/10" />
        <StatCard icon={<Star className="text-primary-500" />} label="Leçons terminées" value={Object.keys(progress).length} color="bg-primary-50" />
        <StatCard icon={<Book className="text-success" />} label="Cours disponibles" value="128" color="bg-success/10" />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-outfit font-bold text-slate-800">Mes matières</h2>
        <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">Explorez tout</span>
      </div>

      {/* Subjects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectsData.map((subject, index) => {
          const subProgress = getProgress(subject.id);
          return (
            <motion.button
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/subject/${subject.id}`)}
              className="group bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 text-left hover:shadow-2xl transition-all relative overflow-hidden active:translate-y-1 active:shadow-none duration-100"
            >
              <div className={`${colorMap[subject.color]} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6`}>
                {iconMap[subject.icon]}
              </div>

              <h3 className="text-xl font-bold font-outfit text-slate-800 mb-2">{subject.name}</h3>
              
              <div className="flex items-center gap-2 mb-6">
                 <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${subProgress}%` }}
                        className={`h-full ${colorMap[subject.color].split(' ')[0]}`}
                    />
                 </div>
                 <span className="text-sm font-bold text-slate-500 font-inter">{subProgress}%</span>
              </div>

              <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                <span>{subject.modules.length} Modules</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm flex items-center gap-6`}>
      <div className={`${color} p-4 rounded-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold font-outfit text-slate-800">{value}</p>
      </div>
    </div>
  );
}
