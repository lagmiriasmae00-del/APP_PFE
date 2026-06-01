import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ModulesList = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/my-modules')
      .then(res => {
        setModules(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center text-blue-600 font-bold">Chargement de vos modules...</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8"> Mes Modules</h1>
      
      {modules.length === 0 ? (
        <div className="bg-gray-50 p-12 rounded-2xl text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">Aucun module n'est disponible pour votre filière et niveau pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Module
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {module.titre}
                </h3>
                <Link 
                  to={`/module/${module.id}`}
                  className="inline-flex items-center text-blue-600 font-bold hover:gap-2 transition-all"
                >
                  Voir le contenu <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModulesList;