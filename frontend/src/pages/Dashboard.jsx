import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, CheckCircle, FileText, Loader2, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    api.get('/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (user?.profile?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (!stats) return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Bienvenue, <span className="text-blue-600 capitalize">{stats.user_name}</span>
            </h1>
            <p className="text-gray-400 text-xs font-semibold mt-1">Voici un aperçu de votre progression.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:bg-blue-100/70"></div>
          <div className="relative space-y-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
               <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Modules disponibles</h3>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats.modules_total}</p>
            </div>
            <Link 
              to="/modules" 
              className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:gap-2 transition-all cursor-pointer pt-2"
            >
              <span>Voir les cours</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:bg-emerald-100/70"></div>
          <div className="relative space-y-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
               <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Quizzes complétés</h3>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats.quizzes_completed}</p>
            </div>
            <Link 
              to="/quizzes" 
              className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold hover:gap-2 transition-all cursor-pointer pt-2"
            >
              <span>Consulter mes scores</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:bg-amber-100/70"></div>
          <div className="relative space-y-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit">
               <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Documents et EFM</h3>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats.exams_total}</p>
            </div>
            <Link 
              to="/modules" 
              className="inline-flex items-center gap-1 text-xs text-amber-600 font-bold hover:gap-2 transition-all cursor-pointer pt-2"
            >
              <span>Ouvrir les documents</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;