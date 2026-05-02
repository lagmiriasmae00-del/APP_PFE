import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-r from-primary to-secondary rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-3xl">
              Prêt à transformer votre avenir professionnel ?
            </h2>
            <p className="text-white/80 text-xl mb-10 max-w-2xl leading-relaxed">
              Rejoignez des milliers d'étudiants de l'ISTA et de l'OFPPT qui se forment chaque jour avec nos ressources exclusives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="bg-white text-primary hover:bg-slate-50 px-10 py-4 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                S'inscrire maintenant
              </Link>
              <Link 
                to="/courses" 
                className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-full text-lg font-bold transition-all"
              >
                Voir les modules
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
