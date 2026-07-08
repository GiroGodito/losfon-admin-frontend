// src/components/activity-logs/ActivityLogList.tsx
import React from 'react';
import type { ActivityLog } from '../../types/activity-log.types';
import { ActivityLogItem } from './ActivityLogItem';
import { ActivityLogFilters } from './ActivityLogFilters';
import { EmptyState } from '../common/EmptyState';
import { Spinner } from '../common/Spinner';
import { Pagination } from '../common/Pagination';
import type { ActivityLogsQueryParams } from '../../types/activity-log.types';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface ActivityLogListProps {
  logs: ActivityLog[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  onFilter?: (filters: ActivityLogsQueryParams) => void;
  onPageChange?: (page: number) => void;
  showFilters?: boolean;
}

export const ActivityLogList: React.FC<ActivityLogListProps> = ({
  logs = [],
  isLoading,
  pagination,
  onFilter,
  onPageChange,
  showFilters = true,
}) => {
  return (
    <div>
      {showFilters && onFilter && (
        <ActivityLogFilters onFilter={onFilter} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          title="No Activity Logs"
          description="No logs match your current filters. Try adjusting your search criteria."
          icon={<DocumentTextIcon className="h-12 w-12 text-gray-500" />}
        />
      ) : (
        <>
          {/* ✅ TOP PAGINATION BAR - Same style as Lost Items */}
          {(pagination.totalPages > 1 || pagination.totalCount > pagination.pageSize) && onPageChange && (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Left: Items info */}
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-white">{logs.length}</span>
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

          {/* Activity Log List */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            {logs.map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};