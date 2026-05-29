import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './LessonsAdmin.css';

const LessonsAdmin = () => {
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  
  // Form States
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [videos, setVideos] = useState([{ video_url: '', order: 1 }]);
  
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchLessons = async () => {
    try {
      const response = await api.get('/api/admin/lessons');
      setLessons(response.data);
    } catch (error) {
      console.error('Erreur de chargement des leçons:', error);
      setMessage({ text: 'Erreur lors du chargement des leçons.', type: 'error' });
    }
  };

  const fetchModules = async () => {
    try {
      const response = await api.get('/api/admin/modules');
      setModules(response.data);
    } catch (error) {
      console.error('Erreur de chargement des modules:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchLessons(), fetchModules()]).finally(() => setLoading(false));
  }, []);

  const openAddModal = () => {
    setEditingLesson(null);
    setTitre('');
    setContenu('');
    setModuleId(modules.length > 0 ? modules[0].id : '');
    setPdfFile(null);
    setVideos([{ video_url: '', order: 1 }]);
    setMessage({ text: '', type: '' });
    setShowModal(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setTitre(lesson.titre);
    setContenu(lesson.contenu || '');
    setModuleId(lesson.module_id);
    setPdfFile(null); // Keep null unless user uploads new file
    setVideos(lesson.videos?.length > 0 ? lesson.videos.map(v => ({ video_url: v.video_url, order: v.order })) : [{ video_url: '', order: 1 }]);
    setMessage({ text: '', type: '' });
    setShowModal(true);
  };

  const handleVideoChange = (index, value) => {
    const newVideos = [...videos];
    newVideos[index].video_url = value;
    setVideos(newVideos);
  };

  const addVideoField = () => {
    setVideos([...videos, { video_url: '', order: videos.length + 1 }]);
  };

  const removeVideoField = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    // Reorder
    newVideos.forEach((v, i) => { v.order = i + 1; });
    setVideos(newVideos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!titre || !moduleId) {
      setMessage({ text: 'Veuillez remplir les champs obligatoires (Titre, Module)', type: 'error' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('module_id', moduleId);
      if (contenu) formData.append('contenu', contenu);
      if (pdfFile) formData.append('pdf_file', pdfFile);

      // Filtering out empty videos
      const validVideos = videos.filter(v => v.video_url.trim() !== '');
      
      if (editingLesson) {
        // Update (Simulation since API expects PUT but with FormData we often need POST + _method=PUT)
        formData.append('_method', 'PUT');
        await api.post(`/api/lessons/${editingLesson.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ text: 'Leçon modifiée avec succès!', type: 'success' });
      } else {
        // Create
        validVideos.forEach((v, index) => {
          formData.append(`videos[${index}][video_url]`, v.video_url);
          formData.append(`videos[${index}][order]`, v.order);
        });
        await api.post('/api/lessons', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ text: 'Leçon ajoutée avec succès!', type: 'success' });
      }
      
      await fetchLessons();
      setTimeout(() => setShowModal(false), 1500);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ text: error.response?.data?.message || 'Une erreur est survenue.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette leçon ? Cette action supprimera aussi les vidéos associées.')) {
      try {
        await api.delete(`/api/lessons/${id}`);
        setMessage({ text: 'Leçon supprimée!', type: 'success' });
        fetchLessons();
      } catch (error) {
        setMessage({ text: 'Erreur lors de la suppression.', type: 'error' });
      }
    }
  };

  if (loading) {
    return <div className="loading-spinner">Chargement des leçons...</div>;
  }

  return (
    <div className="lessons-admin-container">
      <div className="lessons-header">
        <div>
          <h1 className="lessons-title">Gestion des Leçons</h1>
          <p className="lessons-subtitle">Gérez les leçons, les PDFs et les vidéos</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Ajouter Leçon
        </button>
      </div>

      {message.text && !showModal && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="lessons-table-card">
        <table className="lessons-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Module</th>
              <th>Ressources</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Aucune leçon trouvée.</td>
              </tr>
            ) : (
              lessons.map(lesson => (
                <tr key={lesson.id}>
                  <td>{lesson.id}</td>
                  <td><strong>{lesson.titre}</strong></td>
                  <td>{lesson.module?.nom || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {lesson.pdf_url && <span className="badge badge-pdf">PDF</span>}
                      {lesson.videos?.length > 0 && (
                        <span className="badge badge-video">{lesson.videos.length} Vidéo(s)</span>
                      )}
                      {!lesson.pdf_url && lesson.videos?.length === 0 && (
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Texte uniquement</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => openEditModal(lesson)}>Éditer</button>
                    <button className="btn-danger" onClick={() => handleDelete(lesson.id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingLesson ? 'Modifier la Leçon' : 'Ajouter une Leçon'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              {message.text && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}

              <form id="lesson-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Titre de la leçon *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={titre} 
                    onChange={(e) => setTitre(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Module associé *</label>
                  <select 
                    className="form-control" 
                    value={moduleId} 
                    onChange={(e) => setModuleId(e.target.value)}
                    required
                  >
                    <option value="">Sélectionner un module</option>
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>{m.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Contenu / Description</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    value={contenu} 
                    onChange={(e) => setContenu(e.target.value)} 
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Fichier PDF (Optionnel)</label>
                  {editingLesson && editingLesson.pdf_url && !pdfFile && (
                    <div style={{ marginBottom: '8px', fontSize: '13px', color: '#4338ca' }}>
                      Fichier actuel : {editingLesson.pdf_url.split('/').pop()}
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="form-control" 
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])} 
                  />
                </div>

                {!editingLesson && (
                  <div className="videos-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label className="form-label" style={{ margin: 0 }}>Vidéos (Optionnel)</label>
                      <button type="button" className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={addVideoField}>
                        + Ajouter Vidéo
                      </button>
                    </div>
                    
                    {videos.map((video, index) => (
                      <div key={index} className="video-item">
                        <span style={{ padding: '8px', background: '#e2e8f0', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{video.order}</span>
                        <input 
                          type="url" 
                          className="form-control" 
                          placeholder="URL YouTube / Vimeo..." 
                          value={video.video_url} 
                          onChange={(e) => handleVideoChange(index, e.target.value)} 
                        />
                        {videos.length > 1 && (
                          <button type="button" className="btn-danger" onClick={() => removeVideoField(index)}>✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {editingLesson && (
                  <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>
                    * Note : L'édition des vidéos se fait pour l'instant via la création. Pour changer les vidéos d'une leçon, il est recommandé de la recréer ou de demander une mise à jour de l'API d'édition des vidéos.
                  </div>
                )}
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                Annuler
              </button>
              <button type="submit" form="lesson-form" className="btn-primary">
                {editingLesson ? 'Enregistrer les modifications' : 'Créer la leçon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsAdmin;
