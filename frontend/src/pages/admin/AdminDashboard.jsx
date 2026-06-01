import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
// استيراد الأيقونات العصرية والنقية 🖤
import { GraduationCap, BookOpen, FileText, AlertTriangle, RefreshCw, BarChart3, ShieldCheck } from 'lucide-react';

// هاد الصفحة هي الـ Dashboard ديال الأدمين
// كتعرض الإحصائيات ديال الفيليارات والموديلات والامتحانات
const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({ filieres: 0, modules: 0, quizzes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // كنجيبو الداتا من 3 endpoints فاش كيتحمل الكومبوننت
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // كنطلقو 3 requêtes بالتوازي باش يكون أسرع
        const [filieresRes, modulesRes, quizzesRes] = await Promise.all([
          api.get('/admin/filieres'),
          api.get('/admin/modules'),
          api.get('/admin/quizzes'),
        ]);

        setStats({
          filieres: Array.isArray(filieresRes.data) ? filieresRes.data.length : 0,
          modules: Array.isArray(modulesRes.data) ? modulesRes.data.length : 0,
          quizzes: Array.isArray(quizzesRes.data) ? quizzesRes.data.length : 0,
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

  // سبينر ديال التحميل (معدل بـ Style نقي)
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 text-sm font-medium animate-pulse">Chargement des statistiques...</p>
      </div>
    );
  }

  // رسالة الخطأ (معدلة بـ الأيقونة العصرية)
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 max-w-md text-center shadow-sm">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="font-semibold mb-1 text-gray-900">Erreur</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Réessayer
          </button>
        </div>
      </div>
    );
  }

  // الكروت ديال الإحصائيات مع الأيقونات الجداد الكحلين 🖤
  const statCards = [
    {
      label: 'Total Filières',
      count: stats.filieres,
      icon: <GraduationCap className="w-6 h-6" />,
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      hoverBg: 'group-hover:bg-blue-100',
      description: 'Filières enregistrées',
    },
    {
      label: 'Total Modules',
      count: stats.modules,
      icon: <BookOpen className="w-6 h-6" />,
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      hoverBg: 'group-hover:bg-green-100',
      description: 'Modules disponibles',
    },
    {
      label: 'Total Quizzes',
      count: stats.quizzes,
      icon: <FileText className="w-6 h-6" />,
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      hoverBg: 'group-hover:bg-orange-100',
      description: 'Quizzes publiés',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">

      {/* === قسم الترحيب === */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Bienvenue, <span className="text-indigo-600">{user?.name || 'Admin EduLink'}</span>
            </h1>
            <p className="text-gray-500 mt-1">
              Voici un aperçu global de votre plateforme EduLink.
            </p>
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
              {/* الأيقونة العصرية بلون أسود داخل خلفية خفيفة */}
              <div className={`p-3 ${card.bgLight} text-black rounded-xl w-fit mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                {card.label}
              </h3>
              <p className="text-4xl font-black text-gray-900 mt-2">
                {card.count}
              </p>
              <p className={`mt-3 text-xs ${card.textColor} font-medium`}>
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* === بانر معلوماتي فالأسفل مع الـ الأيقونات النقيين === */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Gestion de la Plateforme
          </h2>
          <p className="opacity-90 text-sm leading-relaxed max-w-2xl font-normal">
            Vous gerez actuellement <span className="font-semibold">{stats.filieres} filières</span>, <span className="font-semibold">{stats.modules} modules</span> et <span className="font-semibold">{stats.quizzes} quizzes</span>.
            Utilisez le menu latéral pour accéder à chaque section.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-xs font-normal backdrop-blur-sm border border-white/10">
              <BarChart3 className="w-3.5 h-3.5 text-white" /> Statistiques en temps réel
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-xs font-normal backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-white" /> Accès sécurisé
            </span>
          </div>
        </div>
        {/* دوائر ديكوراتيف */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
      </div>
    </div>
  );
};

export default AdminDashboard;