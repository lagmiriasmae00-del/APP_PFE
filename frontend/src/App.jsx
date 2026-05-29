import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

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
import QuizzesAdmin from './pages/admin/QuizzesAdmin';
import DocumentsAdmin from './pages/admin/DocumentsAdmin';
import FilieresAdmin from './pages/admin/FilieresAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';
import LessonsAdmin from './pages/admin/LessonsAdmin';

// القالب الموحد والوحيد للمنصة (بدون Sidebar جانبية) ✨
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
        
        {/* كاع الروابط (العامة، الطلبة، والأدمين) مجموعين تحت نفس الـ Layout النقي */}
        <Route path="/" element={<PublicLayout />}>
          
          {/* === الروابط العامة === */}
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

          {/* === روابط الـ Stagiaire المحمية === */}
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

          {/* === روابط الـ Admin المحمية (بقت بنفس العناوين وبدون Sidebar) 🔐 === */}
          <Route path="admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="admin/modules" element={isAuthenticated ? <ModulesAdmin /> : <Navigate to="/login" />} />
          <Route path="admin/quizzes" element={isAuthenticated ? <QuizzesAdmin /> : <Navigate to="/login" />} />
          <Route path="admin/examens" element={isAuthenticated ? <ExamensAdmin /> : <Navigate to="/login" />} />
          <Route path="admin/documents" element={isAuthenticated ? <DocumentsAdmin /> : <Navigate to="/login" />} />
          <Route path="admin/filieres" element={isAuthenticated ? <FilieresAdmin /> : <Navigate to="/login" />} />
          <Route path="admin/users" element={isAuthenticated ? <UsersAdmin /> : <Navigate to="/login" />} />
          <Route path="admin/lessons" element={isAuthenticated ? <LessonsAdmin /> : <Navigate to="/login" />} />

          {/* تدوير الروابط الغلط */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;