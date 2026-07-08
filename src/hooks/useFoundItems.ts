// src/hooks/useFoundItems.ts
import { useState, useEffect, useCallback } from 'react';
import { foundItemsApi } from '../api/found-items';
import type { FoundItem, FoundItemsQueryParams } from '../types/found-item.types';
import { useToast } from './useToast';

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 3,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const useFoundItems = (initialParams: FoundItemsQueryParams = {}) => {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [params, setParams] = useState<FoundItemsQueryParams>({
    page: 1,
    pageSize: 3,
    ...initialParams,
  });
  const { showToast } = useToast();

  // src/hooks/useFoundItems.ts - Inside fetchItems
const fetchItems = useCallback(async (activeOnly = true) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = activeOnly
      ? await foundItemsApi.getActive(params)
      : await foundItemsApi.getAll(params);
    
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
      setError('Failed to load found items');
      setItems([]);
    }
  } catch (error: any) {
    setError(error.message || 'Failed to load found items');
    setItems([]);
  } finally {
    setIsLoading(false);
  }
}, [params]);

// ✅ ADD THIS - Create function
  const createFoundItem = useCallback(async (data: {
    itemDescription: string;
    foundBy?: string;
    turnInBy: string;
    filePath?: string | null;
  }) => {
    try {
      const response = await foundItemsApi.create(data);
      showToast('Item added successfully', 'success');
      await fetchItems();
      return response;
    } catch (error: any) {
      showToast(error.message || 'Failed to create item', 'error');
      throw error;
    }
  }, [fetchItems, showToast]);

  const markAsClaimed = useCallback(async (id: number, data: { 
    claimedBy: string; 
    releasedBy: string; 
    claimedContactInformation: string;
    userId?: number | null;
  }) => {
    try {
      // ✅ FORCE PAYLOAD - ALWAYS INCLUDE userId
      const payload = {
        claimedBy: data.claimedBy,
        releasedBy: data.releasedBy,
        claimedContactInformation: data.claimedContactInformation,
        userId: data.userId ?? null  // Force it to be included even if null
      };
      
      console.log('🔍 SENDING MARK AS CLAIMED PAYLOAD:', JSON.stringify(payload, null, 2));
      
      const response = await foundItemsApi.markAsClaimed(id, payload);
      if (response.success) {
        showToast(response.message || 'Item marked as claimed successfully', 'success');
        await fetchItems();
        return response;
      }
      return response;
    } catch (error: any) {
      showToast(error.message || 'Failed to mark item as claimed', 'error');
      throw error;
    }
  }, [fetchItems, showToast]);

  const undoMarkAsClaimed = useCallback(async (id: number) => {
    try {
      const response = await foundItemsApi.undoMarkAsClaimed(id);
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
      await foundItemsApi.markAsSeen(id);
      await fetchItems();
    } catch (error: any) {
      showToast(error.message || 'Failed to mark as seen', 'error');
    }
  }, [fetchItems, showToast]);

  const deleteItem = useCallback(async (id: number) => {
    try {
      await foundItemsApi.delete(id);
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

  const applyFilters = useCallback((filters: Partial<FoundItemsQueryParams>) => {
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
    createFoundItem,
    markAsClaimed,
    undoMarkAsClaimed,
    markAsSeen,
    deleteItem,
    goToPage,
    changePageSize,
    applyFilters,
  };
};