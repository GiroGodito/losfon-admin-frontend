// src/hooks/useActivityLogs.ts
import { useState, useEffect, useCallback } from 'react';
import { activityLogsApi } from '../api/activity-logs';
import type { ActivityLog, ActivityLogsQueryParams } from '../types/activity-log.types';
import { useToast } from './useToast';

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 5, // ✅ CHANGED from 10 to 5
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const useActivityLogs = (initialParams: ActivityLogsQueryParams = {}) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [params, setParams] = useState<ActivityLogsQueryParams>({
    page: 1,
    pageSize: 5, // ✅ CHANGED from 10 to 5
    ...initialParams,
  });
  const [filters, setFilters] = useState({
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
    searchTerm: undefined as string | undefined,
    sortBy: 'CreatedAt',
    sortDirection: 'DESC' as 'ASC' | 'DESC',
  });
  const { showToast } = useToast();

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await activityLogsApi.get(params);
      
      // ✅ FIX: Handle the actual backend response shape
      // Backend returns: { success: true, data: [], pagination: {}, filters: {} }
      if (response && response.success) {
        setLogs(response.data || []);
        setPagination(response.pagination || DEFAULT_PAGINATION);
        if (response.filters) {
          setFilters({
            dateFrom: response.filters.dateFrom || undefined,
            dateTo: response.filters.dateTo || undefined,
            searchTerm: response.filters.searchTerm || undefined,
            sortBy: response.filters.sortBy || 'CreatedAt',
            sortDirection: (response.filters.sortDirection as 'ASC' | 'DESC') || 'DESC',
          });
        }
      } else {
        setError('Failed to load activity logs');
        setLogs([]);
      }
    } catch (error: any) {
      console.error('❌ Fetch activity logs error:', error);
      setError(error.message || 'Failed to load activity logs');
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setParams(prev => ({ ...prev, page }));
    }
  }, [pagination.totalPages]);

  const changePageSize = useCallback((pageSize: number) => {
    setParams(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const applyFilters = useCallback((filters: Partial<ActivityLogsQueryParams>) => {
    setParams(prev => ({ ...prev, ...filters, page: 1, pageSize: prev.pageSize || 5 }));
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    pagination,
    params,
    filters,
    fetchLogs,
    goToPage,
    changePageSize,
    applyFilters,
  };
};