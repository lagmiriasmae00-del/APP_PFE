import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, BookOpen, Layout, GraduationCap, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

import Logo from '../ui/Logo';

function SidebarLink({ to, icon, label, currentPath }) {
  const isActive = currentPath === to || currentPath.startsWith(to + '/');
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium group ${
        isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
      }`}
    >
      <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{icon}</span>
      {label}
    </Link>
  );
}

export default function Sidebar({ onLogout }) {
  const { user } = useAuth();
  const { level } = useAppContext();
  const location = useLocation();
  const currentPath = location.pathname;

  if (!user) return null;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden lg:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 text-[#133A5E]">
          <Logo size={42} />
          <h1 className="text-2xl font-outfit font-bold tracking-tight text-slate-800">SmartLearn</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <SidebarLink to="/dashboard" icon={<Layout size={20} />} label="Tableau de bord" currentPath={currentPath} />
        {/* 'Changer de niveau' removed since TS is fixed */}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
            <User size={20} className="text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Technicien Spécialisé</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
