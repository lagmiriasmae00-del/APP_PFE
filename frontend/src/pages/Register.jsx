import React, { useState } from 'react';
import api from '../api/axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', nom: '', prenom: '', filiere_id: '', niveau: '1'
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/register', formData);
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err) {
      alert("تأكد من البيانات (Email unique / Password 8 chars)");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input name="nom" placeholder="Nom" className="p-2 border rounded" onChange={(e) => setFormData({...formData, nom: e.target.value})} required />
          <input name="prenom" placeholder="Prénom" className="p-2 border rounded" onChange={(e) => setFormData({...formData, prenom: e.target.value})} required />
        </div>
        <input name="name" placeholder="Nom d'utilisateur" className="w-full p-2 mb-4 border rounded" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input name="email" type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input name="password" type="password" placeholder="Mot de passe" className="w-full p-2 mb-4 border rounded" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        
        <select className="w-full p-2 mb-4 border rounded" onChange={(e) => setFormData({...formData, filiere_id: e.target.value})} required>
          <option value="">Choisir la filière</option>
          <option value="1">Développement Digital</option>
          <option value="2">Gestion des Entreprises</option>
        </select>

        <select className="w-full p-2 mb-4 border rounded" onChange={(e) => setFormData({...formData, niveau: e.target.value})}>
          <option value="1">1ère année</option>
          <option value="2">2ème année</option>
        </select>

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;