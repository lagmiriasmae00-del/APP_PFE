import React from 'react';
import api from '../api/axios';

const DocumentSection = ({ documents }) => {

  const handleDownload = async (fileId, buttonName) => {
    try {
      const response = await api.get(`/files/${fileId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${buttonName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert("Erreur lors du téléchargement");
    }
  };

  return (
    <div className="space-y-6">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">{doc.titre}</h3>
            <p className="text-xs text-gray-400">Année: {doc.year} | Type: {doc.type}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {doc.files && doc.files.map((file) => (
              <button
                key={file.id}
                onClick={() => handleDownload(file.id, doc.titre + '_' + file.file_type)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
              >
                📄 Télécharger {file.file_type}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentSection;
