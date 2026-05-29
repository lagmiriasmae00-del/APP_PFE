import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const QuizzesAdmin = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [questions, setQuestions] = useState([]);

  // 🛠️ تصحيح الـ URL: حيدنا /admin/ ورجعناها غير /quizzes
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/quizzes');
      setQuizzes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMessage({ text: 'Erreur lors du chargement des quizzes.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 🛠️ تصحيح الـ URL: حيدنا /admin/ ورجعناها غير /modules
  const fetchModules = async () => {
    try {
      const res = await api.get('/admin/modules');
      setModules(Array.isArray(res.data) ? res.data : []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchQuizzes();
    fetchModules();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const openAddModal = () => {
    setEditingQuiz(null);
    setTitre('');
    setDescription('');
    setModuleId(modules.length > 0 ? modules[0].id : '');
    setQuestions([{ question: '', point: 1, choices: [{ text_choix: '', est_correcte: true }, { text_choix: '', est_correcte: false }] }]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', point: 1, choices: [{ text_choix: '', est_correcte: true }, { text_choix: '', est_correcte: false }] }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQ = [...questions];
    newQ[index][field] = value;
    setQuestions(newQ);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleAddChoice = (qIndex) => {
    const newQ = [...questions];
    newQ[qIndex].choices.push({ text_choix: '', est_correcte: false });
    setQuestions(newQ);
  };

  const handleChoiceChange = (qIndex, cIndex, field, value) => {
    const newQ = [...questions];
    if (field === 'est_correcte') {
      newQ[qIndex].choices.forEach((c, i) => {
        c.est_correcte = (i === cIndex) ? value : false;
      });
    } else {
      newQ[qIndex].choices[cIndex][field] = value;
    }
    setQuestions(newQ);
  };

  const handleRemoveChoice = (qIndex, cIndex) => {
    const newQ = [...questions];
    newQ[qIndex].choices = newQ[qIndex].choices.filter((_, i) => i !== cIndex);
    setQuestions(newQ);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      titre,
      module_id: moduleId,
      questions
    };

    try {
      if (editingQuiz) {
        await api.put(`/quizzes/${editingQuiz.id}`, data);
        setMessage({ text: '✅ Quiz modifié avec succès !', type: 'success' });
      } else {
        await api.post('/quizzes', data);
        setMessage({ text: '✅ Quiz créé avec succès ! Les questions ont été sauvegardées.', type: 'success' });
      }
      
      closeModal();
      fetchQuizzes();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Erreur lors de la sauvegarde.';
      setMessage({ text: errMsg, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce quiz ?")) {
      try {
        await api.delete(`/quizzes/${id}`);
        fetchQuizzes();
      } catch (err) {
        setMessage({ text: 'Erreur lors de la suppression.', type: 'error' });
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {message.text && (
          <div className={`fixed top-6 right-6 z-[60] px-6 py-3 rounded-xl shadow-lg text-white font-medium text-sm transition-all duration-300 ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              🧠 Gestion des Quizzes
              <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">{quizzes.length}</span>
            </h1>
            <p className="text-gray-500 mt-1">Créez des QCM interactifs pour vos stagiaires.</p>
          </div>
          <button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2">
            + Ajouter un Quiz
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Titre du Quiz</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Module associé</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quizzes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">Aucun quiz trouvé.</td>
                </tr>
              ) : (
                quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{quiz.titre}</td>
                    <td className="px-6 py-4 text-gray-600">{quiz.module?.titre || quiz.module?.nom || '—'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(quiz.id)} className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors" title="Supprimer">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
            <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl z-10">
              
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">{editingQuiz ? 'Modifier le Quiz' : 'Créer un Nouveau Quiz'}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <form id="quiz-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre du Quiz</label>
                      <input type="text" value={titre} onChange={e => setTitre(e.target.value)} required className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: QCM React JS" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Module</label>
                      <select value={moduleId} onChange={e => setModuleId(e.target.value)} required className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                        <option value="">-- Sélectionner --</option>
                        {modules.map(m => <option key={m.id} value={m.id}>{m.titre || m.nom}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Questions ({questions.length})</h3>
                      <button type="button" onClick={handleAddQuestion} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-200 transition-colors">
                        + Ajouter Question
                      </button>
                    </div>

                    {questions.map((q, qIndex) => (
                      <div key={qIndex} className="bg-gray-50 border border-gray-200 p-5 rounded-2xl mb-6 relative">
                        <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="absolute top-3 right-4 text-red-400 hover:text-red-600 font-bold" title="Supprimer la question">✕</button>
                        
                        <div className="grid grid-cols-4 gap-4 mb-5">
                          <div className="col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question {qIndex + 1}</label>
                            <input type="text" value={q.question} onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Quelle est la capitale du..." />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Points</label>
                            <input type="number" value={q.point} onChange={e => handleQuestionChange(qIndex, 'point', e.target.value)} required min="1" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                          </div>
                        </div>

                        <div className="pl-4 border-l-2 border-indigo-200 ml-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Choix de réponses (Cochez la bonne)</label>
                          {q.choices.map((c, cIndex) => (
                            <div key={cIndex} className="flex items-center gap-3 mb-2">
                              <input type="radio" name={`correct_${qIndex}`} checked={c.est_correcte} onChange={e => handleChoiceChange(qIndex, cIndex, 'est_correcte', e.target.checked)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                              <input type="text" value={c.text_choix} onChange={e => handleChoiceChange(qIndex, cIndex, 'text_choix', e.target.value)} required className={`flex-1 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${c.est_correcte ? 'bg-indigo-50 border-indigo-300' : 'bg-white'}`} placeholder={`Choix ${cIndex + 1}`} />
                              {q.choices.length > 2 && (
                                <button type="button" onClick={() => handleRemoveChoice(qIndex, cIndex)} className="text-red-400 hover:text-red-600 font-bold p-1">✕</button>
                              )}
                            </div>
                          ))}
                          <button type="button" onClick={() => handleAddChoice(qIndex)} className="text-xs text-indigo-600 font-bold mt-2 hover:underline">
                            + Ajouter une option
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
              </div>

              <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">Annuler</button>
                <button type="submit" form="quiz-form" className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg transition-all">Enregistrer le Quiz</button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesAdmin;