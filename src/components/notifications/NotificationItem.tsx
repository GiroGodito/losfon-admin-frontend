// src/components/notifications/NotificationItem.tsx
import React from 'react';
import type { Notification } from '../../types/notification.types';
import { formatRelativeTime } from '../../lib/date';
import { Badge } from '../common/Badge';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'ITEM_FOUND':
        return '🎉';
      case 'ITEM_CLAIMED':
        return '✅';
      case 'SYSTEM':
        return '📢';
      default:
        return '📬';
    }
  };

  return (
    <div
      className={`
        p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors
        ${!notification.isRead ? 'bg-green-500/5 border-l-4 border-l-green-500' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getTypeIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white">{notification.title}</h4>
            {!notification.isRead && (
              <Badge variant="danger">New</Badge>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1 break-words">
            {notification.message}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-gray-500 text-xs">
              {formatRelativeTime(notification.createdAt)}
            </span>
            {notification.itemName && (
              <span className="text-gray-500 text-xs">
                Item: {notification.itemName}
              </span>
            )}
          </div>
        </div>
        {notification.itemImage && (
          <img
            src={notification.itemImage}
            alt=""
            className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-gray-700"
          />
        )}
      </div>
    </div>
  );
};