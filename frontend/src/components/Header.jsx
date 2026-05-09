import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';// Header.jsx
const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="logo font-bold text-blue-600 text-2xl">EduLink</div>
      <div className="links space-x-6">
        <Link to="/">Accueil</Link>
        <Link to="/about">À propos</Link>
        
        {/* Ce lien ne s'affichera que si l'étudiant est connecté */}
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
          <Link to="/dashboard" className="font-semibold text-blue-500">Dashboard</Link>
        )}
      </div>
    </nav>
  );
};
export default Header;