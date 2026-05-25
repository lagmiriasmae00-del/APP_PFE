import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axios';

// هاد الصفحة هي الـ Dashboard ديال الأدمين
// كتعرض الإحصائيات ديال الفيليارات والموديلات والامتحانات

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({ filieres: 0, modules: 0, examens: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // كنجيبو الداتا من 3 endpoints فاش كيتحمل الكومبوننت
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // كنطلقو 3 requêtes بالتوازي باش يكون أسرع
        const [filieresRes, modulesRes, examensRes] = await Promise.all([
          api.get('/admin/filieres'),
          api.get('/admin/modules'),
          api.get('/admin/examens'),
        ]);

        setStats({
          filieres: Array.isArray(filieresRes.data) ? filieresRes.data.length : 0,
          modules: Array.isArray(modulesRes.data) ? modulesRes.data.length : 0,
          examens: Array.isArray(examensRes.data) ? examensRes.data.length : 0,
        });
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError('Impossible de charger les statistiques. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // سبينر ديال التحميل
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 text-sm font-medium animate-pulse">Chargement des statistiques...</p>
      </div>
    );
  }

  // رسالة الخطأ
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 max-w-md text-center">
          <span className="text-3xl block mb-3">⚠️</span>
          <p className="font-semibold mb-1">Erreur</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // الكروت ديال الإحصائيات
  const statCards = [
    {
      label: 'Total Filières',
      count: stats.filieres,
      icon: '🎓',
      color: 'blue',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      hoverBg: 'group-hover:bg-blue-100',
      description: 'Filières enregistrées',
    },
    {
      label: 'Total Modules',
      count: stats.modules,
      icon: '📚',
      color: 'green',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      hoverBg: 'group-hover:bg-green-100',
      description: 'Modules disponibles',
    },
    {
      label: 'Total Examens',
      count: stats.examens,
      icon: '📝',
      color: 'orange',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      hoverBg: 'group-hover:bg-orange-100',
      description: 'Examens publiés',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">

      {/* === قسم الترحيب === */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Bienvenue, <span className="text-indigo-600">{user?.name || 'Admin'}</span> 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Voici un aperçu global de votre plateforme EduLink.
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-600">Statut: Système Actif</span>
          </div>
        </div>
      </div>

      {/* === الكروت ديال الإحصائيات === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* دائرة ديكوراتيف فالكوان */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${card.bgLight} rounded-bl-full -mr-10 -mt-10 transition-all ${card.hoverBg}`}></div>
            
            <div className="relative">
              <div className={`p-3 ${card.bgLight} ${card.textColor} rounded-lg w-fit mb-4`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <h3 className="text-gray-600 font-semibold uppercase text-xs tracking-wider">
                {card.label}
              </h3>
              <p className="text-4xl font-black text-gray-900 mt-2">
                {card.count}
              </p>
              <p className={`mt-3 text-sm ${card.textColor} font-medium`}>
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* === بانر معلوماتي فالأسفل === */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Gestion de la Plateforme
          </h2>
          <p className="opacity-90 leading-relaxed max-w-2xl">
            Vous gérez actuellement <span className="font-bold">{stats.filieres} filières</span>, <span className="font-bold">{stats.modules} modules</span> et <span className="font-bold">{stats.examens} examens</span>.
            Utilisez le menu latéral pour accéder à chaque section.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
              📊 Statistiques en temps réel
            </span>
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
              🔒 Accès sécurisé
            </span>
          </div>
        </div>
        {/* دائرة ديكوراتيف */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
      </div>
    </div>
  );
};

export default AdminDashboard;
