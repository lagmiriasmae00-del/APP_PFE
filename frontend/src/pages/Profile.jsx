import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get('/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!profile) return <div className="text-center p-10">Chargement du profil...</div>;

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-center -mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-blue-600">
              {profile.profile.prenom[0]}{profile.profile.nom[0]}
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{profile.profile.prenom} {profile.profile.nom}</h1>
            <p className="text-gray-500 font-medium">{profile.email}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-500">Filière</span>
              <span className="font-bold text-gray-900">{profile.profile.filiere?.nom || 'N/A'}</span>
            </div>
            <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-500">Niveau</span>
              <span className="font-bold text-gray-900">{profile.profile.niveau === 1 ? '1ère année' : '2ème année'}</span>
            </div>
            <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-500">Rôle</span>
              <span className="font-bold text-blue-600 capitalize">{profile.profile.role}</span>
            </div>
          </div>

          <button 
            onClick={() => dispatch(logout())}
            className="w-full mt-10 bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
