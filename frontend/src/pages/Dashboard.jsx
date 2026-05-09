import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useSelector } from 'react-redux';
// إلا كنتِ دايرة install لـ lucide-react، هادو كيجيو واعرين
// import { BookOpen, CheckCircle, FileText, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    api.get('/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Bienvenue, <span className="text-indigo-600">{stats.user_name}</span>
            </h1>
            <p className="text-gray-500 mt-1">Heureux de vous revoir ! Voici un aperçu de votre progression.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-600">Statut: Étudiant Actif</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1 */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-blue-100"></div>
          <div className="relative">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-fit mb-4">
               📚 {/* أو <BookOpen size={24} /> */}
            </div>
            <h3 className="text-gray-600 font-semibold uppercase text-xs tracking-wider">Modules disponibles</h3>
            <p className="text-4xl font-black text-gray-900 mt-2">{stats.modules_total}</p>
            <div className="mt-4 flex items-center text-sm text-blue-600 font-medium cursor-pointer hover:underline">
              Voir les cours →
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-green-100"></div>
          <div className="relative">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg w-fit mb-4">
               ✅ {/* أو <CheckCircle size={24} /> */}
            </div>
            <h3 className="text-gray-600 font-semibold uppercase text-xs tracking-wider">Quizzes complétés</h3>
            <p className="text-4xl font-black text-gray-900 mt-2">{stats.quizzes_completed}</p>
            <div className="mt-4 flex items-center text-sm text-green-600 font-medium cursor-pointer hover:underline">
              Consulter mes scores →
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-orange-100"></div>
          <div className="relative">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg w-fit mb-4">
               📄 {/* أو <FileText size={24} /> */}
            </div>
            <h3 className="text-gray-600 font-semibold uppercase text-xs tracking-wider">Documents et EFM</h3>
            <p className="text-4xl font-black text-gray-900 mt-2">{stats.exams_total}</p>
            <div className="mt-4 flex items-center text-sm text-orange-600 font-medium cursor-pointer hover:underline">
              Télécharger les supports →
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Votre Profil Académique</h2>
            <p className="opacity-90 leading-relaxed max-w-2xl">
              Vous êtes actuellement inscrit en <span className="font-bold underline">{user?.profile?.filiere?.nom || 'Développement Digital'}</span>. 
              Préparez-vous pour vos examens de <span className="bg-white/20 px-2 py-0.5 rounded">Niveau {user?.profile?.niveau}</span>.
            </p>
            <button className="mt-6 bg-white text-indigo-700 px-6 py-2 rounded-full font-bold text-sm hover:bg-opacity-90 transition">
              Modifier mon profil
            </button>
          </div>
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;