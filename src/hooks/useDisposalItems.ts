// // src/hooks/useDisposalItems.ts
// import { useState, useEffect, useCallback } from 'react';
// import { disposalItemsApi } from '../api/disposal-items';
// import type { DisposalItem, DisposalItemsQueryParams } from '../types/disposal-item.types';
// import { useToast } from './useToast';

// const DEFAULT_PAGINATION = {
//   page: 1,
//   pageSize: 3,
//   totalCount: 0,
//   totalPages: 0,
//   hasPreviousPage: false,
//   hasNextPage: false,
// };

// export const useDisposalItems = (initialParams: DisposalItemsQueryParams = {}) => {
//   const [items, setItems] = useState<DisposalItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
//   const [params, setParams] = useState<DisposalItemsQueryParams>({
//     page: 1,
//     pageSize: 3,
//     ...initialParams,
//   });
//   const { showToast } = useToast();

//   // src/hooks/useDisposalItems.ts - Inside fetchItems
// const fetchItems = useCallback(async () => {
//   setIsLoading(true);
//   setError(null);
//   try {
//     const response = await disposalItemsApi.get(params);
    
//     if (response && typeof response === 'object') {
//       if ('items' in response && Array.isArray(response.items)) {
//         setItems(response.items);
//         setPagination({
//           page: response.page || 1,
//           pageSize: response.pageSize || 3,
//           totalCount: response.totalCount || 0,
//           totalPages: response.totalPages || 0,
//           hasPreviousPage: response.hasPreviousPage || false,
//           hasNextPage: response.hasNextPage || false,
//         });

//         // ✅ ADD THIS AUTO-CORRECTION
//         if (response.items.length === 0 && response.totalCount > 0) {
//           const lastPage = response.totalPages || 1;
//           if (lastPage !== response.page) {
//             setParams(prev => ({ ...prev, page: lastPage }));
//             return;
//           }
//         }
//       } else {
//         setError('Unexpected response format');
//         setItems([]);
//       }
//     } else {
//       setError('Failed to load disposal items');
//       setItems([]);
//     }
//   } catch (error: any) {
//     console.error('❌ Fetch disposal items error:', error);
//     setError(error.message || 'Failed to load disposal items');
//     setItems([]);
//   } finally {
//     setIsLoading(false);
//   }
// }, [params]);

//   const markAsSeen = useCallback(async (id: number) => {
//     try {
//       await disposalItemsApi.markAsSeen(id);
//       await fetchItems();
//     } catch (error: any) {
//       showToast(error.message || 'Failed to mark as seen', 'error');
//     }
//   }, [fetchItems, showToast]);

//   const markAllAsSeen = useCallback(async () => {
//     try {
//       const response = await disposalItemsApi.markAllAsSeen();
//       if (response.success) {
//         showToast(`Marked ${response.markedCount} items as seen`, 'success');
//         await fetchItems();
//         return response;
//       }
//     } catch (error: any) {
//       showToast(error.message || 'Failed to mark all as seen', 'error');
//     }
//   }, [fetchItems, showToast]);

//   const deleteItem = useCallback(async (id: number) => {
//     try {
//       await disposalItemsApi.delete(id);
//       showToast('Item deleted successfully', 'success');
//       await fetchItems();
//     } catch (error: any) {
//       showToast(error.message || 'Failed to delete item', 'error');
//       throw error;
//     }
//   }, [fetchItems, showToast]);

//   const donateAll = useCallback(async () => {
//     try {
//       const response = await disposalItemsApi.donateAll();
//       if (response.success) {
//         showToast(response.message || 'All disposal items donated successfully', 'success');
//         await fetchItems();
//         return response;
//       }
//       return response;
//     } catch (error: any) {
//       showToast(error.message || 'Failed to donate items', 'error');
//       throw error;
//     }
//   }, [fetchItems, showToast]);

//   const restoreAll = useCallback(async () => {
//     try {
//       const response = await disposalItemsApi.restoreAll();
//       if (response.success) {
//         showToast(response.message || 'All disposal items restored successfully', 'success');
//         await fetchItems();
//         return response;
//       }
//       return response;
//     } catch (error: any) {
//       showToast(error.message || 'Failed to restore items', 'error');
//       throw error;
//     }
//   }, [fetchItems, showToast]);

//   const goToPage = useCallback((page: number) => {
//     if (page >= 1 && page <= pagination.totalPages) {
//       setParams(prev => ({ ...prev, page }));
//     }
//   }, [pagination.totalPages]);

//   const changePageSize = useCallback((pageSize: number) => {
//     setParams(prev => ({ ...prev, pageSize, page: 1 }));
//   }, []);

//   const applyFilters = useCallback((filters: Partial<DisposalItemsQueryParams>) => {
//     setParams(prev => ({ ...prev, ...filters, page: 1, pageSize: prev.pageSize || 3 }));
//   }, []);

//   useEffect(() => {
//     fetchItems();
//   }, [fetchItems]);

//   return {
//     items,
//     isLoading,
//     error,
//     pagination,
//     params,
//     fetchItems,
//     markAsSeen,
//     markAllAsSeen,
//     deleteItem,
//     donateAll,
//     restoreAll,
//     goToPage,
//     changePageSize,
//     applyFilters,
//   };
// };

// src/hooks/useDisposalItems.ts
import { useState, useEffect, useCallback } from 'react';
import { disposalItemsApi } from '../api/disposal-items';
import type { DisposalItem, DisposalItemsQueryParams } from '../types/disposal-item.types';
import { useToast } from './useToast';

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 3,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const useDisposalItems = (initialParams: DisposalItemsQueryParams = {}) => {
  const [items, setItems] = useState<DisposalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [params, setParams] = useState<DisposalItemsQueryParams>({
    page: 1,
    pageSize: 3,
    ...initialParams,
  });
  const { showToast } = useToast();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await disposalItemsApi.get(params);

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

          if (response.items.length === 0 && response.totalCount > 0) {
            const lastPage = response.totalPages || 1;
            if (lastPage !== response.page) {
              setParams((prev) => ({ ...prev, page: lastPage }));
              return;
            }
          }
        } else {
          setError('Unexpected response format');
          setItems([]);
        }
      } else {
        setError('Failed to load disposal items');
        setItems([]);
      }
    } catch (error: any) {
      console.error('❌ Fetch disposal items error:', error);
      setError(error.message || 'Failed to load disposal items');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const markAsSeen = useCallback(
    async (id: number) => {
      try {
        await disposalItemsApi.markAsSeen(id);
        await fetchItems();
      } catch (error: any) {
        showToast(error.message || 'Failed to mark as seen', 'error');
      }
    },
    [fetchItems, showToast]
  );

  const markAllAsSeen = useCallback(async () => {
    if (items.length === 0 && pagination.totalCount === 0) {
      showToast('No disposal items to mark', 'info');
      return { success: false, markedCount: 0 };
    }

    try {
      const response = await disposalItemsApi.markAllAsSeen();
      if (response.success && response.markedCount > 0) {
        showToast(`Marked ${response.markedCount} items as seen`, 'success');
        await fetchItems();
        return response;
      }
      if (response.success && response.markedCount === 0) {
        showToast('No unseen items to mark', 'info');
        return response;
      }
      return response;
    } catch (error: any) {
      showToast(error.message || 'Failed to mark all as seen', 'error');
    }
  }, [fetchItems, showToast, items.length, pagination.totalCount]);

  const deleteItem = useCallback(
    async (id: number) => {
      try {
        await disposalItemsApi.delete(id);
        showToast('Item deleted successfully', 'success');
        await fetchItems();
      } catch (error: any) {
        showToast(error.message || 'Failed to delete item', 'error');
        throw error;
      }
    },
    [fetchItems, showToast]
  );

  const donateAll = useCallback(async () => {
    if (items.length === 0 && pagination.totalCount === 0) {
      showToast('No disposal items to donate', 'info');
      return { success: false, message: 'No disposal items to donate', donatedCount: 0 };
    }

    try {
      const response = await disposalItemsApi.donateAll();

      if (response.success && response.donatedCount > 0) {
        showToast(
          `Successfully donated ${response.donatedCount} disposal item${response.donatedCount === 1 ? '' : 's'} to charity`,
          'success'
        );
        await fetchItems();
        return response;
      }

      if (response.success && response.donatedCount === 0) {
        showToast('No disposal items to donate', 'info');
        return response;
      }

      return response;
    } catch (error: any) {
      showToast(error.message || 'Failed to donate items', 'error');
      throw error;
    }
  }, [fetchItems, showToast, items.length, pagination.totalCount]);

  const restoreAll = useCallback(async () => {
    if (items.length === 0 && pagination.totalCount === 0) {
      showToast('No donated items to restore', 'info');
      return { success: false, message: 'No donated items to restore', restoredCount: 0 };
    }

    try {
      const response = await disposalItemsApi.restoreAll();

      if (response.success && response.restoredCount > 0) {
        showToast(
          `Successfully restored ${response.restoredCount} item${response.restoredCount === 1 ? '' : 's'}`,
          'success'
        );
        await fetchItems();
        return response;
      }

      if (response.success && response.restoredCount === 0) {
        showToast('No donated items to restore', 'info');
        return response;
      }

      return response;
    } catch (error: any) {
      showToast(error.message || 'Failed to restore items', 'error');
      throw error;
    }
  }, [fetchItems, showToast, items.length, pagination.totalCount]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        setParams((prev) => ({ ...prev, page }));
      }
    },
    [pagination.totalPages]
  );

  const changePageSize = useCallback((pageSize: number) => {
    setParams((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const applyFilters = useCallback((filters: Partial<DisposalItemsQueryParams>) => {
    setParams((prev) => ({ ...prev, ...filters, page: 1, pageSize: prev.pageSize || 3 }));
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
    markAsSeen,
    markAllAsSeen,
    deleteItem,
    donateAll,
    restoreAll,
    goToPage,
    changePageSize,
    applyFilters,
  };
}; 