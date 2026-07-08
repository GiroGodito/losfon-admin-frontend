// src/api/cold-case-items.ts
import { api } from './client';

export interface ColdCaseItem {
  id: number;
  itemDescription: string;
  dateReported: string;
  reportedBy: string;
  contactNumber: string;
  dateTransferred: string | null;
  isSeen: boolean;
  filePath: string | null;
  daysInColdCase: number;
}

export interface CreateColdCaseItemRequest {
  itemDescription: string;
  reportedBy: string;
  contactNumber: string;
  dateReported?: string;
  filePath?: string | null;
}

export interface MarkAsFoundRequest {
  turnInBy?: string;
  foundBy?: string;
  filePath?: string;
}

export interface ColdCaseItemsQueryParams {
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

export const coldCaseItemsApi = {
  get: (params: ColdCaseItemsQueryParams = {}): Promise<PaginatedResponse<ColdCaseItem>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return api.get<PaginatedResponse<ColdCaseItem>>(`/ColdCaseItems?${queryParams.toString()}`);
  },

  getAll: (): Promise<ColdCaseItem[]> =>
    api.get<ColdCaseItem[]>('/ColdCaseItems/all'),

  getById: (id: number): Promise<ColdCaseItem> =>
    api.get<ColdCaseItem>(`/ColdCaseItems/${id}`),

  getUnseenCount: (): Promise<{ count: number }> =>
    api.get<{ count: number }>('/ColdCaseItems/unseen-count'),

  create: (data: CreateColdCaseItemRequest): Promise<{ id: number }> =>
    api.post<{ id: number }>('/ColdCaseItems', data),

  markAsSeen: (id: number): Promise<void> =>
    api.post<void>(`/ColdCaseItems/${id}/mark-seen`),

  markAllAsSeen: (): Promise<{ success: boolean; markedCount: number }> =>
    api.post<{ success: boolean; markedCount: number }>('/ColdCaseItems/mark-all-seen'),

  markAsFound: (id: number, data: MarkAsFoundRequest): Promise<{ success: boolean; message: string }> =>
    api.post<{ success: boolean; message: string }>(`/ColdCaseItems/${id}/mark-found`, data),

  undoMarkAsFound: (id: number): Promise<{ success: boolean; message: string }> =>
    api.post<{ success: boolean; message: string }>(`/ColdCaseItems/${id}/undo-mark-found`),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`/ColdCaseItems/${id}`),
};