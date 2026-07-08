// src/api/claimed-items.ts
import { api } from './client';

export interface ClaimedItem {
  id: number;
  itemDescription: string;
  claimedBy: string;
  releasedBy: string;
  releasedDate: string;
  claimedContactInformation: string;
  filePath: string | null;
  createdAt: string;
  updatedAt: string;
  userId?: number;
  sourceFoundItemId?: number | null;
}

export interface CreateClaimedItemRequest {
  itemDescription: string;
  userId?: number | null;
  claimedBy?: string;
  releasedBy?: string;
  claimedContactInformation?: string;
  filePath?: string | null;
  sourceFoundItemId?: number | null;
}

export interface ClaimedItemsQueryParams {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

// ✅ FIXED: Match backend PaginatedResult shape (NO 'success' wrapper)
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

export interface UserInfoResponse {
  success: boolean;
  data: {
    id: number;
    fullName: string;
    email: string;
    contactNumber: string;
  };
}

export const claimedItemsApi = {
  get: (params: ClaimedItemsQueryParams = {}): Promise<PaginatedResponse<ClaimedItem>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return api.get<PaginatedResponse<ClaimedItem>>(`/ClaimedItems?${queryParams.toString()}`);
  },

  getAll: (): Promise<ClaimedItem[]> =>
    api.get<ClaimedItem[]>('/ClaimedItems/all'),

  getById: (id: number): Promise<ClaimedItem> =>
    api.get<ClaimedItem>(`/ClaimedItems/${id}`),

  getUserInfo: (userId: number): Promise<UserInfoResponse> =>
    api.get<UserInfoResponse>(`/ClaimedItems/user/${userId}/info`),

  create: (data: CreateClaimedItemRequest): Promise<{ success: boolean; id: number; message: string }> =>
    api.post<{ success: boolean; id: number; message: string }>('/ClaimedItems', data),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`/ClaimedItems/${id}`),
};