/* eslint-disable */
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

// هاد الكومبوننت ديال إدارة الامتحانات (EFM/EFF) فالـ Admin Panel
const ExamensAdmin = () => {
  // =================== State ديال الكومبوننت ===================
  const [examens, setExamens] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExamen, setEditingExamen] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  // =================== State ديال الفورم ===================
  const [titre, setTitre] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [type, setType] = useState('EFM');
  const [fichierUrl, setFichierUrl] = useState('');

  // جلب قائمة الامتحانات (Quizzes)
  const fetchExamens = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/quizzes');
      setExamens(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erreur lors du chargement des examens.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // جلب قائمة الموديلات باش نستعملوها فالـ Select
  const fetchModules = async () => {
    try {
      const res = await api.get('/admin/modules');
      // modules data is a plain array from the admin route
      setModules(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erreur lors du chargement des modules.', type: 'error' });
    }
  };

  // =================== جلب البيانات من الـ API ===================
  useEffect(() => {
    fetchExamens();
    fetchModules();
  }, []);

  // كيخبّي الرسالة بعد 3 ثواني أوتوماتيكياً
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // =================== فتح الـ Modal للإضافة أو التعديل ===================
  const openAddModal = () => {
    setEditingExamen(null);
    setTitre('');
    setModuleId('');
    setAnnee(new Date().getFullYear());
    setType('EFM');
    setFichierUrl('');
    setShowModal(true);
  };

  const openEditModal = (examen) => {
    setEditingExamen(examen);
    setTitre(examen.titre);
    setModuleId(examen.module_id);
    setAnnee(examen.annee);
    setType(examen.type);
    setFichierUrl(examen.fichier_url || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExamen(null);
  };

  // =================== إرسال الفورم (إضافة / تعديل) ===================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      titre,
      module_id: moduleId,
      annee,
      type,
      fichier_url: fichierUrl,
    };

    try {
      if (editingExamen) {
        // تعديل الامتحان (quiz)
        await api.put(`/quizzes/${editingExamen.id}`, data);
        setMessage({ text: 'Examen modifié avec succès !', type: 'success' });
      } else {
        // إضافة امتحان جديد (quiz)
        await api.post('/quizzes', data);
        setMessage({ text: 'Examen ajouté avec succès !', type: 'success' });
      }
      closeModal();
      fetchExamens();
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || 'Une erreur est survenue.',
        type: 'error',
      });
    }
  };

  // =================== حذف الامتحان ===================
  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/quizzes/${deletingId}`);
      setMessage({ text: 'Examen supprimé avec succès !', type: 'success' });
      setShowDeleteConfirm(false);
      setDeletingId(null);
      fetchExamens();
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || 'Erreur lors de la suppression.',
        type: 'error',
      });
      setShowDeleteConfirm(false);
    }
  };

  // =================== Spinner ديال التحميل ===================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* =================== رسالة النجاح أو الخطأ (Toast) =================== */}
        {message.text && (
          <div
            className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-medium text-sm transition-all duration-300 ${
              message.type === 'success'
                ? 'bg-green-500'
                : 'bg-red-500'
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

        {/* =================== Header Section =================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              📝 Gestion des Examens
              <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
                {examens.length}
              </span>
            </h1>
            <p className="text-gray-500 mt-1">
              Gérez les examens de fin de module (EFM) et de fin de formation (EFF).
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un Examen
          </button>
        </div>

        {/* =================== الجدول ديال الامتحانات =================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {examens.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-semibold">Aucun examen trouvé</p>
              <p className="text-sm mt-1">Commencez par ajouter un examen.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Titre</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Module</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Année</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {examens.map((examen, index) => (
                    <tr
                      key={examen.id}
                      className="hover:bg-indigo-50/40 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{examen.titre}</p>
                        {examen.fichier_url && (
                          <a
                            href={examen.fichier_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-500 hover:underline mt-0.5 inline-block"
                          >
                            Voir le fichier ↗
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {examen.module?.titre || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {examen.annee}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            examen.type === 'EFM'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {examen.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* زر التعديل */}
                          <button
                            onClick={() => openEditModal(examen)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors duration-150"
                            title="Modifier"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* زر الحذف */}
                          <button
                            onClick={() => confirmDelete(examen.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors duration-150"
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
          )}
        </div>

        {/* =================== Modal ديال الإضافة / التعديل =================== */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* الخلفية المعتمة */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            ></div>

            {/* محتوى الـ Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 z-10">
              {/* Header ديال الـ Modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingExamen ? '✏️ Modifier l\'examen' : '➕ Ajouter un examen'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* الفورم */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Titre de l'examen
                  </label>
                  <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="Ex: EFM Développement Web 2026"
                    required
                  />
                </div>

                {/* Module */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Module
                  </label>
                  <select
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm bg-white"
                    required
                  >
                    <option value="">-- Sélectionner un module --</option>
                    {modules.map((mod) => (
                      <option key={mod.id} value={mod.id}>
                        {mod.titre || mod.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Année و Type فنفس السطر */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Année
                    </label>
                    <input
                      type="number"
                      value={annee}
                      onChange={(e) => setAnnee(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="2026"
                      min="2000"
                      max="2099"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm bg-white"
                      required
                    >
                      <option value="EFM">EFM</option>
                      <option value="EFF">EFF</option>
                    </select>
                  </div>
                </div>

                {/* Fichier URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Lien du fichier
                  </label>
                  <input
                    type="text"
                    value={fichierUrl}
                    onChange={(e) => setFichierUrl(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="https://exemple.com/fichier.pdf"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-150"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {editingExamen ? 'Enregistrer' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =================== Modal ديال تأكيد الحذف =================== */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* الخلفية المعتمة */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(false)}
            ></div>

            {/* محتوى الـ Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer cet examen ? Cette action est irréversible.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-150"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExamensAdmin;
