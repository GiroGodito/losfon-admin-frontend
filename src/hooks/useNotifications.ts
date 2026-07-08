// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '../api/notifications';
import type { Notification } from '../types/notification.types';
import { useToast } from './useToast';

// ✅ Types to exclude for admin
const EXCLUDED_NOTIFICATION_TYPES = ['ITEM_FOUND', 'ITEM_CLAIMED'];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const { showToast } = useToast();

  // ✅ Helper to filter out user notifications
  const filterNotifications = (items: Notification[]): Notification[] => {
    return items.filter(n => 
      !EXCLUDED_NOTIFICATION_TYPES.includes(n.type) &&
      !n.title?.includes('Your lost item') &&
      !n.message?.includes('Good news!')
    );
  };

  const loadNotifications = useCallback(async (page = 1, pageSize = 5) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationsApi.getNotifications(page, pageSize);
      if (response.success) {
        // ✅ Filter out user notifications
        const filteredData = filterNotifications(response.data);
        
        // ✅ Recalculate unread count from filtered data
        const filteredUnreadCount = filteredData.filter(n => !n.isRead).length;
        
        setNotifications(filteredData);
        setUnreadCount(filteredUnreadCount);
        setPagination({
          ...response.pagination,
          totalCount: filteredData.length
        });
      } else {
        setError('Failed to load notifications');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await notificationsApi.getUnreadCount();
      if (response.success) {
        // ✅ Use filtered count from current notifications
        const filteredUnread = notifications.filter(n => !n.isRead).length;
        setUnreadCount(filteredUnread);
      }
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }, [notifications]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      const response = await notificationsApi.markAsRead(id);
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to mark as read', 'error');
    }
  }, [showToast]);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationsApi.markAllAsRead();
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
        showToast('All notifications marked as read', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to mark all as read', 'error');
    }
  }, [showToast]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadNotifications(page, pagination.pageSize);
    }
  }, [loadNotifications, pagination]);

  useEffect(() => {
    loadNotifications(1, 5);
    loadUnreadCount();

    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    pagination,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    goToPage,
  };
};