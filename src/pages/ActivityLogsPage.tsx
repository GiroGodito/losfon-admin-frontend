// src/pages/ActivityLogsPage.tsx
import React from 'react';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { ActivityLogList } from '../components/activity-logs/ActivityLogList';
// import { DocumentTextIcon } from '@heroicons/react/24/outline';

export const ActivityLogsPage = () => {
  const {
    logs,
    isLoading,
    pagination,
    goToPage,
    applyFilters,
  } = useActivityLogs();

  return (
    <div className="space-y-3">
      <div className="text-left"> {/* ✅ WRAP in div with text-left */}
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Activity Logs
        </h2>
        <p className="text-gray-400 text-sm mt-1">View all system activities and audit trail</p>
      </div>

      <ActivityLogList
        logs={logs}
        isLoading={isLoading}
        pagination={pagination}
        onFilter={applyFilters}
        onPageChange={goToPage}
      />
    </div>
  );
};