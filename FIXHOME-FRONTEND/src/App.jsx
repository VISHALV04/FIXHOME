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

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Wrapper (GUEST ONLY)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
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
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />

            {/* User/Common Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Role-Specific Routes */}
            <Route 
              path="/verification" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <Verification />
                </ProtectedRoute>
              } 
            />
            {/* Role-Specific Routes removed: /booking/:id */}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Simple Footer */}
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
