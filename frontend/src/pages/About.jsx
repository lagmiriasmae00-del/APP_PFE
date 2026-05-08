import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white">
      {/* 1. Header Section - عنوان الصفحة */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">À propos d'EduLink</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            نحن نؤمن بأن التعليم عالي الجودة يجب أن يكون متاحاً لكل طالب متدرب في المغرب، في أي وقت وفي أي مكان.
          </p>
        </div>
      </section>

      {/* 2. Notre Mission - المهمة ديالنا */}
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
              EduLink هي منصة تعليمية رقمية مصممة خصيصاً لطلبة التكوين المهني. هدفنا هو تبسيط عملية التعلم من خلال توفير محتوى منظم، دروس شاملة، وامتحانات تجريبية تساعدك على التفوق في الـ EFM والامتحانات الوطنية.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <p className="text-gray-700 font-medium">محتوى تعليمي مجاني ومنظم حسب الشعب.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <p className="text-gray-700 font-medium">تركيز على الجانب التطبيقي والنظري للموديلات.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <p className="text-gray-700 font-medium">دعم مستمر للمتدربين من خلال أدوات تقييم حديثة.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Section - أرقام المنصة */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-blue-600 mb-2">10k+</h3>
            <p className="text-gray-500 font-medium text-sm">Étudiants</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600 mb-2">50+</h3>
            <p className="text-gray-500 font-medium text-sm">Modules</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600 mb-2">100%</h3>
            <p className="text-gray-500 font-medium text-sm">Gratuit</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600 mb-2">24/7</h3>
            <p className="text-gray-500 font-medium text-sm">Accessibilité</p>
          </div>
        </div>
      </section>

      {/* 4. Call to Action - دعوة للتسجيل */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-blue-600 rounded-3xl p-10 md:p-16 text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à booster vos compétences ?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            انضم إلى آلاف الطلبة الذين يطورون مهاراتهم يومياً مع EduLink. ابدأ الآن مجاناً!
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