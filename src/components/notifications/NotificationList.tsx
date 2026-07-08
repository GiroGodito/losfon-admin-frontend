// src/components/notifications/NotificationList.tsx
import React from 'react';
import type { Notification } from '../../types/notification.types';
import { NotificationItem } from './NotificationItem';
import { EmptyState } from '../common/EmptyState';
import { Spinner } from '../common/Spinner';
import { Pagination } from '../common/Pagination';
import { BellSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  onMarkAsRead?: (id: number) => void;
  onMarkAllAsRead?: () => void;
  onPageChange?: (page: number) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  unreadCount,
  pagination,
  onMarkAsRead,
  onMarkAllAsRead,
  onPageChange,
}) => {
  return (
    <div>
      {!isLoading && unreadCount > 0 && onMarkAllAsRead && (
        <div className="flex justify-end mb-4">
          <Button
            variant="glass-green"
            size="sm"
            onClick={onMarkAllAsRead}
          >
            <CheckBadgeIcon className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You're all caught up! Check back later for updates."
          icon={<BellSlashIcon className="h-12 w-12 text-gray-500" />}
        />
      ) : (
        <>
          {/* ✅ TOP PAGINATION BAR - Same style as ActivityLogList */}
          {(pagination.totalPages > 1 || pagination.totalCount > pagination.pageSize) && onPageChange && (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Left: Items info */}
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-white">{notifications.length}</span>
                  <span className="mx-1">of</span>
                  <span className="font-medium text-white">{pagination.totalCount}</span>
                  <span className="ml-1">items</span>
                </div>

                {/* Center: Pagination controls */}
                <div className="flex items-center gap-4">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification List */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};