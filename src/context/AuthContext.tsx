// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/auth';
import type { ProfileResponse } from '../api/auth';
import { useRateLimiter } from '../hooks/useRateLimiter';
import { useToast } from '../hooks/useToast';

interface AuthContextType {
  user: ProfileResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfile: (data: { username?: string; fullName?: string; email?: string }) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }) => Promise<void>;
  clearError: () => void;
  isRateLimited: boolean;
  rateLimitCountdown: number;
  resetRateLimit: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleRateLimit, isRateLimited, countdown, resetRateLimit } = useRateLimiter();
  const { showToast } = useToast();

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // ✅ Check rate limit before making request
      if (isRateLimited) {
        const msg = `Too many admin login attempts. Please wait ${countdown} seconds.`;
        setError(msg);
        showToast(msg, 'error');
        throw new Error(msg);
      }

      const response = await authApi.login({ username, password });
      
      if (response && response.success) {
        await loadProfile();
        resetRateLimit();
        showToast(`Welcome back, ${response.user.fullName}!`, 'success');
        return;
      }
      
      throw new Error(response?.message || 'Login failed');
    } catch (error: any) {
      console.error('Admin login error:', error);
      
      // ✅ Handle rate limit error
      const isRateLimit = handleRateLimit(error, 'admin-login');
      if (isRateLimit) {
        const msg = `Too many admin login attempts. Please wait ${countdown} seconds.`;
        setError(msg);
        showToast(msg, 'error');
        throw new Error(msg);
      }
      
      let errorMsg = 'Invalid username or password';
      
      // ✅ Check for network error FIRST
      if (error?.type === 'NetworkError' || error?.status === 0 || error?.message?.includes('connect')) {
        errorMsg = '🔌 Cannot connect to server. Please check if the backend is running.';
      } 
      // ✅ Check for validation errors
      else if (error?.status === 400 && error?.message?.includes('validation')) {
        errorMsg = 'Invalid username or password. Please try again.';
      }
      // ✅ Check for unauthorized
      else if (error?.type === 'Unauthorized' || error?.status === 401) {
        errorMsg = 'Invalid username or password. Please try again.';
      }
      // ✅ Check for server error
      else if (error?.status === 500) {
        errorMsg = 'Server error. Please try again later.';
      }
      // ✅ Check for rate limit error from server
      else if (error?.status === 429) {
        const retrySeconds = error.retryAfter || 30;
        errorMsg = `Too many admin login attempts. Please wait ${retrySeconds} seconds.`;
      }
      // ✅ Check for any message that contains validation related text
      else if (error?.message && (
        error.message.toLowerCase().includes('validation') ||
        error.message.toLowerCase().includes('invalid') ||
        error.message.toLowerCase().includes('credentials') ||
        error.message.toLowerCase().includes('username') ||
        error.message.toLowerCase().includes('password')
      )) {
        errorMsg = 'Invalid username or password. Please try again.';
      }
      else if (error?.message) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [loadProfile, showToast, handleRateLimit, isRateLimited, countdown, resetRateLimit]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      showToast('Logged out successfully', 'success');
    } catch (error: any) {
      // ✅ ALWAYS clear local state - don't let server errors block logout
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      
      // ✅ Only show error toast for non-network errors
      const isNetworkError = error?.type === 'NetworkError' || error?.status === 0;
      if (!isNetworkError && error?.message) {
        if (error?.status === 429) {
          showToast('Too many requests. You have been logged out.', 'error');
        } else if (error?.status === 500) {
          showToast('Server issue. You have been logged out.', 'error');
        } else if (error?.message && !error.message.toLowerCase().includes('failed to fetch')) {
          showToast(error.message, 'error');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const updateProfile = useCallback(async (data: { username?: string; fullName?: string; email?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.updateProfile(data);
      if (response.success) {
        await loadProfile();
        showToast(response.message || 'Profile updated successfully', 'success');
        return;
      }
      throw new Error(response.message || 'Update failed');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to update profile';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [loadProfile, showToast]);

  const changePassword = useCallback(async (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.changePassword(data);
      if (response.success) {
        showToast(response.message || 'Password changed successfully', 'success');
        return;
      }
      throw new Error(response.message || 'Change password failed');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to change password';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    loadProfile,
    updateProfile,
    changePassword,
    clearError,
    isRateLimited,
    rateLimitCountdown: countdown,
    resetRateLimit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};