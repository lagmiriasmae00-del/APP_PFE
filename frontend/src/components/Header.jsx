// Header.jsx
const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <nav className="flex justify-between items-center p-4 bg-white">
      <div className="logo font-bold text-blue-600 text-2xl">EduLink</div>
      
      <div className="links space-x-6">
        <Link to="/">Accueil</Link>
        <Link to="/about">À propos</Link>
        
        {/* هاد الرابط غيبان غير إلا كان الطالب مسجل دخوله */}
        {isAuthenticated && (
          <Link to="/modules" className="font-semibold text-blue-500">Mes Modules</Link>
        )}
      </div>

      <div className="auth-buttons">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="mr-4">Connexion</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full">S'inscrire</Link>
          </>
        ) : (
          <Link to="/dashboard" className="bg-gray-100 px-4 py-2 rounded-full">Dashboard</Link>
        )}
      </div>
    </nav>
  );
};