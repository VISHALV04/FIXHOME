import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VerificationPending = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const statusLabel = {
    unverified: { text: 'DOCUMENTS NOT SUBMITTED', color: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500' },
    pending: { text: 'DOCUMENTS SUBMITTED — WAITING FOR APPROVAL', color: 'bg-yellow-50 text-yellow-700 border-yellow-100', dot: 'bg-yellow-500' },
    rejected: { text: 'APPLICATION REJECTED', color: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500' },
  };

  const status = statusLabel[user?.verificationStatus] || statusLabel.pending;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 sm:p-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[3.5rem] shadow-2xl p-12 sm:p-20 text-center max-w-3xl border border-slate-50 w-full"
      >
        <div className="relative inline-block mb-12">
          <div className="w-32 h-32 bg-yellow-100 text-yellow-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-yellow-50 relative z-10 animate-pulse">
            <Clock size={64} />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce pointer-events-none">
            <CheckCircle size={24} />
          </div>
        </div>

        <h2 className="text-4xl font-black text-slate-800 mb-4 font-heading tracking-tight">
          Verification In Progress
        </h2>

        <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-black text-sm mb-8 border ${status.color}`}>
          <div className={`w-2 h-2 rounded-full animate-ping ${status.dot}`} />
          {status.text}
        </div>

        <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed mb-4">
          Hi <span className="text-slate-800 font-bold">{user?.name}</span>, your application is currently under review by our admin team.
        </p>
        <p className="text-slate-400 font-medium max-w-md mx-auto mb-12">
          You'll get full dashboard access once approved. This usually takes <span className="text-slate-700 font-bold italic">24–48 hours</span>.
        </p>

        {user?.verificationStatus === 'pending' && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-medium flex items-center gap-2">
            <CheckCircle size={18} className="shrink-0" />
            Your documents have been submitted successfully. Our admin team is reviewing them.
          </div>
        )}

        {user?.verificationStatus === 'unverified' && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700 text-sm font-medium">
            You haven't submitted your verification documents yet.{' '}
            <button
              onClick={() => navigate('/verification')}
              className="font-bold underline hover:text-blue-900"
            >
              Submit now →
            </button>
          </div>
        )}

        {user?.verificationStatus === 'rejected' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">
            Your application was rejected. Please{' '}
            <button
              onClick={() => navigate('/verification')}
              className="font-bold underline hover:text-red-900"
            >
              resubmit your documents →
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mx-auto text-slate-400 hover:text-slate-600 font-bold transition-colors"
        >
          <LogOut size={18} /> Sign out
        </button>
      </motion.div>
    </div>
  );
};

export default VerificationPending;
