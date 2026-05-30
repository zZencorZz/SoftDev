'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService, UserMeResponse } from '@/api/user/userServ';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    
  user: UserMeResponse | null;
  isLoading: boolean;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await userService.getMe();
      setUser(data);
    } catch (error) {
      console.error('🛑 Сбой синхронизации сессии:', error);
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    router.push('/auth');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return context;
};