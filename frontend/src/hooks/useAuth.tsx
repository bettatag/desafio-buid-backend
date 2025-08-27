'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { User, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('accessToken');
      if (token) {
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
        rememberMe,
      });

      const { user: userData, accessToken, refreshToken } = response.data;

      // Set cookies (backend should also set httpOnly cookies)
      const cookieOptions = {
        expires: rememberMe ? 30 : 1, // 30 days or 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
      };

      Cookies.set('accessToken', accessToken, cookieOptions);
      Cookies.set('refreshToken', refreshToken, cookieOptions);

      setUser(userData);
      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      });

      const { user: userData, accessToken, refreshToken } = response.data;

      // Set cookies
      const cookieOptions = {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
      };

      Cookies.set('accessToken', accessToken, cookieOptions);
      Cookies.set('refreshToken', refreshToken, cookieOptions);

      setUser(userData);
      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and cookies
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      router.push('/login');
    }
  };

  const refreshToken = async () => {
    try {
      await api.post('/auth/refresh');
      // The interceptor will handle the new tokens
      await checkAuth();
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    refreshToken,
    isLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
