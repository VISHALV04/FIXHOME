import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-slate-100"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 mb-2 font-heading">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600 text-sm"
          >
            <AlertCircle size={18} className="mr-2 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                required
                className="input-field pl-12"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <button type="button" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                required
                className="input-field pl-12"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary h-14 flex items-center justify-center space-x-2 text-lg disabled:opacity-70 disabled:scale-100"
          >
            {isSubmitting ? <Loader /> : (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600">
          Don't have an account? {' '}
          <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Create account
          </Link>
        </p>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium lowercase">
            Tip: Use "provider@example.com" for provider role
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
