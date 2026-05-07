import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Loader from './components/Loader';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import VerificationPending from './pages/VerificationPending';

// Only approved users/admins can access dashboard
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, role, user } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'provider' && user?.verificationStatus !== 'approved') {
    return <Navigate to="/verification-pending" replace />;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Only unapproved providers can access verification routes
const VerificationRoute = ({ children }) => {
  const { isAuthenticated, loading, role, user } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'provider') return <Navigate to="/dashboard" replace />;
  if (user?.verificationStatus === 'approved') return <Navigate to="/dashboard" replace />;
  return children;
};

// Guests only — authenticated users get redirected appropriately
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, role, user } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) return children;
  if (role === 'provider' && user?.verificationStatus !== 'approved') {
    return <Navigate to="/verification-pending" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

function App() {
  const { loading } = useAuth();
  if (loading) return <Loader fullScreen />;

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Provider verification flow */}
            <Route path="/verification" element={<VerificationRoute><Verification /></VerificationRoute>} />
            <Route path="/verification-pending" element={<VerificationRoute><VerificationPending /></VerificationRoute>} />

            {/* Approved users & admins */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400 font-bold text-sm">© 2026 HomeAssist HQ. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
