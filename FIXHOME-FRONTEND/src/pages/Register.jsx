import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, UserPlus, ShieldCheck, User, Hammer, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'user',
    verificationType: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === 'provider' && !formData.verificationType) {
      alert("Please select a verification path (Educated or Experienced)");
      return;
    }
    setIsSubmitting(true);
    const result = await register(formData);
    if (result.success) {
      if (formData.role === 'provider') {
        navigate('/verification');
      } else {
        navigate('/dashboard');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl p-8 sm:p-12 shadow-premium border border-slate-100"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 mb-2 font-heading">Create Account</h1>
          <p className="text-slate-500 font-medium">Join HomeAssist and find trusted services or start earning</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                className="input-field pl-12"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                className="input-field pl-12"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                className="input-field pl-12"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="md:col-span-2 space-y-3 pt-2">
            <label className="text-sm font-bold text-slate-700 ml-1">What best describes you?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setFormData({...formData, role: 'user', verificationType: null})}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.role === 'user' 
                  ? 'border-primary-500 bg-primary-50/50' 
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  formData.role === 'user' ? 'bg-primary-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                }`}>
                  <User size={20} />
                </div>
                <h4 className="font-bold text-slate-800">I need services</h4>
                <p className="text-xs text-slate-500 mt-1">Search and book household specialists</p>
              </div>

              <div 
                onClick={() => setFormData({...formData, role: 'provider'})}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.role === 'provider' 
                  ? 'border-secondary-500 bg-secondary-50/50' 
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  formData.role === 'provider' ? 'bg-secondary-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                }`}>
                  <Hammer size={20} />
                </div>
                <h4 className="font-bold text-slate-800">I am a provider</h4>
                <p className="text-xs text-slate-500 mt-1">Offer my skills and earn money</p>
              </div>
            </div>
          </div>

          {/* Verification Path Selection for Providers */}
          <AnimatePresence>
            {formData.role === 'provider' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:col-span-2 space-y-3 overflow-hidden"
              >
                <label className="text-sm font-bold text-slate-700 ml-1">Select Verification Path</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                  <div 
                    onClick={() => setFormData({...formData, verificationType: 'educated'})}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      formData.verificationType === 'educated' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap size={16} className="text-primary-600" />
                      <span className="font-bold text-sm text-slate-800">Educated</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">I have formal certificates/training</p>
                  </div>
                  <div 
                    onClick={() => setFormData({...formData, verificationType: 'non-educated'})}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      formData.verificationType === 'non-educated' 
                      ? 'border-secondary-500 bg-secondary-50' 
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Hammer size={16} className="text-secondary-600" />
                      <span className="font-bold text-sm text-slate-800">Experienced</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">I have real-world work experience</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary h-14 flex items-center justify-center space-x-2 text-lg disabled:opacity-70 disabled:scale-100"
            >
              {isSubmitting ? <Loader /> : (
                <>
                  <UserPlus size={20} />
                  <span>Create Free Account</span>
                </>
              )}
            </button>
            <p className="text-xs text-slate-400 text-center mt-4 font-medium">
              By joining, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy</span>.
            </p>
          </div>
        </form>

        <p className="text-center mt-10 text-slate-600 font-medium">
          Already have an account? {' '}
          <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
