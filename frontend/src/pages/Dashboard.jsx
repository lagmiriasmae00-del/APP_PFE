import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    api.get('/get-stats') // تأكد من الـ Route فـ api.php
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">👋 مرحباً، {stats.user_name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 font-medium">الموديلات المتوفرة</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.modules_total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 font-medium">الامتحانات (Quizzes) المكتملة</h3>
          <p className="text-3xl font-bold text-green-600">{stats.quizzes_completed}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
          <h3 className="text-gray-500 font-medium">الوثائق و EFM</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.exams_total}</p>
        </div>
      </div>

      <div className="mt-10 bg-blue-50 p-6 rounded-xl text-blue-800">
         <p className="font-semibold">تذكير:</p>
         <p>أنت تدرس في شعبة {user?.profile?.filiere?.nom || 'تخصصك'} - المستوى {user?.profile?.niveau}.</p>
      </div>
    </div>
  );
};

export default Dashboard;