import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, admin } = useSelector((s) => s.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0 border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-gradient-emerald">Diary</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === '/'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
            >
              Dashboard
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-sm font-medium">Admin: {admin?.username}</span>
                </div>
                <button onClick={handleLogout} className="btn-danger text-sm px-4 py-2">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="btn-primary text-sm">
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-2"
          >
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 transition-all"
            >
              Dashboard
            </Link>
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-sm font-medium">Admin: {admin?.username}</span>
                </div>
                <button onClick={handleLogout} className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all">
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              >
                Admin Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
