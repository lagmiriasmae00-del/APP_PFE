import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux'; 
import { 
  Home,        
  Info,        
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Users, 
  FileText, 
  FolderOpen, 
  HelpCircle,
  LogOut 
} from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const isAdmin = isAuthenticated && user?.profile?.role === 'admin';

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  // ✨ دالة الستايل الموحدة للروابط الرئيسية (Accueil, À propos, Mes Modules)
  const activeStyle = ({ isActive }) => 
    `text-sm font-medium flex items-center gap-1.5 transition-colors ${
      isActive ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'
    }`;

  // 🛠️ دالة ستايل مخصصة لروابط الـ Admin باش الحجم ديالها يبقى متناسق (text-xs) وما تخرقش الديزاين
  const adminActiveStyle = ({ isActive }) => 
    `text-xs font-normal flex items-center gap-1.5 transition-colors ${
      isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b shadow-sm sticky top-0 z-50 h-16">
      
      {/* اللوغو */}
      <div className="logo font-bold text-blue-600 text-2xl tracking-tight">EduLink</div>
      
      {/* الروابط الوسطى */}
      <div className="links space-x-6 flex items-center">
        
        {/* 🏠 Accueil - خارج الشروط باش تبان ديما بالأيقونة ديالها */}
        <NavLink to="/" end className={activeStyle}> {/* 🌟 زدنا end هنا تاهيا باش ما يتخلطش مع صفحات خريين */}
          <Home className="w-4 h-4" /> 
          <span>Accueil</span>
        </NavLink>
        
        {/* ℹ️ À propos - خارج الشروط تاهي */}
        <NavLink to="/about" className={activeStyle}>
          <Info className="w-4 h-4" /> 
          <span>À propos</span>
        </NavLink>
        
        {/* 1. روابط الـ Stagiaire (كتظهر فقط للمستخدم العادي) */}
        {isAuthenticated && !isAdmin && (
          <>
            <NavLink to="/dashboard" className={activeStyle}>
              <LayoutDashboard className="w-4 h-4" /> 
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/modules" className={activeStyle}>
              <BookOpen className="w-4 h-4" /> 
              <span>Mes Modules</span>
            </NavLink>
          </>
        )}

        {/* 2. روابط الـ Admin (كتظهر فقط للـ Admin) */}
        {isAdmin && (
          <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
            {/* 🌟 التعديل السحري هنا: زدنا خاصية end لـ Dashboard */}
            <NavLink to="/admin" end className={adminActiveStyle}>
              <LayoutDashboard className="w-3.5 h-3.5" /> <span>Dashboard</span>
            </NavLink>
            
            <NavLink to="/admin/modules" className={adminActiveStyle}>
              <BookOpen className="w-3.5 h-3.5" /> <span>Modules</span>
            </NavLink>
            
            <NavLink to="/admin/quizzes" className={adminActiveStyle}>
              <HelpCircle className="w-3.5 h-3.5" /> <span>Quizzes</span>
            </NavLink>

            <NavLink to="/admin/lessons" className={adminActiveStyle}>
              <FileText className="w-3.5 h-3.5" /> <span>Leçons</span>
            </NavLink>
            
            <NavLink to="/admin/documents" className={adminActiveStyle}>
              <FolderOpen className="w-3.5 h-3.5" /> <span>Documents</span>
            </NavLink>
            
            <NavLink to="/admin/filieres" className={adminActiveStyle}>
              <GraduationCap className="w-3.5 h-3.5" /> <span>Filières</span>
            </NavLink>
            
            <NavLink to="/admin/users" className={adminActiveStyle}>
              <Users className="w-3.5 h-3.5" /> <span>Users</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* الجهة اليمنى (الأزرار والبروفايل) */}
      <div className="auth-buttons flex items-center gap-3">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 text-sm font-normal">Connexion</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-normal hover:bg-blue-700 transition">S'inscrire</Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            {/* معلومات الـ User المتصل */}
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-normal border border-slate-200">
              {user?.name} <span className="text-blue-600 text-[10px] ml-1 uppercase bg-blue-50 px-1 py-0.5 rounded">({user?.profile?.role || 'stagiaire'})</span>
            </span>

            {/* زر تسجيل الخروج */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 transition-all duration-200 cursor-pointer"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;