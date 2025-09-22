import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  language: string;
  createdAt: string;
}

interface AuthContextType {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, language: string) => Promise<boolean>;
  updateLanguage: (language: string) => void;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedLanguage = localStorage.getItem('userLanguage');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (savedLanguage) {
          userData.language = savedLanguage;
        }
        console.log('Loading user from localStorage:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', { email });
      const response = await authApi.login({ email, password });
      console.log('Login response:', response.data);
      setUser(response.data.user);
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, language: string): Promise<boolean> => {
    try {
      const response = await authApi.signup({ name, email, password, language });
      setUser(response.data.user);
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const updateLanguage = (language: string) => {
    if (user) {
      setUser({ ...user, language });
      // Store in localStorage for persistence
      localStorage.setItem('userLanguage', language);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userLanguage');
  };

  return (
    <AuthContext.Provider value={{ login, signup, updateLanguage, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
