import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    
    if (res.success) {
      navigate('/select-level', { replace: true });
    } else {
      setError(res.error || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-[#133A5E]">
          <Logo size={160} />
        </div>
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="mb-4 text-[#133A5E]">
             <Logo size={80} />
          </div>
          <h1 className="text-3xl font-outfit font-bold text-slate-800">SmartLearn</h1>
          <p className="text-slate-500">Bienvenue sur votre plateforme</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium border border-red-100 text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <Input 
            label="Email"
            type="email"
            icon={Mail}
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Mot de passe"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button 
            type="submit" 
            className="w-full mt-2" 
            isLoading={isLoading}
          >
            Se connecter
          </Button>
        </form>

        <p className="text-center mt-6 text-slate-600 text-sm relative z-10">
          Vous n'avez pas de compte ? 
          <Link to="/register" className="text-primary-600 font-bold hover:underline ml-1">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
