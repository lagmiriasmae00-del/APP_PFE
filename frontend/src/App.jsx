import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';           // الواجهة اللي فيها "L'avenir..."
import About from './pages/About';         // صفحة التعريف
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ModulesList from './pages/ModulesList';
import ModuleDetail from './pages/ModuleDetail';
import Profile from './pages/Profile';

function App() {
  // كنجيبو حالة الاتصال باش نعرفو واش الطالب داخل ولا لا
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* الـ Header كيبان ديما الفوق وكيتغير ديناميكياً */}
        <Header /> 

        <main className="flex-grow">
          <Routes>
            
            {/* 1. المسارات العامة (Public) - كولشي كيشوفهم */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* 2. مسارات التسجيل والدخول - إلا كان مكونيكطي كيديه للداشبورد */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
            />

            {/* 3. المسارات المحمية (Protected) - غير للطالب المكونيكطي */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/modules" 
              element={isAuthenticated ? <ModulesList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/module/:id" 
              element={isAuthenticated ? <ModuleDetail /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />

            {/* 4. أي رابط غالط كيرجعو للواجهة الرئيسية */}
            <Route path="*" element={<Navigate to="/" />} />
            
          </Routes>
        </main>

        {/* الـ Footer كيبان ديما لتحت */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;