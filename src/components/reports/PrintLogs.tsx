// src/components/reports/PrintLogs.tsx
import React from 'react';
import type { PrintLog } from '../../types/print-settings.types';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { Spinner } from '../common/Spinner';
import { Pagination } from '../common/Pagination';
import { formatDateWithTime } from '../../lib/date';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface PrintLogsProps {
  logs: PrintLog[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  onPageChange?: (page: number) => void;
}

export const PrintLogs: React.FC<PrintLogsProps> = ({
  logs = [],
  isLoading,
  pagination,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        title="No Print Logs"
        description="No print activities have been logged yet."
        icon={<DocumentTextIcon className="h-12 w-12 text-gray-500" />}
      />
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left">Report Type</th>
              <th className="px-4 py-3 text-left">Officer</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Printed By</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3 text-white">
                  <span className="capitalize">{log.reportType}</span>
                </td>
                <td className="px-4 py-3 text-gray-400">{log.officerName}</td>
                <td className="px-4 py-3 text-gray-400">{log.itemCount}</td>
                <td className="px-4 py-3 text-gray-400">{log.printedByName || 'System'}</td>
                <td className="px-4 py-3 text-gray-400">
                  {formatDateWithTime(log.printedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && onPageChange && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};