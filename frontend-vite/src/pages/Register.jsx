import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, GraduationCap, Calendar, BookOpen, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('');
  const [sector, setSector] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !year || !sector) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    // Passing the additional info is optional but user will be registered
    const res = await register(name, email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/select-level', { replace: true });
    } else {
      setError(res.error || 'Erreur d\'inscription');
    }
  };

  const yearOptions = [
    { value: '', label: 'Sélectionnez une année' },
    { value: '1', label: '1ère Année' },
    { value: '2', label: '2ème Année' },
    { value: '3', label: '3ème Année' }
  ];

  const sectorOptions = [
    { value: '', label: 'Sélectionnez une filière' },
    { value: 'DD', label: 'Développement Digital' },
    { value: 'ID', label: 'Infrastructure Digitale' },
    { value: 'GE', label: 'Gestion des Entreprises' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-950 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-primary-900">
          <Logo size={160} />
        </div>
        
        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="mb-3 text-primary-900">
             <Logo size={80} />
          </div>
          <h1 className="text-3xl font-outfit font-bold text-slate-800">SmartLearn</h1>
          <p className="text-slate-500 mb-3">Commencez votre apprentissage</p>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold">
            <Award size={14} className="text-primary-600" />
            Niveau : Technicien Spécialisé
          </div>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium border border-red-100 text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <Input 
            label="Nom complet"
            type="text"
            icon={User}
            placeholder="Ex: Ahmed"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Année d'étude"
              icon={Calendar}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              options={yearOptions}
              required
            />
            <Select
              label="Filière"
              icon={BookOpen}
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              options={sectorOptions}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white border-transparent" 
            isLoading={isLoading}
          >
            S'inscrire
          </Button>
        </form>

        <p className="text-center mt-6 text-slate-600 text-sm relative z-10">
          Vous avez déjà un compte ? 
          <Link to="/login" className="text-primary-600 font-bold hover:underline ml-1">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
