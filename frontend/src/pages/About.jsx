import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white">
      
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">À propos d'EduLink</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Nous croyons que l'éducation de haute qualité doit être accessible à chaque étudiant et stagiaire au Maroc, à tout moment et en tout lieu.
          </p>
        </div>
      </section>

      
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Team work" 
              className="rounded-3xl shadow-xl"
            />
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Notre Mission : Accompagner votre réussite
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              EduLink est une plateforme éducative numérique conçue spécifiquement pour les étudiants de la formation professionnelle. Notre objective est de simplifier le processus d'apprentissage en fournissant un contenu structuré, des cours complets et des examens blancs pour vous aider à exceller dans les EFM et les examens nationaux.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <p className="text-gray-700 font-medium">Un contenu éducatif gratuit et organisé par filière.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <p className="text-gray-700 font-medium">Une attention particulière portée aux aspects pratiques et théoriques des modules.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <p className="text-gray-700 font-medium">Un soutien continu aux stagiaires grâce à des outils d'évaluation modernes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-blue-600 mb-2">Top</h3>
            <p className="text-gray-500 font-medium text-sm">Contenu Validé</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600 mb-2">1ère</h3>
            <p className="text-gray-500 font-medium text-sm">Plateforme Dédiée</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600 mb-2">100%</h3>
            <p className="text-gray-500 font-medium text-sm">Accès Libre</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600 mb-2">24/7</h3>
            <p className="text-gray-500 font-medium text-sm">Flexibilité Totale</p>
          </div>
        </div>
      </section>

      
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-blue-600 rounded-3xl p-10 md:p-16 text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à booster vos compétences ?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Rejoignez des milliers d'étudiants qui développent leurs compétences chaque jour avec EduLink. Commencez dès maintenant, c'est gratuit !
          </p>
          <Link 
            to="/register" 
            className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-md inline-block"
          >
            S'inscrire maintenant
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;