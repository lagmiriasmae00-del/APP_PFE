import React from 'react';

const About = () => {
  return (
    <section className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Démocratiser l'excellence éducative au Maroc.
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              EduLink est né d'une vision simple : offrir à chaque étudiant de l'ISTA et de l'OFPPT 
              un accès gratuit à des ressources d'apprentissage de haute qualité, modernes et adaptées 
              aux besoins du marché du travail actuel.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-bold text-primary mb-2">50+</h4>
                <p className="text-gray-500 font-medium">Modules complets</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-secondary mb-2">10k+</h4>
                <p className="text-gray-500 font-medium">Étudiants actifs</p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Students collaborating" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Innovation</h4>
              <p className="text-slate-400">Nous utilisons les dernières technologies pour offrir une expérience d'apprentissage fluide.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Communauté</h4>
              <p className="text-slate-400">EduLink est un espace d'entraide où chaque étudiant peut grandir avec les autres.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Qualité</h4>
              <p className="text-slate-400">Nous collaborons avec des experts pour garantir la pertinence de chaque contenu.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
