// // src/hooks/useOfficers.ts
// import { useState, useEffect, useCallback } from 'react';
// import { officersApi } from '../api/sso-officers';
// import type { SSOfficer, OfficersQueryParams } from '../types/sso-officer.types';
// import { useToast } from './useToast';

// const DEFAULT_PAGINATION = {
//   page: 1,
//   pageSize: 3,  // ✅ Changed from 10 to 3
//   totalCount: 0,
//   totalPages: 0,
//   hasPreviousPage: false,
//   hasNextPage: false,
// };

// export const useOfficers = (initialParams: OfficersQueryParams = {}) => {
//   const [officers, setOfficers] = useState<SSOfficer[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
//   const [params, setParams] = useState<OfficersQueryParams>({
//     page: 1,
//     pageSize: 3,  // ✅ Changed from 10 to 3
//     ...initialParams,
//   });
//   const { showToast } = useToast();

//   const fetchOfficers = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       console.log('🔍 Fetching officers with params:', params);
//       const response = await officersApi.get(params);
//       console.log('📦 Raw API Response:', response);
      
//       let officersData: SSOfficer[] = [];
//       let paginationData = DEFAULT_PAGINATION;
      
//       if (response && typeof response === 'object') {
//         if ('items' in response && Array.isArray(response.items)) {
//           officersData = response.items;
//           paginationData = {
//             page: response.page || 1,
//             pageSize: response.pageSize || 3,
//             totalCount: response.totalCount || 0,
//             totalPages: response.totalPages || 0,
//             hasPreviousPage: response.hasPreviousPage || false,
//             hasNextPage: response.hasNextPage || false,
//           };
//           console.log('✅ Using backend shape with items:', officersData);
//         } else if (Array.isArray(response)) {
//           officersData = response;
//           console.log('✅ Response is direct array:', officersData);
//         }
//       }
      
//       setOfficers(officersData);
//       setPagination(paginationData);
      
//       if (officersData.length === 0) {
//         console.log('ℹ️ No officers found in response');
//       }
      
//     } catch (error: any) {
//       console.error('❌ Fetch officers error:', error);
//       setError(error.message || 'Failed to load officers');
//       setOfficers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [params]);

//   const createOfficer = useCallback(async (data: { firstName: string; lastName: string; contactInformation: string }) => {
//     try {
//       console.log('➕ Creating officer:', data);
//       const response = await officersApi.create(data);
//       console.log('📦 Create response:', response);
//       showToast('Officer created successfully', 'success');
//       await fetchOfficers();
//       return response;
//     } catch (error: any) {
//       console.error('❌ Create officer error:', error);
//       showToast(error.message || 'Failed to create officer', 'error');
//       throw error;
//     }
//   }, [fetchOfficers, showToast]);

//   const updateOfficer = useCallback(async (data: { id: number; firstName: string; lastName: string; contactInformation: string }) => {
//     try {
//       console.log('✏️ Updating officer:', data);
//       await officersApi.update(data);
//       showToast('Officer updated successfully', 'success');
//       await fetchOfficers();
//     } catch (error: any) {
//       console.error('❌ Update officer error:', error);
//       showToast(error.message || 'Failed to update officer', 'error');
//       throw error;
//     }
//   }, [fetchOfficers, showToast]);

//   const deleteOfficer = useCallback(async (id: number) => {
//     try {
//       console.log('🗑️ Deleting officer:', id);
//       await officersApi.delete(id);
//       showToast('Officer deleted successfully', 'success');
//       await fetchOfficers();
//     } catch (error: any) {
//       console.error('❌ Delete officer error:', error);
//       showToast(error.message || 'Failed to delete officer', 'error');
//       throw error;
//     }
//   }, [fetchOfficers, showToast]);

//   const goToPage = useCallback((page: number) => {
//     if (page >= 1 && page <= pagination.totalPages) {
//       setParams(prev => ({ ...prev, page }));
//     }
//   }, [pagination.totalPages]);

//   const changePageSize = useCallback((pageSize: number) => {
//     setParams(prev => ({ ...prev, pageSize, page: 1 }));
//   }, []);

//   const applyFilters = useCallback((filters: Partial<OfficersQueryParams>) => {
//     setParams(prev => ({ ...prev, ...filters, page: 1, pageSize: prev.pageSize || 3 }));
//   }, []);

//   useEffect(() => {
//     fetchOfficers();
//   }, [fetchOfficers]);

//   return {
//     officers,
//     isLoading,
//     error,
//     pagination,
//     params,
//     fetchOfficers,
//     createOfficer,
//     updateOfficer,
//     deleteOfficer,
//     goToPage,
//     changePageSize,
//     applyFilters,
//   };
// };

// src/hooks/useOfficers.ts
import { useState, useEffect, useCallback } from 'react';
import { officersApi } from '../api/sso-officers';
import type { SSOfficer, OfficersQueryParams } from '../types/sso-officer.types';
import { useToast } from './useToast';

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 3,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const useOfficers = (initialParams: OfficersQueryParams = {}) => {
  const [officers, setOfficers] = useState<SSOfficer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [params, setParams] = useState<OfficersQueryParams>({
    page: 1,
    pageSize: 3,
    ...initialParams,
  });
  const { showToast } = useToast();

  const fetchOfficers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching officers with params:', params);
      const response = await officersApi.get(params);
      console.log('📦 Raw API Response:', response);

      let officersData: SSOfficer[] = [];
      let paginationData = DEFAULT_PAGINATION;

      if (response && typeof response === 'object') {
        if ('items' in response && Array.isArray(response.items)) {
          officersData = response.items;
          paginationData = {
            page: response.page || 1,
            pageSize: response.pageSize || 3,
            totalCount: response.totalCount || 0,
            totalPages: response.totalPages || 0,
            hasPreviousPage: response.hasPreviousPage || false,
            hasNextPage: response.hasNextPage || false,
          };
          console.log('✅ Using backend shape with items:', officersData);
        } else if (Array.isArray(response)) {
          officersData = response;
          console.log('✅ Response is direct array:', officersData);
        }
      }

      setOfficers(officersData);
      setPagination(paginationData);

      if (officersData.length === 0) {
        console.log('ℹ️ No officers found in response');
      }
    } catch (error: any) {
      console.error('❌ Fetch officers error:', error);
      setError(error.message || 'Failed to load officers');
      setOfficers([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const createOfficer = useCallback(
    async (data: { firstName: string; lastName: string; contactInformation: string }) => {
      try {
        console.log('➕ Creating officer:', data);
        const response = await officersApi.create(data);
        console.log('📦 Create response:', response);
        showToast('Officer created successfully', 'success');
        await fetchOfficers();
        return response;
      } catch (error: any) {
        console.error('❌ Create officer error:', error);

        // Intercept the generic backend validation error and show a helpful message
        let errorMessage = 'Failed to create officer. Please try again.';
        if (error?.message?.includes('validation errors occurred')) {
          errorMessage =
            'Please check all fields. First name, last name, and a valid contact (phone or email) are required.';
        } else if (error?.message) {
          errorMessage = error.message;
        }

        showToast(errorMessage, 'error');
        throw error;
      }
    },
    [fetchOfficers, showToast]
  );

  const updateOfficer = useCallback(
    async (data: { id: number; firstName: string; lastName: string; contactInformation: string }) => {
      try {
        console.log('✏️ Updating officer:', data);
        await officersApi.update(data);
        showToast('Officer updated successfully', 'success');
        await fetchOfficers();
      } catch (error: any) {
        console.error('❌ Update officer error:', error);

        // Intercept the generic backend validation error and show a helpful message
        let errorMessage = 'Failed to update officer. Please try again.';
        if (error?.message?.includes('validation errors occurred')) {
          errorMessage =
            'Please check all fields. First name, last name, and a valid contact (phone or email) are required.';
        } else if (error?.message) {
          errorMessage = error.message;
        }

        showToast(errorMessage, 'error');
        throw error;
      }
    },
    [fetchOfficers, showToast]
  );

  const deleteOfficer = useCallback(
    async (id: number) => {
      try {
        console.log('🗑️ Deleting officer:', id);
        await officersApi.delete(id);
        showToast('Officer deleted successfully', 'success');
        await fetchOfficers();
      } catch (error: any) {
        console.error('❌ Delete officer error:', error);
        showToast(error.message || 'Failed to delete officer', 'error');
        throw error;
      }
    },
    [fetchOfficers, showToast]
  );

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

  const applyFilters = useCallback((filters: Partial<OfficersQueryParams>) => {
    setParams((prev) => ({ ...prev, ...filters, page: 1, pageSize: prev.pageSize || 3 }));
  }, []);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  return {
    officers,
    isLoading,
    error,
    pagination,
    params,
    fetchOfficers,
    createOfficer,
    updateOfficer,
    deleteOfficer,
    goToPage,
    changePageSize,
    applyFilters,
  };
};