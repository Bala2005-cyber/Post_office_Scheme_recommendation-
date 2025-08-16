// contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface User {
  email: string;
  role: 'user' | 'staff';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string, role: 'user' | 'staff') => Promise<{ success: boolean; error?: string; user?: User }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string, role: 'user' | 'staff') => {
    try {
      const response = await axios.post('http://localhost:5002/login', { email, password, role });

      const { role: serverRole, name } = response.data;
      const loggedInUser: User = { email, role: serverRole, name };

      setUser(loggedInUser);
      return { success: true, user: loggedInUser };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      await axios.post('http://localhost:5002/signup', {
        email,
        password,
        ...userData
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
