/* eslint-disable */
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const DocumentsAdmin = () => {
  const [documents, setDocuments] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [filieres, setFilieres] = useState([]);
  
  const [titre, setTitre] = useState('');
  const [type, setType] = useState('efm');
  const [niveau, setNiveau] = useState('1');
  const [year, setYear] = useState(new Date().getFullYear());
  const [filiere_id, setFiliereId] = useState('');
  const [module_id, setModuleId] = useState('');
  const [file, setFile] = useState(null);
  const [file_type, setFileType] = useState('Exercice');
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/documents');
      setDocuments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ text: 'Erreur lors du chargement des documents.', type: 'error' });
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await api.get('/admin/modules');
      setModules(response.data);
    } catch (error) {
      console.error('Erreur chargement modules:', error);
    }
  };

  const fetchFilieres = async () => {
    try {
      const response = await api.get('/filieres');
      setFilieres(response.data);
    } catch (error) {
      console.error('Erreur chargement filières:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
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
    setEditingDoc(null);
    setTitre('');
    setType('efm');
    setNiveau('1');
    setYear(new Date().getFullYear());
    setFiliereId(filieres.length > 0 ? filieres[0].id : '');
    setModuleId(modules.length > 0 ? modules[0].id : '');
    setFile(null);
    setFileType('Exercice');
    setShowModal(true);
  };

  const openEditModal = (doc) => {
    alert("La modification n'est pas encore supportée par le backend.");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDoc(null);
    setTitre('');
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ text: 'Veuillez sélectionner un fichier PDF.', type: 'error' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('type', type);
      formData.append('niveau', niveau);
      formData.append('year', year);
      formData.append('filiere_id', filiere_id);
      formData.append('module_id', module_id);
      formData.append('file_type', file_type);
      formData.append('file', file);

      if (!editingDoc) {
        await api.post('/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ text: 'Document ajouté avec succès !', type: 'success' });
      }

      closeModal();
      fetchDocuments();
    } catch (error) {
      console.error('Erreur:', error);
      let errorMsg = 'Une erreur est survenue.';
      if (error.response?.data) {
        if (error.response.data.errors) {
          const firstKey = Object.keys(error.response.data.errors)[0];
          errorMsg = error.response.data.errors[firstKey][0];
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }
      setMessage({ text: errorMsg, type: 'error' });
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/documents/${deletingId}`);
      setMessage({ text: 'Document supprimé avec succès !', type: 'success' });
      setShowDeleteConfirm(false);
      setDeletingId(null);
      fetchDocuments();
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ text: 'Erreur lors de la suppression.', type: 'error' });
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      {message.text && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg text-white font-medium transition-all duration-300 ${message.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
          <div className="flex items-center gap-2">{message.text}</div>
        </div>
      )}

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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Infos</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Fichiers associés</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-gray-800">{doc.titre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{doc.module?.titre || doc.module?.nom}</span>
                        <span className="text-xs text-gray-500 uppercase">{doc.type} - N{doc.niveau} ({doc.annee || doc.year})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {doc.files && doc.files.length > 0 ? (
                          doc.files.map((docFile) => (
                            <a 
                              key={docFile.id} 
                              href={`http://localhost:8000/api/files/${docFile.id}/download`} 
                              target="_blank" 
                              rel="noreferrer"
                              className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 ${
                                docFile.file_type === 'Exercice' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                docFile.file_type === 'Correction' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              }`}
                              title="Télécharger"
                            >
                              ↓ {docFile.file_type}
                            </a>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">Aucun fichier</span>
                        )}
                      </div>
                    </td>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in">
            <h2 className="text-xl font-bold mb-6">{editingDoc ? 'Modifier le Document' : 'Ajouter un Document'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Titre du document *</label>
                  <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required placeholder="Ex: EFM React 2026" className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Type *</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} required className="w-full px-4 py-2.5 border rounded-xl bg-white">
                    <option value="cc">Contrôle Continu (CC)</option>
                    <option value="efm">EFM</option>
                    <option value="regional">Régional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Année *</label>
                  <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required className="w-full px-4 py-2.5 border rounded-xl" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Filière *</label>
                  <select value={filiere_id} onChange={(e) => setFiliereId(e.target.value)} required className="w-full px-4 py-2.5 border rounded-xl bg-white">
                    <option value="">Sélectionner une filière</option>
                    {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Niveau *</label>
                  <select value={niveau} onChange={(e) => setNiveau(e.target.value)} required className="w-full px-4 py-2.5 border rounded-xl bg-white">
                    <option value="1">1ère Année</option>
                    <option value="2">2ème Année</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Module associé *</label>
                  <select value={module_id} onChange={(e) => setModuleId(e.target.value)} required className="w-full px-4 py-2.5 border rounded-xl bg-white">
                    <option value="">Sélectionner un module</option>
                    {modules.map(m => <option key={m.id} value={m.id}>{m.titre || m.nom}</option>)}
                  </select>
                </div>

                <div className="col-span-2 border-t pt-4 mt-2">
                  <h3 className="font-bold text-gray-700 mb-3">Fichier à attacher</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Type du fichier *</label>
                      <select value={file_type} onChange={(e) => setFileType(e.target.value)} required className="w-full px-4 py-2.5 border rounded-xl bg-white">
                        <option value="Exercice">Épreuve / Exercice</option>
                        <option value="Correction">Correction</option>
                        <option value="Cours">Cours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Fichier PDF *</label>
                      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required={!editingDoc} className="w-full px-2 py-2 border rounded-xl text-sm" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Annuler</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
