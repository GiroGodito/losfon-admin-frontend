// src/hooks/useRateLimiter.ts
import { useState, useCallback, useEffect } from 'react';
import { useToast } from './useToast';

interface RateLimiterState {
  isRateLimited: boolean;
  retryAfter: number;
  countdown: number;
  resourceType?: string;
}

export const useRateLimiter = () => {
  const [state, setState] = useState<RateLimiterState>({
    isRateLimited: false,
    retryAfter: 0,
    countdown: 0,
  });
  const { showToast } = useToast();

  const handleRateLimit = useCallback((error: any, resourceType?: string) => {
    if (error?.type === 'RateLimitError' || error?.status === 429) {
      const retrySeconds = error.retryAfter || 30;
      setState({
        isRateLimited: true,
        retryAfter: retrySeconds,
        countdown: retrySeconds,
        resourceType: resourceType || 'admin-login',
      });
      
      const resourceMessage = resourceType === 'admin-login' 
        ? ' for admin login' 
        : resourceType ? ` for ${resourceType}` : '';
      showToast(`⏳ Too many requests${resourceMessage}. Please wait ${retrySeconds} seconds.`, 'error');
      
      return true;
    }
    return false;
  }, [showToast]);

  const resetRateLimit = useCallback(() => {
    setState({
      isRateLimited: false,
      retryAfter: 0,
      countdown: 0,
    });
  }, []);

  useEffect(() => {
    if (state.countdown <= 0) {
      if (state.isRateLimited) {
        setState(prev => ({ ...prev, isRateLimited: false }));
        showToast('✅ Rate limit lifted. You can try again now.', 'success');
      }
      return;
    }

    const timer = setInterval(() => {
      setState(prev => ({
        ...prev,
        countdown: Math.max(0, prev.countdown - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.countdown, state.isRateLimited, showToast]);

  return {
    isRateLimited: state.isRateLimited,
    retryAfter: state.retryAfter,
    countdown: state.countdown,
    resourceType: state.resourceType,
    handleRateLimit,
    resetRateLimit,
  };
};

export default useRateLimiter;