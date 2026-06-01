import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white">
      {}
      <section className="container mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
        
        {}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            L'avenir de <br />
            <span className="text-blue-600">l'apprentissage</span> <br />
            est ici.
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
            Accédez à une éducation de classe mondiale, n'importe où, n'importe quand. 
            EduLink connecte les esprits brillants avec des ressources d'exception.
          </p>
          


        </div>

        {/* الصورة - Right Side */}
        <div className="md:w-1/2 relative">
          {/* الخلفية الزرقاء اللي ورا التصويرة */}
          <div className="absolute inset-0 bg-blue-100 rounded-3xl rotate-3 scale-105 -z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Stagiaires travaillant" 
            className="rounded-3xl shadow-2xl w-full object-cover h-[400px] md:h-[500px]"
          />
        </div>
      </section>

      {/* 2. WHY CHOOSE US - علاش EduLink ؟ */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir EduLink ?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Nous avons conçu notre plateforme pour offrir la meilleure expérience d'apprentissage possible, 
              en mettant l'accent sur la qualité, la flexibilité et la réussite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-6">📖</div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Cours de Qualité</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Des contenus créés par des experts du domaine pour garantir votre réussite et maîtriser votre spécialité.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-2xl mb-6">⏱️</div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Flexibilité Totale</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Apprenez à votre rythme, où que vous soyez, sur n'importe quel appareil. Votre savoir n'a plus de limites.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center text-2xl mb-6">📜</div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Suivi & Examens</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Accédez à des quiz et des examens de fin de module pour tester vos connaissances et vous préparer aux EFM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIALS - داكشي اللي كيقولو الطلبة */}
      <section className="py-20 bg-white text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ce que disent nos étudiants</h3>
        <p className="text-gray-500 max-w-xl mx-auto px-6">
          "Des centaines d'étudiants à travers le Maroc transforment leur carrière grâce à EduLink."
        </p>
      </section>
    </div>
  );
};

export default Home;