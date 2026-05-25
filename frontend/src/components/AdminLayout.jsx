import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import api from '../api/axios';

// هاد الكومبوننت هو الـ Layout ديال لوحة الإدارة (Admin Panel)
// فيه sidebar ثابت من اليسار و top bar من الفوق و الـ content فالوسط

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: '/admin', label: 'Dashboard Admin', icon: '📊' },
    { path: '/admin/modules', label: 'Modules', icon: '📚' },
    { path: '/admin/quizzes', label: 'Quizzes', icon: '📝' },
    { path: '/admin/documents', label: 'Documents', icon: '📁' },
  ];

  // فونكسيون ديال الـ Logout - كتمسح التوكن و كتوجه للـ Login
  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  // باش نشوفو واش الرابط هو اللي نشط دابا
  const isActiveLink = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* === Overlay ديال الموبايل - كيبان غير فاش الـ sidebar مفتوح === */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* === Sidebar ثابت من اليسار === */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">

          {/* لوغو و الـ Brand ديال EduLink */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700/50">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-extrabold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                EduLink
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
            {/* زر إغلاق الـ sidebar فالموبايل */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* روابط التنقل */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="px-3 mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Navigation
            </p>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActiveLink(link.path)
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
                {isActiveLink(link.path) && (
                  <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </NavLink>
            ))}
          </nav>

          {/* زر تسجيل الخروج فالأسفل */}
          <div className="px-4 py-4 border-t border-slate-700/50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 cursor-pointer"
            >
              <span className="text-lg">🚪</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* === الجزء اللي على اليمين (Top bar + Content) === */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            {/* زر فتح الـ sidebar فالموبايل */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Panneau d'Administration
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block">
                Gérez votre plateforme EduLink
              </p>
            </div>
          </div>

          {/* معلومات الأدمين */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user?.name || 'Administrateur'}</p>
              <p className="text-xs text-indigo-600 font-medium">Administrateur</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* المحتوى الرئيسي - هنا كيتعرض الـ Outlet */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
