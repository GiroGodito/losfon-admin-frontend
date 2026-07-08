// src/hooks/useColdCaseItems.ts
import { useState, useEffect, useCallback } from 'react';
import { coldCaseItemsApi } from '../api/cold-case-items';
import type { ColdCaseItem, ColdCaseItemsQueryParams } from '../types/cold-case-item.types';
import { useToast } from './useToast';

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 3,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const useColdCaseItems = (initialParams: ColdCaseItemsQueryParams = {}) => {
  const [items, setItems] = useState<ColdCaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [params, setParams] = useState<ColdCaseItemsQueryParams>({
    page: 1,
    pageSize: 3,
    ...initialParams,
  });
  const { showToast } = useToast();

  // ✅ FIXED: Fetch with auto-page correction
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await coldCaseItemsApi.get(params);
      
      if (response && typeof response === 'object') {
        if ('items' in response && Array.isArray(response.items)) {
          setItems(response.items);
          const newPagination = {
            page: response.page || 1,
            pageSize: response.pageSize || 3,
            totalCount: response.totalCount || 0,
            totalPages: response.totalPages || 0,
            hasPreviousPage: response.hasPreviousPage || false,
            hasNextPage: response.hasNextPage || false,
          };
          setPagination(newPagination);

          // ✅ AUTO-CORRECT: If current page is empty and there are items, go to last page
          if (response.items.length === 0 && response.totalCount > 0) {
            const lastPage = response.totalPages || 1;
            if (lastPage !== response.page) {
              setParams(prev => ({ ...prev, page: lastPage }));
              // Don't refetch here - the useEffect will handle it
            }
          }
        } else {
          setError('Unexpected response format');
          setItems([]);
        }
      } else {
        setError('Failed to load cold case items');
        setItems([]);
      }
    } catch (error: any) {
      console.error('❌ Fetch cold case items error:', error);
      setError(error.message || 'Failed to load cold case items');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const markAsFound = useCallback(async (id: number, data: { turnInBy?: string; foundBy?: string; filePath?: string }) => {
    try {
      const response = await coldCaseItemsApi.markAsFound(id, data);
      if (response.success) {
        showToast(response.message || 'Item marked as found successfully', 'success');
        await fetchItems();
        return response;
      }
      return response;
    } catch (error: any) {
      showToast(error.message || 'Failed to mark item as found', 'error');
      throw error;
    }
  }, [fetchItems, showToast]);

  const undoMarkAsFound = useCallback(async (id: number) => {
    try {
      const response = await coldCaseItemsApi.undoMarkAsFound(id);
      if (response.success) {
        showToast(response.message || 'Undo successful', 'success');
        await fetchItems();
        return response;
      }
      return response;
    } catch (error: any) {
      showToast(error.message || 'Failed to undo', 'error');
      throw error;
    }
  }, [fetchItems, showToast]);

  const markAsSeen = useCallback(async (id: number) => {
    try {
      await coldCaseItemsApi.markAsSeen(id);
      await fetchItems();
    } catch (error: any) {
      showToast(error.message || 'Failed to mark as seen', 'error');
    }
  }, [fetchItems, showToast]);

  const markAllAsSeen = useCallback(async () => {
    try {
      const response = await coldCaseItemsApi.markAllAsSeen();
      if (response.success) {
        showToast(`Marked ${response.markedCount} items as seen`, 'success');
        await fetchItems();
        return response;
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to mark all as seen', 'error');
    }
  }, [fetchItems, showToast]);

  const deleteItem = useCallback(async (id: number) => {
    try {
      await coldCaseItemsApi.delete(id);
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

  const applyFilters = useCallback((filters: Partial<ColdCaseItemsQueryParams>) => {
    setParams(prev => ({ ...prev, ...filters, page: 1 }));
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
    markAsFound,
    undoMarkAsFound,
    markAsSeen,
    markAllAsSeen,
    deleteItem,
    goToPage,
    changePageSize,
    applyFilters,
  };
};