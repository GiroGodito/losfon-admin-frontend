// src/api/found-items.ts
import { api } from './client';

export interface FoundItem {
  id: number;
  itemDescription: string;
  dateFound: string;
  foundBy: string | null;
  turnInBy: string;
  isClaimed: boolean;
  isExpired: boolean;
  dateTransferred: string | null;
  isSeen: boolean;
  filePath: string | null;
  createdAt: string;
  updatedAt: string;
  isDonated: boolean;
  donatedAt: string | null;
  sourceLostItemId?: number | null;
}

export interface CreateFoundItemRequest {
  itemDescription: string;
  foundBy?: string;
  turnInBy: string;
  filePath?: string | null;
}

export interface UpdateFoundItemRequest {
  id: number;
  itemDescription: string;
  foundBy?: string;
  turnInBy: string;
  filePath?: string | null;
}

export interface MarkAsClaimedRequest {
  claimedBy: string;
  releasedBy: string;
  claimedContactInformation: string;
  userId?: number | null;  // ✅ FIXED - Added userId
}

export interface FoundItemsQueryParams {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

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

const formatDateParam = (date: string, isEndOfDay: boolean = false): string => {
  if (!date) return '';
  if (isEndOfDay) {
    return `${date}T23:59:59`;
  }
  return `${date}T00:00:00`;
};

export const foundItemsApi = {
  getActive: (params: FoundItemsQueryParams = {}): Promise<PaginatedResponse<FoundItem>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params.dateFrom) {
      queryParams.append('dateFrom', formatDateParam(params.dateFrom, false));
    }
    if (params.dateTo) {
      queryParams.append('dateTo', formatDateParam(params.dateTo, true));
    }
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return api.get<PaginatedResponse<FoundItem>>(`/FoundItems?${queryParams.toString()}`);
  },

  getAll: (params: FoundItemsQueryParams = {}): Promise<PaginatedResponse<FoundItem>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params.dateFrom) {
      queryParams.append('dateFrom', formatDateParam(params.dateFrom, false));
    }
    if (params.dateTo) {
      queryParams.append('dateTo', formatDateParam(params.dateTo, true));
    }
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return api.get<PaginatedResponse<FoundItem>>(`/FoundItems/all?${queryParams.toString()}`);
  },

  getById: (id: number): Promise<FoundItem> =>
    api.get<FoundItem>(`/FoundItems/${id}`),

  getUnseenCount: (): Promise<{ count: number }> =>
    api.get<{ count: number }>('/FoundItems/unseen-count'),

  create: (data: CreateFoundItemRequest): Promise<{ id: number }> =>
    api.post<{ id: number }>('/FoundItems', data),

  update: (data: UpdateFoundItemRequest): Promise<void> =>
    api.put<void>(`/FoundItems/${data.id}`, data),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`/FoundItems/${id}`),

  markAsSeen: (id: number): Promise<void> =>
    api.post<void>(`/FoundItems/${id}/mark-seen`),

  markAsClaimed: (id: number, data: MarkAsClaimedRequest): Promise<{ success: boolean; message: string }> =>
    api.post<{ success: boolean; message: string }>(`/FoundItems/${id}/mark-claimed`, data),

  undoMarkAsClaimed: (id: number): Promise<{ success: boolean; message: string }> =>
    api.post<{ success: boolean; message: string }>(`/FoundItems/${id}/undo-mark-claimed`),
};