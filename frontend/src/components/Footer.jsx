import React from 'react';
import logo from '../assets/image.png';
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src={logo} alt="EduLink Logo" className="w-8 h-8 brightness-0 invert" />
              <span className="text-2xl font-bold text-white">EduLink</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              La plateforme d'apprentissage nouvelle génération pour les étudiants ambitieux.
              Apprenez, grandissez et réussissez avec nous.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Plateforme</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-primary transition-colors">Tous les cours</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Formateurs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Entreprises</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tarifs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-primary transition-colors">Aide & FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contactez-nous</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Communauté</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                contact@edulink.com
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Casablanca, Maroc
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:row items-center justify-between gap-4">
          <p>© 2026 EduLink. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
