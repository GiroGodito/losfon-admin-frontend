// src/components/notifications/NotificationBell.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { useNotifications } from '../../hooks/useNotifications';

export const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications();

  return (
    <Link 
      to="/notifications" 
      className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
      title="Notifications"
    >
      {unreadCount > 0 ? (
        <BellIconSolid className="w-5 h-5 text-yellow-400" />
      ) : (
        <BellIcon className="w-5 h-5" />
      )}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};