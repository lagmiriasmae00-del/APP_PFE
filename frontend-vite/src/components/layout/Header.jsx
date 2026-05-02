import React from 'react';
import { GraduationCap, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

import Logo from '../ui/Logo';

export default function Header() {
  const { user } = useAuth();
  const { level } = useAppContext();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
      <div className="lg:hidden flex items-center gap-2 text-[#133A5E]">
        <Logo size={28} />
        <span className="font-outfit font-bold text-xl text-slate-800">SmartLearn</span>
      </div>
      <div></div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="text-[10px] uppercase font-bold text-slate-500">TS - Dev Digital</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
          <User size={16} className="text-slate-600" />
        </div>
      </div>
    </header>
  );
}
