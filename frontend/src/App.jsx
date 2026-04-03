import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DiaryPage from './pages/DiaryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = () => dispatch(logout());
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/diary/:id" element={<DiaryPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </div>
  );
}
