import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (tkn) => {
    try {
      const response = await api.verifyToken(tkn);
      setAuthUser(response.user);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('authToken');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, username) => {
    try {
      const response = await api.register(email, password, username);
      setToken(response.token);
      setAuthUser(response.user);
      localStorage.setItem('authToken', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      setToken(response.token);
      setAuthUser(response.user);
      localStorage.setItem('authToken', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setAuthUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const value = {
    authUser,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!authUser,
    isAdmin: authUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
