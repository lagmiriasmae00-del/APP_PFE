/* eslint-disable */
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

// صفحة الأدمين ديال إدارة الفيليار (Filières)
const FilieresAdmin = () => {
  // الحالات ديال الكومبونون
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFiliere, setEditingFiliere] = useState(null);
  const [nom, setNom] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // فونكسيون باش نجيبو الفيليار كاملين
  const fetchFilieres = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/filieres');
      setFilieres(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erreur lors du chargement des filières.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // كنجيبو الفيليار من الـ API فاش كيتحمل الكومبونون
  useEffect(() => {
    fetchFilieres();
  }, []);

  // كنخبيو الرسالة أوتوماتيكياً بعد 3 ثواني
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // فونكسيون ديال الإضافة أو التعديل
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim()) return;

    try {
      setSubmitting(true);
      if (editingFiliere) {
        // تعديل فيليار موجودة
        await api.put(`/admin/filieres/${editingFiliere.id}`, { nom });
        setMessage({ text: 'Filière modifiée avec succès !', type: 'success' });
      } else {
        // إضافة فيليار جديدة
        await api.post('/admin/filieres', { nom });
        setMessage({ text: 'Filière ajoutée avec succès !', type: 'success' });
      }
      // نعاودو نجيبو الليستة ونسدو المودال
      await fetchFilieres();
      closeModal();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Une erreur est survenue.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // فونكسيون ديال الحذف
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await api.delete(`/admin/filieres/${deletingId}`);
      setMessage({ text: 'Filière supprimée avec succès !', type: 'success' });
      setShowDeleteConfirm(false);
      setDeletingId(null);
      await fetchFilieres();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Erreur lors de la suppression.';
      setMessage({ text: errorMsg, type: 'error' });
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  // كنفتحو المودال للإضافة
  const openAddModal = () => {
    setEditingFiliere(null);
    setNom('');
    setShowModal(true);
  };

  // كنفتحو المودال للتعديل
  const openEditModal = (filiere) => {
    setEditingFiliere(filiere);
    setNom(filiere.nom);
    setShowModal(true);
  };

  // كنسدو المودال
  const closeModal = () => {
    setShowModal(false);
    setEditingFiliere(null);
    setNom('');
  };

  // كنأكدو الحذف
  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  // سبينر ديال التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ==================== رسالة النجاح أو الخطأ ==================== */}
        {message.text && (
          <div
            className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium shadow-sm flex items-center gap-2 transition-all duration-300 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* ==================== الهيدر ==================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              🎓
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Gestion des Filières
              </h1>
              <p className="text-gray-500 mt-1">
                Gérez les filières de votre établissement
              </p>
            </div>
            <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
              {filieres.length}
            </span>
          </div>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">+</span>
            Ajouter une Filière
          </button>
        </div>

        {/* ==================== الجدول ==================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filieres.length === 0 ? (
            // حالة فارغة - ما كاين حتى فيليار
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">
                Aucune filière trouvée
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Commencez par ajouter votre première filière.
              </p>
              <button
                onClick={openAddModal}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition cursor-pointer"
              >
                + Ajouter une Filière
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                    #
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nom de la Filière
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filieres.map((filiere, index) => (
                  <tr
                    key={filiere.id}
                    className={`border-b border-gray-50 hover:bg-indigo-50/30 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-400">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">
                        {filiere.nom}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(filiere)}
                          className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition cursor-pointer"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => confirmDelete(filiere.id)}
                          className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition cursor-pointer"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ==================== المودال ديال الإضافة / التعديل ==================== */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* الخلفية المعتمة */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            ></div>

            {/* محتوى المودال */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
              {/* عنوان المودال */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl ${editingFiliere ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {editingFiliere ? '✏️' : '➕'}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingFiliere ? 'Modifier la Filière' : 'Ajouter une Filière'}
                </h2>
              </div>

              {/* الفورم */}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la Filière
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: Développement Digital"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-gray-400"
                    autoFocus
                    required
                  />
                </div>

                {/* أزرار المودال */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !nom.trim()}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                  >
                    {submitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {editingFiliere ? 'Enregistrer' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== المودال ديال تأكيد الحذف ==================== */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* الخلفية المعتمة */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeletingId(null);
              }}
            ></div>

            {/* محتوى مودال الحذف */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-red-50 rounded-full mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Confirmer la suppression
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Êtes-vous sûr de vouloir supprimer cette filière ? Cette action est irréversible.
                </p>
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletingId(null);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition shadow-md cursor-pointer"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FilieresAdmin;
