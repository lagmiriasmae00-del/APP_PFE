import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
// الـ Icons العصريين دياولنا ✨
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Users, 
  FileText, 
  FolderOpen, 
  HelpCircle 
} from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // نتحققوا واش المستخدم اللي مكوّنكتي دابا هو أدمين
  const isAdmin = isAuthenticated && user?.profile?.role === 'admin';

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b shadow-sm sticky top-0 z-50 h-16">
      
      {/* اللوغو */}
      <div className="logo font-bold text-blue-600 text-2xl tracking-tight">EduLink</div>
      
      {/* الروابط الوسطى */}
      <div className="links space-x-6 flex items-center">
        <Link to="/" className="text-gray-700 hover:text-blue-600 text-sm font-normal">Accueil</Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600 text-sm font-normal">À propos</Link>
        
        {/* 1. روابط الـ Stagiaire: الكلمات رجعوا font-normal والـ Icon كحل */}
        {isAuthenticated && !isAdmin && (
          <Link to="/modules" className="text-blue-600 text-sm font-normal flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-black" /> Mes Modules
          </Link>
        )}

        {/* 2. روابط الـ Admin: الخط رجع رقّيق (font-normal) والـ Icons كحلين صغار ونقيين 🖤 */}
        {isAdmin && (
          <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
            <Link to="/admin" className="text-gray-700 hover:text-blue-600 text-xs font-normal flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5 text-black" /> Dashboard
            </Link>
            <Link to="/admin/modules" className="text-gray-700 hover:text-blue-600 text-xs font-normal flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-black" /> Modules
            </Link>
            <Link to="/admin/quizzes" className="text-gray-700 hover:text-blue-600 text-xs font-normal flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-black" /> Quizzes
            </Link>
            <Link to="/admin/examens" className="text-gray-700 hover:text-blue-600 text-xs font-normal flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-black" /> Examens
            </Link>
            <Link to="/admin/lessons" className="text-gray-700 hover:text-blue-600 text-xs font-normal flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-black" /> Leçons
            </Link>
            <Link to="/admin/documents" className="text-gray-700 hover:text-blue-600 text-xs font-normal flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-black" /> Documents
            </Link>
            <Link to="/admin/filieres" className="text-gray-700 hover:text-blue-600 text-xs font-normal flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-black" /> Filières
            </Link>
            <Link to="/admin/users" className="text-gray-700 hover:text-blue-600 text-xs font-normal flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-black" /> Users
            </Link>
          </div>
        )}
      </div>

      {/* الجهة اليمنى */}
      <div className="auth-buttons flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 text-sm font-normal">Connexion</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-normal hover:bg-blue-700 transition">S'inscrire</Link>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-normal border border-slate-200">
              👤 {user?.name} <span className="text-blue-600 text-[10px] ml-1 uppercase bg-blue-50 px-1 py-0.5 rounded">({user?.profile?.role || 'stagiaire'})</span>
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;