// src/api/disposal-items.ts
import { api } from './client';

export interface DisposalItem {
  id: number;
  itemDescription: string;
  dateFound: string;
  foundBy: string | null;
  turnInBy: string;
  dateTransferred: string | null;
  isSeen: boolean;
  filePath: string | null;
  daysInDisposal: number;
  isDonated: boolean;              // ✅ ADDED - matches backend
  donatedAt: string | null;        // ✅ ADDED - matches backend
  sourceLostItemId?: number | null; // ✅ ADDED - matches backend
  isClaimed: boolean;              // ✅ ADDED - matches backend
  isExpired: boolean;              // ✅ ADDED - matches backend
}

export interface CreateDisposalItemRequest {
  itemDescription: string;
  foundBy?: string;
  turnInBy: string;
  dateFound?: string;
  filePath?: string | null;
}

export interface DisposalItemsQueryParams {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

// ✅ FIXED: Match backend PaginatedResult shape
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  dateFrom?: string | null;
  dateTo?: string | null;
  searchTerm?: string | null;
  sortBy?: string;
  sortDirection?: string;
}

export const disposalItemsApi = {
  get: (params: DisposalItemsQueryParams = {}): Promise<PaginatedResponse<DisposalItem>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return api.get<PaginatedResponse<DisposalItem>>(`/Disposal?${queryParams.toString()}`);
  },

  getAll: (): Promise<DisposalItem[]> =>
    api.get<DisposalItem[]>('/Disposal/all'),

  getById: (id: number): Promise<DisposalItem> =>
    api.get<DisposalItem>(`/Disposal/${id}`),

  getUnseenCount: (): Promise<{ count: number }> =>
    api.get<{ count: number }>('/Disposal/unseen-count'),

  create: (data: CreateDisposalItemRequest): Promise<{ id: number }> =>
    api.post<{ id: number }>('/Disposal', data),

  markAsSeen: (id: number): Promise<void> =>
    api.post<void>(`/Disposal/${id}/mark-seen`),

  markAllAsSeen: (): Promise<{ success: boolean; markedCount: number }> =>
    api.post<{ success: boolean; markedCount: number }>('/Disposal/mark-all-seen'),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`/Disposal/${id}`),

  donateAll: (): Promise<{ success: boolean; message: string; donatedCount: number }> =>
    api.post<{ success: boolean; message: string; donatedCount: number }>('/Disposal/donate?confirm=CONFIRM_DONATE'),

  restoreAll: (): Promise<{ success: boolean; message: string; restoredCount: number }> =>
    api.post<{ success: boolean; message: string; restoredCount: number }>('/Disposal/restore-all?confirm=CONFIRM_RESTORE'),
};