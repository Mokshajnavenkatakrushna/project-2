import React, { createContext, useContext, useState } from 'react';
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
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, language: string): Promise<boolean> => {
    try {
      const response = await authApi.signup({ name, email, password, language });
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ login, signup, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
