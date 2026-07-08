// src/hooks/useClaimedItems.ts
import { useState, useEffect, useCallback } from 'react';
import { claimedItemsApi } from '../api/claimed-items';
import type { ClaimedItem, ClaimedItemsQueryParams } from '../types/claimed-item.types';
import { useToast } from './useToast';

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 3,  // ✅ Changed from 10 to 3
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const useClaimedItems = (initialParams: ClaimedItemsQueryParams = {}) => {
  const [items, setItems] = useState<ClaimedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [params, setParams] = useState<ClaimedItemsQueryParams>({
    page: 1,
    pageSize: 3,  // ✅ Changed from 10 to 3
    ...initialParams,
  });
  const { showToast } = useToast();

// src/hooks/useClaimedItems.ts - Inside fetchItems
const fetchItems = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await claimedItemsApi.get(params);
    
    if (response && typeof response === 'object') {
      if ('items' in response && Array.isArray(response.items)) {
        setItems(response.items);
        setPagination({
          page: response.page || 1,
          pageSize: response.pageSize || 3,
          totalCount: response.totalCount || 0,
          totalPages: response.totalPages || 0,
          hasPreviousPage: response.hasPreviousPage || false,
          hasNextPage: response.hasNextPage || false,
        });

        // ✅ ADD THIS AUTO-CORRECTION
        if (response.items.length === 0 && response.totalCount > 0) {
          const lastPage = response.totalPages || 1;
          if (lastPage !== response.page) {
            setParams(prev => ({ ...prev, page: lastPage }));
            return;
          }
        }
      } else {
        setError('Unexpected response format');
        setItems([]);
      }
    } else {
      setError('Failed to load claimed items');
      setItems([]);
    }
  } catch (error: any) {
    console.error('❌ Fetch claimed items error:', error);
    setError(error.message || 'Failed to load claimed items');
    setItems([]);
  } finally {
    setIsLoading(false);
  }
}, [params]);

  const deleteItem = useCallback(async (id: number) => {
    try {
      await claimedItemsApi.delete(id);
      showToast('Item deleted successfully', 'success');
      await fetchItems();
    } catch (error: any) {
      showToast(error.message || 'Failed to delete item', 'error');
      throw error;
    }
  }, [fetchItems, showToast]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setParams(prev => ({ ...prev, page }));
    }
  }, [pagination.totalPages]);

  const changePageSize = useCallback((pageSize: number) => {
    setParams(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const applyFilters = useCallback((filters: Partial<ClaimedItemsQueryParams>) => {
    setParams(prev => ({ ...prev, ...filters, page: 1, pageSize: prev.pageSize || 3 }));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    isLoading,
    error,
    pagination,
    params,
    fetchItems,
    deleteItem,
    goToPage,
    changePageSize,
    applyFilters,
  };
};