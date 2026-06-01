import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';



import Header from './components/Header';
import Footer from './components/Footer';



import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ModulesList from './pages/ModulesList';
import ModuleDetail from './pages/ModuleDetail';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import Profile from './pages/Profile';



import AdminDashboard from './pages/admin/AdminDashboard';
import ModulesAdmin from './pages/admin/ModulesAdmin';
import QuizzesAdmin from './pages/admin/QuizzesAdmin';
import DocumentsAdmin from './pages/admin/DocumentsAdmin';
import FilieresAdmin from './pages/admin/FilieresAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';
import LessonsAdmin from './pages/admin/LessonsAdmin';



const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-gray-50/50">
    <Header />
    <main className="flex-grow w-full">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const role = user?.profile?.role;

  return (
    <Router>
      <Routes>
        {}
        <Route path="/" element={<PublicLayout />}>
          
          {}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />

          {}
          <Route 
            path="login" 
            element={!isAuthenticated ? <Login /> : <Navigate to={role === 'admin' ? "/admin" : "/dashboard"} replace />} 
          />
          <Route 
            path="register" 
            element={!isAuthenticated ? <Register /> : <Navigate to={role === 'admin' ? "/admin" : "/dashboard"} replace />} 
          />

          {}
          <Route path="dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="modules" element={isAuthenticated ? <ModulesList /> : <Navigate to="/login" replace />} />
          <Route path="module/:id" element={isAuthenticated ? <ModuleDetail /> : <Navigate to="/login" replace />} />
          <Route path="lesson/:id" element={isAuthenticated ? <LessonPage /> : <Navigate to="/login" replace />} />
          <Route path="quiz/:id" element={isAuthenticated ? <QuizPage /> : <Navigate to="/login" replace />} />
          <Route path="profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />

          {}
          <Route path="admin" element={isAuthenticated && role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" replace />} />
          <Route path="admin/modules" element={isAuthenticated && role === 'admin' ? <ModulesAdmin /> : <Navigate to="/dashboard" replace />} />
          <Route path="admin/quizzes" element={isAuthenticated && role === 'admin' ? <QuizzesAdmin /> : <Navigate to="/dashboard" replace />} />
          <Route path="admin/documents" element={isAuthenticated && role === 'admin' ? <DocumentsAdmin /> : <Navigate to="/dashboard" replace />} />
          <Route path="admin/filieres" element={isAuthenticated && role === 'admin' ? <FilieresAdmin /> : <Navigate to="/dashboard" replace />} />
          <Route path="admin/users" element={isAuthenticated && role === 'admin' ? <UsersAdmin /> : <Navigate to="/dashboard" replace />} />
          <Route path="admin/lessons" element={isAuthenticated && role === 'admin' ? <LessonsAdmin /> : <Navigate to="/dashboard" replace />} />

          {}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;