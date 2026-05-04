import React from 'react';
import heroImg from '../assets/edulinlk.png';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 overflow-hidden bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
              L'avenir de <br />
              <span className="text-primary">l'apprentissage</span> est ici.
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              Accédez à une éducation de classe mondiale, n'importe où, n'importe quand. 
              EduLink connecte les esprits brillants avec des ressources d'exception.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-xl w-full sm:w-auto">
                Commencer gratuitement
              </button>
              <button className="flex items-center gap-2 font-bold text-gray-700 hover:text-primary transition-colors px-8 py-4">
                <span className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </span>
                Voir la démo
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-gray-500 font-medium">
                <span className="text-gray-900 font-bold">+10k</span> étudiants nous font confiance
              </p>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src={heroImg} alt="Student learning" className="w-full h-auto" />
            </div>
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
