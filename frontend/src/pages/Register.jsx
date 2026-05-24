import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  // 1. State باش نخزنو فيها الشعب لي غيجيو من الداتابيز
  const [filieres, setFilieres] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    nom: '', 
    prenom: '', 
    filiere_id: '', // غنخليوها خاوية في الأول حيت غتغمر من بعد
    niveau: '1'
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 2. useEffect باش نجيبو الشعب أول ما تحل الصفحة
  useEffect(() => {
    api.get('/filieres')
      .then(res => {
        setFilieres(res.data);
        // أوتوماتيكياً كنختارو أول شعبة رجعات من الداتابيز كقيمة بدئية
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, filiere_id: res.data[0].id }));
        }
      })
      .catch(err => console.error("Erreur lors du chargement des filières", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await api.post('/register', formData);
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setErrorMsg(firstError);
      } else {
        setErrorMsg("Vérifiez vos données (Email unique / Password 8 chars)");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        
        <h2 className="text-3xl font-black mb-2 text-center text-gray-800 tracking-tight">Créer un compte</h2>
        <p className="text-center text-gray-400 text-sm mb-8">Rejoignez EduLink dès aujourd'hui</p>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nom & Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom</label>
              <input name="nom" type="text" placeholder="Ghanem" className="w-full p-3 border border-gray-200 rounded-xl outline-none font-medium" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prénom</label>
              <input name="prenom" type="text" placeholder="Asmae" className="w-full p-3 border border-gray-200 rounded-xl outline-none font-medium" onChange={handleChange} required />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom d'utilisateur</label>
            <input name="name" type="text" placeholder="asmae_gh" className="w-full p-3 border border-gray-200 rounded-xl outline-none font-medium" onChange={handleChange} required />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresse Email</label>
            <input name="email" type="email" placeholder="name@example.com" className="w-full p-3 border border-gray-200 rounded-xl outline-none font-medium" onChange={handleChange} required />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mot de passe</label>
            <input name="password" type="password" placeholder="••••••••" className="w-full p-3 border border-gray-200 rounded-xl outline-none font-medium" onChange={handleChange} required />
          </div>
          
          {/* Filière الديناميكية */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Filière</label>
            <select 
              name="filiere_id" 
              value={formData.filiere_id} 
              className="w-full p-3 border border-gray-200 rounded-xl bg-white outline-none font-medium" 
              onChange={handleChange} 
              required
            >
              {/* هنا كيدور الفتيل على الشعب اللي جاو من الداتابيز */}
              {filieres.length === 0 ? (
                <option>Chargement des filières...</option>
              ) : (
                filieres.map(filiere => (
                  <option key={filiere.id} value={filiere.id}>
                    {filiere.nom}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Niveau */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Niveau</label>
            <select name="niveau" value={formData.niveau} className="w-full p-3 border border-gray-200 rounded-xl bg-white outline-none font-medium" onChange={handleChange}>
              <option value="1">1ère année</option>
              <option value="2">2ème année</option>
            </select>
          </div>

          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-xl font-bold hover:opacity-95 shadow-lg transition-all">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;