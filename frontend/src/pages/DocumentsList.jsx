import React, { useEffect, useState } from 'react';
import { FileText, Loader2, BookOpen, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/my-documents');
        setDocuments(response.data);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les documents.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleDownload = async (fileId, fileName) => {
    setDownloading(fileId);
    try {
      const response = await api.get(`/files/${fileId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Erreur lors du téléchargement du fichier.');
    } finally {
      setDownloading(null);
    }
  };

  const handleView = async (fileId) => {
    setViewing(fileId);
    try {
      const response = await api.get(`/files/${fileId}/download`, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch {
      alert('Erreur lors de l\'ouverture du fichier.');
    } finally {
      setViewing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-4xl mb-2">⚠️</p>
        <h2 className="text-lg font-bold text-gray-900">Une erreur est survenue</h2>
        <p className="text-gray-500 text-xs mt-1 mb-6">{error}</p>
        <Link to="/dashboard" className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mes Documents & EFM</h1>
            <p className="text-gray-400 text-xs mt-1">Retrouvez tous les supports de cours et examens de votre filière.</p>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
            <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Aucun document disponible</h3>
            <p className="text-gray-500 text-sm mt-2">Les documents partagés par vos formateurs apparaîtront ici.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate" title={doc.titre}>{doc.titre}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 uppercase">
                        {doc.type}
                      </span>
                      {doc.module && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 truncate flex items-center gap-1 max-w-full">
                           <BookOpen className="w-3 h-3 shrink-0" />
                           <span className="truncate">{doc.module.titre}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {doc.files?.[0] && (
                  <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-end gap-2">
                    <button
                      disabled={viewing === doc.files[0].id}
                      onClick={() => handleView(doc.files[0].id)}
                      className="flex-1 bg-amber-50 hover:bg-amber-100 disabled:bg-gray-100 text-amber-700 text-xs font-bold py-2 rounded-lg transition disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {viewing === doc.files[0].id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                      Ouvrir
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsList;
