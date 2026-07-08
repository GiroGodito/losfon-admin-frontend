// src/components/dashboard/RecentActivity.tsx
import React from 'react';
import type { ActivityLog } from '../../types/activity-log.types';
import { Card } from '../common/Card';
import { ActivityLogItem } from '../activity-logs/ActivityLogItem';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface RecentActivityProps {
  logs: ActivityLog[];
  isLoading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  logs = [],
  isLoading = false,
}) => {
  // Show up to 10 recent logs
  const displayLogs = logs.slice(0, 10);

  return (
    <Card
      title="Recent Activity"
      subtitle="Latest actions in the system"
      actions={
        <Link to="/activity-logs">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full" />
        </div>
      ) : displayLogs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent activity</p>
      ) : (
        <div className="-mx-6 -mb-6 max-h-[400px] overflow-y-auto">
          {displayLogs.map((log) => (
            <ActivityLogItem key={log.id} log={log} />
          ))}
        </div>
      )}
    </Card>
  );
};