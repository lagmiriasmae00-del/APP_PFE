import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const ModuleDetail = () => {
  const { id } = useParams(); // كنجيبو ID ديال المادة من الرابط
  const [module, setModule] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons'); // lessons, quizzes, docs

  useEffect(() => {
    // ضروري فـ Laravel تديري with(['lessons', 'quizzes', 'documents']) فـ Controller
    api.get(`/modules/${id}`)
      .then(res => setModule(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!module) return <div className="p-10 text-center">Chargement du module...</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{module.titre}</h1>
        <p className="text-blue-600 font-medium">Niveau: {module.niveau === 1 ? '1ère année' : '2ème année'}</p>
      </div>

      {/* Tabs Navigation */}
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

      {/* Content Section */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* 1. Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="space-y-4">
            {module.lessons?.map(lesson => (
              <div key={lesson.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{lesson.titre}</h3>
                  <p className="text-gray-500 text-sm">{lesson.videos_count || 0} Vidéos disponibles</p>
                </div>
                <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
                  Ouvrir le cours
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 2. Quizzes Tab */}
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

        {/* 3. Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-gray-600 font-bold">Titre du document</th>
                  <th className="px-6 py-4 text-gray-600 font-bold">Type</th>
                  <th className="px-6 py-4 text-gray-600 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {module.documents?.map(doc => (
                  <tr key={doc.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{doc.titre}</td>
                    <td className="px-6 py-4 text-gray-500 uppercase text-xs font-bold">{doc.type}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 font-bold hover:underline">Télécharger</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Empty State */}
        {((activeTab === 'lessons' && module.lessons?.length === 0) || 
          (activeTab === 'quizzes' && module.quizzes?.length === 0) ||
          (activeTab === 'documents' && module.documents?.length === 0)) && (
          <div className="text-center py-20">
            <p className="text-gray-400">Aucun contenu disponible pour le moment.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ModuleDetail;