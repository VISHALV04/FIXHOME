import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ONE-TIME RESET: Clear stale "John Doe" data for the new flow
    const hasBeenReset = localStorage.getItem('v2_reset');
    if (!hasBeenReset) {
      localStorage.clear();
      localStorage.setItem('v2_reset', 'true');
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    // Check if token exists on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    if (savedToken && savedUser) {
      setUser(savedUser);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await mockApi.login(credentials);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await mockApi.register(userData);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    role: user?.role || 'guest',
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
