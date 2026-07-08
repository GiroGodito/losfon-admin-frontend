// src/hooks/useLostItems.ts
import { useState, useEffect, useCallback } from 'react';
import { lostItemsApi } from '../api/lost-items';
import type { LostItem, LostItemsQueryParams } from '../types/lost-item.types';
import { useToast } from './useToast';

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 3,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const useLostItems = (initialParams: LostItemsQueryParams = {}) => {
  const [items, setItems] = useState<LostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [params, setParams] = useState<LostItemsQueryParams>({
    page: 1,
    pageSize: 10,
    ...initialParams,
  });
  const { showToast } = useToast();

  // src/hooks/useLostItems.ts - Inside fetchItems
const fetchItems = useCallback(async (activeOnly = true) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = activeOnly
      ? await lostItemsApi.getActive(params)
      : await lostItemsApi.getAll(params);
    
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
      setError('Failed to load lost items');
      setItems([]);
    }
  } catch (error: any) {
    setError(error.message || 'Failed to load lost items');
    setItems([]);
  } finally {
    setIsLoading(false);
  }
}, [params]);

  const refetch = useCallback(async () => {
    await fetchItems(true);
  }, [fetchItems]);

  // Add this function after the other functions
const createLostItem = useCallback(async (data: {
  itemDescription: string;
  reportedBy?: string;
  contactNumber?: string;
  filePath?: string | null;
  userId?: number | null;
}) => {
  try {
    const response = await lostItemsApi.create(data);
    showToast('Lost item reported successfully', 'success');
    await fetchItems();
    return response;
  } catch (error: any) {
    showToast(error.message || 'Failed to report lost item', 'error');
    throw error;
  }
}, [fetchItems, showToast]);

  const markAsDone = useCallback(async (id: number, data: { turnInBy?: string; foundBy?: string; filePath?: string }) => {
    try {
      const response = await lostItemsApi.markAsDone(id, data);
      if (response.success) {
        showToast(response.message || 'Item marked as done successfully', 'success');
        await fetchItems();
        return response;
      }
      return response;
    } catch (error: any) {
      showToast(error.message || 'Failed to mark item as done', 'error');
      throw error;
    }
  }, [fetchItems, showToast]);

  const undoMarkAsDone = useCallback(async (id: number) => {
    try {
      const response = await lostItemsApi.undoMarkAsDone(id);
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
      const response = await lostItemsApi.markAsSeen(id);
      if (response.success) {
        await fetchItems();
        return response;
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to mark as seen', 'error');
    }
  }, [fetchItems, showToast]);

  const deleteItem = useCallback(async (id: number) => {
    try {
      await lostItemsApi.delete(id);
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

  const applyFilters = useCallback((filters: Partial<LostItemsQueryParams>) => {
    setParams(prev => ({ ...prev, ...filters, page: 1, pageSize: filters.pageSize ?? prev.pageSize ?? 10, }));
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
    refetch,
    createLostItem,
    markAsDone,
    undoMarkAsDone,
    markAsSeen,
    deleteItem,
    goToPage,
    changePageSize,
    applyFilters,
  };
};