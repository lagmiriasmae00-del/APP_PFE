import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Lazy load pages for performance
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const SelectLevel = React.lazy(() => import('./pages/SelectLevel'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Subject = React.lazy(() => import('./pages/Subject'));
const Module = React.lazy(() => import('./pages/Module'));
const Lesson = React.lazy(() => import('./pages/Lesson'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Exam = React.lazy(() => import('./pages/Exam'));

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingFallback />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingFallback />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Global Loading Fallback for Suspense Component Load
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              {/* Protected Routes inside MainLayout */}
              <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="select-level" element={<SelectLevel />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="subject/:id" element={<Subject />} />
                <Route path="module/:subId/:modId" element={<Module />} />
                <Route path="lesson/:subId/:modId/:lesId" element={<Lesson />} />
                <Route path="quiz/:id" element={<Quiz />} />
                <Route path="exam/:id" element={<Exam />} />
              </Route>
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
