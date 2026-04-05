import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function SelectLevel() {
  const { selectLevel } = useAppContext();
  const navigate = useNavigate();

  const handleSelect = (level) => {
    selectLevel(level);
    navigate('/dashboard');
  };

  const levels = [
    { id: '1BAC', name: '1ère Année Baccalauréat', desc: 'Préparation aux examens régionaux', color: 'bg-primary-100 text-primary-600' },
    { id: '2BAC', name: '2ème Année Baccalauréat', desc: 'Préparation au diplôme final du Bac', color: 'bg-success text-white' },
    { id: 'TRONC_COMMUN', name: 'Tronc Commun', desc: 'La base du lycée', color: 'bg-warning text-slate-800' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 bg-white rounded-3xl shadow-xl mb-6 text-primary-600 border"
          >
            <GraduationCap size={48} />
          </motion.div>
          <h1 className="text-4xl font-outfit font-bold text-slate-800 mb-2">Choisissez votre niveau</h1>
          <p className="text-slate-500 text-lg text-inter">Adaptez votre expérience d'apprentissage à votre parcours scolaire.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {levels.map((lvl, index) => (
            <motion.button
              key={lvl.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(lvl.id)}
              className="group bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all text-left border border-slate-100 flex flex-col items-start active:translate-y-2 active:shadow-none duration-100"
            >
              <div className={`${lvl.color} p-3 rounded-2xl mb-6 font-bold text-xl`}>
                {lvl.id}
              </div>
              <h3 className="text-xl font-bold font-outfit text-slate-800 mb-2">{lvl.name}</h3>
              <p className="text-slate-500 mb-6 flex-1">{lvl.desc}</p>
              
              <div className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors ${lvl.color}`}>
                Choisir <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
