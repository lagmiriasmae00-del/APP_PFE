import React from 'react';

const testimonials = [
  {
    name: "Amine El Amrani",
    role: "Étudiant Développement Digital",
    content: "EduLink m'a permis de comprendre des concepts complexes en React que je n'arrivais pas à saisir en cours. Une ressource indispensable !",
    avatar: "https://i.pravatar.cc/150?u=amine"
  },
  {
    name: "Sara Benjelloun",
    role: "Lauréate ISTA",
    content: "Grâce aux modules de préparation aux examens, j'ai pu obtenir mon diplôme avec mention. La qualité des contenus est exceptionnelle.",
    avatar: "https://i.pravatar.cc/150?u=sara"
  },
  {
    name: "Yassine Mansouri",
    role: "Développeur Fullstack",
    content: "Même en travaillant déjà, je reviens sur EduLink pour me mettre à jour sur les nouvelles technologies. C'est simple et efficace.",
    avatar: "https://i.pravatar.cc/150?u=yassine"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Ce que disent nos étudiants</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Des centaines d'étudiants à travers le Maroc transforment leur carrière grâce à EduLink.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="mt-6 flex text-accent">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
