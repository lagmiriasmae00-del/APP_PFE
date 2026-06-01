
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ModulesAdmin = () => {
  const [modules, setModules] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [filiere_id, setFiliereId] = useState('');
  const [niveau, setNiveau] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/modules');
      setModules(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('خطأ فجلب الموديلات:', error);
      setMessage({ text: 'Erreur lors du chargement des modules.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  

  const fetchFilieres = async () => {
    try {
      const response = await api.get('/admin/filieres');
      setFilieres(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('خطأ فجلب الفيليارات:', error);
    }
  };

  useEffect(() => {
    fetchModules();
    fetchFilieres();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const openAddModal = () => {
    setEditingModule(null);
    setNom('');
    setDescription('');
    setFiliereId('');
    setNiveau('');
    setShowModal(true);
  };

  const openEditModal = (mod) => {
    setEditingModule(mod);
    setNom(mod.titre || mod.nom || ''); 

    setDescription(mod.description || '');
    setFiliereId(mod.filiere_id);
    setNiveau(mod.niveau);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingModule(null);
    setNom('');
    setDescription('');
    setFiliereId('');
    setNiveau('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { nom, titre: nom, description, filiere_id, niveau: parseInt(niveau) };

      if (editingModule) {
        await api.put(`/modules/${editingModule.id}`, data);
        setMessage({ text: 'Module modifié avec succès !', type: 'success' });
      } else {
        await api.post('/modules', data);
        setMessage({ text: 'Module ajouté avec succès !', type: 'success' });
      }

      closeModal();
      fetchModules();
    } catch (error) {
      console.error('خطأ فالإرسال:', error);
      setMessage({
        text: error.response?.data?.message || 'Une erreur est survenue.',
        type: 'error',
      });
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/modules/${deletingId}`);
      setMessage({ text: 'Module supprimé avec succès !', type: 'success' });
      setShowDeleteConfirm(false);
      setDeletingId(null);
      fetchModules();
    } catch (error) {
      console.error('خطأ فالحذف:', error);
      setMessage({
        text: error.response?.data?.message || 'Erreur lors de la suppression.',
        type: 'error',
      });
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      {message.text && (
        <div
          className={`fixed top-6 right-6 z-[60] px-6 py-3 rounded-xl shadow-lg text-white font-medium transition-all duration-300 ${
            message.type === 'success'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-red-500 to-rose-600'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Gestion des Modules
            </h1>
            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
              {modules.length}
            </span>
          </div>
          <p className="text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Gérez les modules de formation de la plateforme
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un Module
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Chargement des modules...</p>
        </div>
      ) : modules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Aucun module trouvé</h3>
          <p className="text-gray-400 mb-4">Commencez par ajouter votre premier module</p>
          <button
            onClick={openAddModal}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
          >
            + Ajouter un module
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Filière</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {modules.map((mod, index) => (
                  <tr key={mod.id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-400">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{mod.titre || mod.nom}</p>
                        {mod.description && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{mod.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
                        {mod.filiere?.nom || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium">
                        {mod.niveau === 1 ? '1ère année' : '2ème année'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => openEditModal(mod)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => confirmDelete(mod.id)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-150"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {editingModule ? 'Modifier le Module' : 'Ajouter un Module'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nom du module <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Décrivez le contenu du module..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Filière <span className="text-red-400">*</span>
                </label>
                <select
                  value={filiere_id}
                  onChange={(e) => setFiliereId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm bg-white"
                >
                  <option value="">— Sélectionner une filière —</option>
                  {filieres.map((filiere) => (
                    <option key={filiere.id} value={filiere.id}>
                      {filiere.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Niveau <span className="text-red-400">*</span>
                </label>
                <select
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm bg-white"
                >
                  <option value="">— Sélectionner le niveau —</option>
                  <option value={1}>1ère année</option>
                  <option value={2}>2ème année</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
                >
                  {editingModule ? 'Enregistrer les modifications' : 'Ajouter le module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Confirmer la suppression
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 transition-all duration-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesAdmin;