import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { User, LogOut, BookOpen, Layout, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { level } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <Outlet />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-primary-600">
            <GraduationCap size={32} />
            <h1 className="text-2xl font-outfit font-bold tracking-tight">EduLink</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarLink to="/dashboard" icon={<Layout size={20} />} label="Tableau de bord" />
          <SidebarLink to="/select-level" icon={<BookOpen size={20} />} label="Changer de niveau" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
            <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full bg-white border" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-slate-500 uppercase font-bold">{level || 'Aucun niveau'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pb-12">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
           <div className="lg:hidden flex items-center gap-2 text-primary-600">
            <GraduationCap size={24} />
            <span className="font-outfit font-bold text-xl">EduLink</span>
          </div>
          <div></div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-slate-500">{level}</span>
            </div>
            <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200" />
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-3 p-3 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all font-medium group"
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      {label}
    </Link>
  );
}
