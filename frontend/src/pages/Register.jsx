import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  Layers, 
  AlertCircle 
} from 'lucide-react';

const Register = () => {
  const [filieres, setFilieres] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    password_confirmation: '', 
    nom: '', 
    prenom: '', 
    filiere_id: '', 
    niveau: '1'
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/filieres')
      .then(res => {
        setFilieres(res.data);
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

    if (formData.password !== formData.password_confirmation) {
      setErrorMsg("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const res = await api.post('/register', formData);
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const firstError = Object.values(err.response.data.errors)[0];
        setErrorMsg(firstError);
      } else if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Vérifiez vos données (Email unique / Password 8 chars)");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50 p-4">
      {}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-xl">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Créer un compte</h2>
          <p className="text-gray-500 text-sm mt-1">Rejoignez EduLink dès aujourd'hui</p>
        </div>
        
        {errorMsg && (
          <div className="mb-4 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 🌟 السطر 1: Nom & Prénom مجموعة فـ Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nom</label>
              <input name="nom" value={formData.nom} type="text" placeholder="" className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none font-medium text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Prénom</label>
              <input name="prenom" value={formData.prenom} type="text" placeholder="" className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none font-medium text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" onChange={handleChange} required />
            </div>
          </div>

          {/* 🌟 السطر 2: Username & Email فـ نفس السطر باش نربحو المساحة وندمروا الـ Scroll */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nom d'utilisateur</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input name="name" value={formData.name} type="text" placeholder="" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl outline-none font-medium text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Adresse Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input name="email" value={formData.email} type="email" placeholder="" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl outline-none font-medium text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" onChange={handleChange} required />
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input name="password" value={formData.password} type="password" placeholder="••••••••" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl outline-none font-medium text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Confirmer le mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input name="password_confirmation" value={formData.password_confirmation} type="password" placeholder="••••••••" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl outline-none font-medium text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" onChange={handleChange} required />
              </div>
            </div>
          </div>
          
          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Filière</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <select name="filiere_id" value={formData.filiere_id} className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-xl bg-white outline-none font-medium text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition appearance-none" onChange={handleChange} required>
                  {filieres.length === 0 ? (
                    <option>Chargement...</option>
                  ) : (
                    filieres.map(filiere => (
                      <option key={filiere.id} value={filiere.id}>
                        {filiere.nom}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-[10px]">▼</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Niveau</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                  <Layers className="w-4 h-4" />
                </span>
                <select name="niveau" value={formData.niveau} className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-xl bg-white outline-none font-medium text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition appearance-none" onChange={handleChange}>
                  <option value="1">1ère année</option>
                  <option value="2">2ème année</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-[10px]">▼</div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition cursor-pointer text-sm">
              S'inscrire
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-emerald-600 hover:underline font-semibold">
                Connexion
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;