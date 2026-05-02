import { Link } from 'react-router-dom'; // Importation nécessaire
import logo from '../assets/image.png';
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Le logo ramène maintenant à l'accueil */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="EduLink Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            EduLink
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Accueil
          </Link>
          <Link to="/courses" className="font-medium hover:text-primary transition-colors">
            Modules
          </Link>
          <Link to="/about" className="font-medium hover:text-primary transition-colors">
            À propos
          </Link>
          <Link to="/contact" className="font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block font-medium hover:text-primary transition-colors">
            Connexion
          </Link>
          <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 shadow-md">
            S'inscrire
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Header;