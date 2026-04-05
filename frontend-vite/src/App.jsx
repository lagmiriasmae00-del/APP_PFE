import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectLevel from './pages/SelectLevel';
import Dashboard from './pages/Dashboard';
import Subject from './pages/Subject';
import Module from './pages/Module';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import Exam from './pages/Exam';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="select-level" element={<SelectLevel />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="subject/:id" element={<Subject />} />
              <Route path="module/:subId/:modId" element={<Module />} />
              <Route path="lesson/:subId/:modId/:lesId" element={<Lesson />} />
              <Route path="quiz/:id" element={<Quiz />} />
              <Route path="exam/:id" element={<Exam />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
