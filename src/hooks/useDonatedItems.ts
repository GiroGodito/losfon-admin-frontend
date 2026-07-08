// src/hooks/useDonatedItems.ts
import { useState, useEffect, useCallback } from 'react';
import { donatedItemsApi } from '../api/donated-items';
import type { DonatedItem, DonatedItemGroup, DonatedItemsQueryParams } from '../types/donated-item.types';

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const useDonatedItems = (initialParams: DonatedItemsQueryParams = {}) => {
  const [items, setItems] = useState<DonatedItem[]>([]);
  const [groups, setGroups] = useState<DonatedItemGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [params, setParams] = useState<DonatedItemsQueryParams>({
    page: 1,
    pageSize: 10,
    ...initialParams,
  });
  // const { showToast } = useToast();

  // ============ FETCH FLAT LIST ============
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await donatedItemsApi.get(params);
      
      if (response && typeof response === 'object') {
        if ('items' in response && Array.isArray(response.items)) {
          setItems(response.items);
          setPagination({
            page: response.page || 1,
            pageSize: response.pageSize || 10,
            totalCount: response.totalCount || 0,
            totalPages: response.totalPages || 0,
            hasPreviousPage: response.hasPreviousPage || false,
            hasNextPage: response.hasNextPage || false,
          });
        } else {
          setError('Unexpected response format');
          setItems([]);
        }
      } else {
        setError('Failed to load donated items');
        setItems([]);
      }
    } catch (error: any) {
      console.error('❌ Fetch donated items error:', error);
      setError(error.message || 'Failed to load donated items');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // ============ FETCH GROUPED LIST ============
  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await donatedItemsApi.getGrouped(params);
      
      if (response && typeof response === 'object') {
        if ('items' in response && Array.isArray(response.items)) {
          // ✅ Backend returns groups in 'items' array
          // Each group already has itemsPerPage from backend
          setGroups(response.items);
          setPagination({
            page: response.page || 1,
            pageSize: response.pageSize || 10,
            totalCount: response.totalCount || 0,
            totalPages: response.totalPages || 0,
            hasPreviousPage: response.hasPreviousPage || false,
            hasNextPage: response.hasNextPage || false,
          });
        } else {
          setError('Unexpected response format');
          setGroups([]);
        }
      } else {
        setError('Failed to load donated item groups');
        setGroups([]);
      }
    } catch (error: any) {
      console.error('❌ Fetch donated groups error:', error);
      setError(error.message || 'Failed to load donated item groups');
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // ============ PAGINATION ============
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setParams(prev => ({ ...prev, page }));
    }
  }, [pagination.totalPages]);

  const changePageSize = useCallback((pageSize: number) => {
    setParams(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const applyFilters = useCallback((filters: Partial<DonatedItemsQueryParams>) => {
    setParams(prev => ({ ...prev, ...filters, page: 1, pageSize: prev.pageSize || 10 }));
  }, []);

  // ============ INITIAL LOAD ============
  useEffect(() => {
    fetchGroups(); // ✅ Load grouped by default
  }, [fetchGroups]);

  return {
    items,
    groups,
    isLoading,
    error,
    pagination,
    params,
    fetchItems,
    fetchGroups,
    goToPage,
    changePageSize,
    applyFilters,
  };
};

export default useDonatedItems;