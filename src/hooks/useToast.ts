// src/hooks/useToast.ts
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'loading' | 'info' = 'success') => {
    if (type === 'success') {
      toast.success(message, {
        duration: 3000,
        icon: '✅', // ✅ Success checkmark
        style: {
          background: '#22c55e',
          color: '#fff',
          padding: '16px 20px',
          borderRadius: '8px',
        },
      });
    } else if (type === 'error') {
      toast.error(message, {
        duration: 5000,
        icon: '⚠️', // 🚫 Changed from ❌ to ⚠️ (Warning sign - less likely to be confused with close)
        // Other options: '🚫', '⛔', '🛑', '❗', '‼️', '🔴'
        style: {
          background: '#ef4444',
          color: '#fff',
          padding: '16px 20px',
          borderRadius: '8px',
        },
      });
    } else if (type === 'loading') {
      toast.loading(message, {
        duration: Infinity,
        icon: '⏳', // Loading hourglass
        style: {
          background: '#3b82f6',
          color: '#fff',
          padding: '16px 20px',
          borderRadius: '8px',
        },
      });
    } else if (type === 'info') {
      toast(message, {
        duration: 4000,
        icon: 'ℹ️', // Info icon
        style: {
          background: '#363636',
          color: '#fff',
          padding: '16px 20px',
          borderRadius: '8px',
        },
      });
    } else {
      toast(message, {
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          padding: '16px 20px',
          borderRadius: '8px',
        },
      });
    }
  }, []);

  const dismissToast = useCallback((toastId: string) => {
    toast.dismiss(toastId);
  }, []);

  const dismissAllToasts = useCallback(() => {
    toast.dismiss();
  }, []);

  return { showToast, dismissToast, dismissAllToasts };
};

export default useToast;