import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-400 text-sm">
          © {new Date().getFullYear()} <span className="font-bold text-blue-600">EduLink</span>. Tous les droits réservés.
        </div>
        <div className="flex space-x-6 text-gray-400 text-sm">
          <a href="#" className="hover:text-blue-600">Confidentialité</a>
          <a href="#" className="hover:text-blue-600">Conditions</a>
          <span className="text-gray-300">Made for Stagiaires 🇲🇦</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;