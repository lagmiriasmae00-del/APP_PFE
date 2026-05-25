import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

// Pages - Public & Student
import Home from './pages/Home';           
import About from './pages/About';         
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ModulesList from './pages/ModulesList';
import ModuleDetail from './pages/ModuleDetail';
import Profile from './pages/Profile';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ModulesAdmin from './pages/admin/ModulesAdmin';
import ExamensAdmin from './pages/admin/ExamensAdmin';
import DocumentsAdmin from './pages/admin/DocumentsAdmin';

// Public Layout Component
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        
        {/* === Admin Routes === */}
        {/* For now, assuming anyone authenticated can access or we just protect it with isAuthenticated */}
        <Route path="/admin" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="modules" element={<ModulesAdmin />} />
          <Route path="quizzes" element={<ExamensAdmin />} />
          <Route path="documents" element={<DocumentsAdmin />} />
        </Route>

        {/* === Public & Student Routes === */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />

          <Route 
            path="login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="register" 
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
          />

          {/* Protected Routes */}
          <Route 
            path="dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="modules" 
            element={isAuthenticated ? <ModulesList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="module/:id" 
            element={isAuthenticated ? <ModuleDetail /> : <Navigate to="/login" />} 
          />
          <Route 
            path="profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;