// src/components/activity-logs/ActivityLogItem.tsx
import React from 'react';
import type { ActivityLog } from '../../types/activity-log.types';
import { formatDateWithTime } from '../../lib/date';
import { Badge } from '../common/Badge';

interface ActivityLogItemProps {
  log: ActivityLog;
}

export const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ log }) => {
  const getActionBadge = (action: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      'CREATE': 'success',
      'UPDATE': 'info',
      'DELETE': 'danger',
      'LOGIN': 'default',
      'LOGOUT': 'default',
      'PRINT': 'info',
      'DONATE': 'success',
      'RESTORE': 'warning',
      'USER_REPORT': 'info',
      'USER_CANCEL': 'danger',
      'LOGIN_FAILED': 'danger',
    };
    return variants[action] || 'default';
  };

  // Truncate user agent if too long
  const truncateUserAgent = (ua: string | null) => {
    if (!ua) return 'Unknown';
    // Common browser names to show
    const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/\d+\.\d+/);
    if (browserMatch) return browserMatch[0];
    // If it's too long, truncate
    return ua.length > 50 ? ua.substring(0, 50) + '...' : ua;
  };

  return (
    <div className="px-4 py-2.5 border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getActionBadge(log.actionType)}>
              {log.actionType}
            </Badge>
            {log.entityType && (
              <span className="text-xs text-gray-500">
                {log.entityType}
                {log.entityId && ` #${log.entityId}`}
              </span>
            )}
          </div>
          <p className="text-white text-sm mt-0.5 truncate">{log.description}</p>
          {log.entityName && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              Entity: {log.entityName}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-500">
            {formatDateWithTime(log.createdAt)}
          </p>
          <p className="text-xs text-gray-600">
            {log.userName}
          </p>
          {/* ✅ User Agent - shows browser info */}
          <p className="text-[10px] text-gray-600/70 mt-0.5 truncate max-w-[150px] ml-auto">
            {truncateUserAgent(log.userAgent)}
          </p>
        </div>
      </div>
    </div>
  );
};