import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import DocumentSection from '../components/DocumentSection';

const ModuleDetail = () => {
  const { id } = useParams(); 
  const [module, setModule] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons'); // lessons, quizzes, docs

  useEffect(() => {
    api.get(`/module/${id}`) // تأكد من الـ Route فـ api.php (كان مكتوب /module/{id})
      .then(res => setModule(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!module) return <div className="p-10 text-center">Chargement du module...</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{module.titre}</h1>
        <p className="text-blue-600 font-medium">Niveau: {module.niveau === 1 ? '1ère année' : '2ème année'}</p>
      </div>

      <div className="flex border-b border-gray-200 mb-8 space-x-8">
        {['lessons', 'quizzes', 'documents'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 font-semibold capitalize transition ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'lessons' ? '📚 Cours' : tab === 'quizzes' ? '✍️ Examens' : '📄 Documents'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeTab === 'lessons' && (
          <div className="space-y-4">
            {module.lessons?.map(lesson => (
              <div key={lesson.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{lesson.titre}</h3>
                  <p className="text-gray-500 text-sm">{lesson.videos?.length || 0} Vidéos disponibles</p>
                </div>
                <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
                  Ouvrir le cours
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {module.quizzes?.map(quiz => (
              <div key={quiz.id} className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-xl text-blue-900 mb-2">{quiz.titre}</h3>
                <p className="text-blue-700 text-sm mb-4">Préparez-vous à tester vos connaissances.</p>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition">
                  Commencer le Quiz
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'documents' && (
          <DocumentSection documents={module.documents || []} />
        )}
        
        {((activeTab === 'lessons' && (!module.lessons || module.lessons.length === 0)) || 
          (activeTab === 'quizzes' && (!module.quizzes || module.quizzes.length === 0)) ||
          (activeTab === 'documents' && (!module.documents || module.documents.length === 0))) && (
          <div className="text-center py-20">
            <p className="text-gray-400">Aucun contenu disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail;
