import React, { useEffect, useState } from 'react';
import api from '../../api/axios';


import { 
  Users, 
  Trash2, 
  AlertTriangle, 
  Inbox, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      const userData = res.data?.data ?? res.data;
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erreur lors du chargement des utilisateurs.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await api.delete(`/users/${deletingId}`);
      setMessage({ text: 'Utilisateur supprimé avec succès !', type: 'success' });
      setShowDeleteConfirm(false);
      setDeletingId(null);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Erreur lors de la suppression.';
      setMessage({ text: errorMsg, type: 'error' });
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {}
        {message.text && (
          <div className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium shadow-sm flex items-center gap-2 transition-all duration-300 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
            <span>{message.text}</span>
          </div>
        )}

        {}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {}
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm border border-emerald-100">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion des Utilisateurs</h1>
              <p className="text-gray-500 text-sm mt-0.5">Gérez les comptes des utilisateurs (stagiaires et administrateurs)</p>
            </div>
            <span className="ml-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
              {users.length}
            </span>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="p-4 bg-gray-50 rounded-full text-gray-400 mb-4">
                <Inbox className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">Aucun utilisateur trouvé</h3>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">#</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom Complet</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className={`border-b border-gray-50 hover:bg-emerald-50/20 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-400">{index + 1}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm text-gray-600">{user.email}</span></td>
                    <td className="px-6 py-4">
                      {}
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role === 'admin' ? 'admin' : 'stagiaire'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => confirmDelete(user.id)}
                          className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border border-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowDeleteConfirm(false); setDeletingId(null); }}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-red-50 text-red-600 rounded-full mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
                <p className="text-sm text-gray-500 mb-6">Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</p>
                <div className="flex items-center gap-3 w-full">
                  <button onClick={() => { setShowDeleteConfirm(false); setDeletingId(null); }} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition cursor-pointer">Annuler</button>
                  <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition shadow-md cursor-pointer">Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersAdmin;