import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, LayoutDashboard, ShieldCheck, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', roles: ['user', 'provider', 'admin'] },
    { name: 'Admin Panel', path: '/admin', roles: ['admin'] },
  ];

  const filteredLinks = navLinks.filter(link => link.roles.includes(role));

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <ShieldCheck size={24} />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">
              Home<span className="text-primary-600">Assist</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-slate-600 hover:text-primary-600 font-semibold transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 leading-none capitalize">{user?.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold leading-none mt-1 uppercase tracking-wider">{role}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 font-semibold hover:text-primary-600 transition-colors">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {filteredLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-4 py-3 text-base font-semibold text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-base font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              ) : (
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <Link to="/login" className="btn-secondary text-center text-sm py-3" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-primary text-center text-sm py-3" onClick={() => setIsOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
