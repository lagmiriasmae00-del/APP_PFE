import React, { useState } from 'react';
import ModuleCard from './ModuleCard';

const modulesData = [
  { id: 1, title: "Développement Frontend", level: "M102", duration: "120h", category: "Digital" },
  { id: 2, title: "Backend avec PHP/Laravel", level: "M103", duration: "140h", category: "Digital" },
  { id: 3, title: "Gestion de Bases de Données", level: "M104", duration: "100h", category: "Infrastructure" },
  { id: 4, title: "Mobile Apps (React Native)", level: "M105", duration: "110h", category: "Digital" },
  { id: 5, title: "Design UI/UX & Prototypage", level: "M101", duration: "80h", category: "Design" },
  { id: 6, title: "Sécurité Informatique", level: "M108", duration: "90h", category: "Sécurité" },
  { id: 7, title: "Cloud Computing & AWS", level: "M109", duration: "120h", category: "Infrastructure" },
  { id: 8, title: "Intelligence Artificielle", level: "M110", duration: "150h", category: "Data" },
];

const categories = ["Tous", "Digital", "Infrastructure", "Design", "Sécurité", "Data"];

const Modules = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filteredModules = activeCategory === "Tous" 
    ? modulesData 
    : modulesData.filter(module => module.category === activeCategory);

  return (
    <section className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Catalogue des Modules</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Explorez notre sélection complète de modules pour la filière Développement Digital. 
            Chaque module est conçu pour vous apporter des compétences concrètes et recherchées.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat 
                  ? "bg-primary text-white shadow-lg shadow-primary/30" 
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredModules.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aucun module trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Modules;
