import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, FlaskConical, Leaf, ChevronRight, Trophy, Star, Book, Code, Database, LayoutTemplate } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';

export default function Dashboard() {
  const { level, progress } = useAppContext();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await api.getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const iconMap = {
    Calculator: <Calculator size={24} />,
    FlaskConical: <FlaskConical size={24} />,
    Leaf: <Leaf size={24} />,
    Code: <Code size={24} />,
    Database: <Database size={24} />,
    LayoutTemplate: <LayoutTemplate size={24} />
  };

  const colorMap = {
    primary: 'bg-primary-500 shadow-3d-info',
    danger: 'bg-danger shadow-3d-danger',
    success: 'bg-success shadow-3d-success'
  };

  const getProgress = (subject) => {
     const totalLessons = subject.modules.reduce((acc, m) => acc + m.lessons.length, 0);
     const completed = subject.modules.reduce((acc, m) => {
        return acc + m.lessons.filter(l => progress[l.id]).length;
     }, 0);
     return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard icon={<Trophy className="text-primary-600" />} label="Niveau" value="Technicien Spécialisé" color="bg-primary-50" />
        <StatCard icon={<Star className="text-slate-500" />} label="Leçons terminées" value={Object.keys(progress).length} color="bg-slate-100" />
        <StatCard icon={<Book className="text-primary-600" />} label="Matières disponibles" value={subjects.length || 0} color="bg-primary-50" />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-outfit font-bold text-slate-800">Mes matières</h2>
        <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full cursor-pointer hover:bg-primary-100 transition">Explorer tout</span>
      </div>

      {/* Subjects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => {
          const subProgress = getProgress(subject);
          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                hover 
                onClick={() => navigate(`/subject/${subject.id}`)}
              >
                <div className={`${colorMap[subject.color] || colorMap.primary} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {iconMap[subject.icon] || <Book size={24} />}
                </div>

                <h3 className="text-xl font-bold font-outfit text-slate-800 mb-2">{subject.name}</h3>
                
                <div className="mb-6">
                  <ProgressBar progress={subProgress} color={colorMap[subject.color]?.split(' ')[0] || 'bg-primary-500'} />
                </div>

                <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                  <span>{subject.modules.length} Modules</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <Card className="flex items-center gap-6 !p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`${color} p-4 rounded-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold font-outfit text-slate-800">{value}</p>
      </div>
    </Card>
  );
}
