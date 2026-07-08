// src/pages/NotificationsPage.tsx
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationList } from '../components/notifications/NotificationList';
import { BellIcon } from '@heroicons/react/24/outline';

export const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    pagination,
    markAsRead,
    markAllAsRead,
    goToPage,
  } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="text-sm bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
              {unreadCount} unread
            </span>
          )}
        </h2>
        <p className="text-gray-400 text-sm mt-1">Stay updated on system activities and events</p>
      </div>

      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        unreadCount={unreadCount}
        pagination={pagination}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onPageChange={goToPage}
      />
    </div>
  );
};