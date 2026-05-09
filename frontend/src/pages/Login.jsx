import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import api from '../api/axios'; // تأكد من مسار ملف axios
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err) {
      alert("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">EduLink - Login</h2>
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Se connecter</button>
        <p className="mt-4 text-center text-sm">Vous n'avez pas encore de compte ? <Link to="/register" className="text-blue-500">Inscrivez-vous maintenant</Link></p>
      </form>
    </div>
  );
};

export default Login;