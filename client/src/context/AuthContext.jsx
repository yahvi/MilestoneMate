import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
          localStorage.setItem('milestonemate_user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Demo Login Quick-Switcher for Hackathon Judges
  const demoLogin = async (role) => {
    const email = role === 'freelancer' ? 'alex@milestonemate.dev' : 'sarah@company.com';
    const password = 'password123';
    return await login({ email, password });
  };

  const isFreelancer = user?.role === 'freelancer';
  const isClient = user?.role === 'client';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        isFreelancer,
        isClient,
        login,
        register,
        logout,
        demoLogin,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
