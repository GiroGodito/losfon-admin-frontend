// src/hooks/useSystemSettings.ts
import { useState, useEffect, useCallback } from 'react';
import { systemSettingsApi } from '../api/system-settings';
import { useToast } from './useToast';

export const useSystemSettings = () => {
  const [expirationDays, setExpirationDays] = useState<number>(90);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Load current expiration days
  const loadExpirationDays = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await systemSettingsApi.getExpirationDays();
      if (response.success) {
        setExpirationDays(response.days);
      } else {
        setError('Failed to load expiration days');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load expiration days');
      showToast(error.message || 'Failed to load expiration days', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Update expiration days
  const updateExpirationDays = useCallback(async (days: number) => {
    setIsUpdating(true);
    setError(null);
    try {
      // Validate
      if (days < 1 || days > 365) {
        throw new Error('Expiration days must be between 1 and 365');
      }

      const response = await systemSettingsApi.updateExpirationDays({ days });
      if (response.success) {
        setExpirationDays(days);
        showToast(response.message || `Expiration days updated to ${days} days`, 'success');
        return response;
      } else {
        throw new Error(response.message || 'Failed to update expiration days');
      }
    } catch (error: any) {
      const message = error.message || 'Failed to update expiration days';
      setError(message);
      showToast(message, 'error');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [showToast]);

  // Load on mount
  useEffect(() => {
    loadExpirationDays();
  }, [loadExpirationDays]);

  return {
    expirationDays,
    isLoading,
    isUpdating,
    error,
    loadExpirationDays,
    updateExpirationDays,
  };
};