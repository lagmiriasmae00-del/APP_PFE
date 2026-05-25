/* eslint-disable */
// صفحة إدارة الموارد التعليمية (Documents) - CRUD
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const DocumentsAdmin = () => {
  const [documents, setDocuments] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  
  // Form State
  const [titre, setTitre] = useState('');
  const [type, setType] = useState('pdf');
  const [url, setUrl] = useState('');
  const [module_id, setModuleId] = useState('');
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // محاكاة جلب البيانات
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // const response = await api.get('/api/admin/documents');
      // setDocuments(response.data);
      
      // بيانات وهمية مؤقتا
      setTimeout(() => {
        setDocuments([
          { id: 1, titre: 'Cours React JS', type: 'pdf', url: 'react_cours.pdf', module: { nom: 'Développement Frontend' } },
          { id: 2, titre: 'Introduction à Node.js', type: 'video', url: 'https://youtube.com/...', module: { nom: 'Développement Backend' } }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('خطأ فجلب الوثائق:', error);
      setMessage({ text: 'Erreur lors du chargement des documents.', type: 'error' });
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      // const response = await api.get('/api/admin/modules');
      // setModules(response.data);
      
      // بيانات وهمية
      setModules([
        { id: 1, nom: 'Développement Frontend' },
        { id: 2, nom: 'Développement Backend' }
      ]);
    } catch (error) {
      console.error('خطأ فجلب الموديلات:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchModules();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const openAddModal = () => {
    setEditingDoc(null);
    setTitre('');
    setType('pdf');
    setUrl('');
    setModuleId('');
    setShowModal(true);
  };

  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setTitre(doc.titre);
    setType(doc.type);
    setUrl(doc.url);
    setModuleId(doc.module_id || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDoc(null);
    setTitre('');
    setType('pdf');
    setUrl('');
    setModuleId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { titre, type, url, module_id };

      if (editingDoc) {
        // await api.put(`/api/admin/documents/${editingDoc.id}`, data);
        setMessage({ text: 'Document modifié avec succès !', type: 'success' });
      } else {
        // await api.post('/api/admin/documents', data);
        setMessage({ text: 'Document ajouté avec succès !', type: 'success' });
      }

      closeModal();
      fetchDocuments();
    } catch (error) {
      console.error('خطأ فالإرسال:', error);
      setMessage({ text: 'Une erreur est survenue.', type: 'error' });
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      // await api.delete(`/api/admin/documents/${deletingId}`);
      setMessage({ text: 'Document supprimé avec succès !', type: 'success' });
      setShowDeleteConfirm(false);
      setDeletingId(null);
      fetchDocuments();
    } catch (error) {
      console.error('خطأ فالحذف:', error);
      setMessage({ text: 'Erreur lors de la suppression.', type: 'error' });
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Toast Messages */}
      {message.text && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-medium transition-all duration-300 ${message.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
          <div className="flex items-center gap-2">{message.text}</div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Gestion des Documents</h1>
            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">{documents.length}</span>
          </div>
          <p className="text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Gérez les ressources pédagogiques (PDF, Vidéos)</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Ajouter un Document
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Aucun document trouvé</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Titre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Module</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-gray-800">{doc.titre}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium ${doc.type === 'pdf' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                        {doc.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{doc.module?.nom}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(doc)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">Modifier</button>
                        <button onClick={() => confirmDelete(doc.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in">
            <h2 className="text-xl font-bold mb-6">{editingDoc ? 'Modifier le Document' : 'Ajouter un Document'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Titre *</label>
                <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required className="w-full px-4 py-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Type *</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl bg-white">
                  <option value="pdf">PDF</option>
                  <option value="video">Vidéo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">URL / Fichier *</label>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required className="w-full px-4 py-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Module *</label>
                <select value={module_id} onChange={(e) => setModuleId(e.target.value)} required className="w-full px-4 py-2.5 border rounded-xl bg-white">
                  <option value="">Sélectionner un module</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Annuler</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-bold mb-2">Confirmer la suppression</h3>
            <p className="text-gray-500 mb-6">Êtes-vous sûr ?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-semibold">Annuler</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsAdmin;
