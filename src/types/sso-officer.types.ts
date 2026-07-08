// src/api/sso-officers.ts
import { api } from '../api/client';

export interface SSOfficer {
  id: number;
  firstName: string;
  lastName: string;
  contactInformation: string;
  createdAt: string;
}

export interface CreateOfficerRequest {
  firstName: string;
  lastName: string;
  contactInformation: string;
}

export interface UpdateOfficerRequest {
  id: number;
  firstName: string;
  lastName: string;
  contactInformation: string;
}

export interface OfficersQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

// ✅ Updated to match backend response shape
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  dateFrom?: string | null;
  dateTo?: string | null;
  searchTerm?: string | null;
  sortBy?: string;
  sortDirection?: string;
}

export const officersApi = {
  get: (params: OfficersQueryParams = {}): Promise<PaginatedResponse<SSOfficer>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    console.log('🔍 API Call: /SSOfficers?' + queryParams.toString());
    return api.get<PaginatedResponse<SSOfficer>>(`/SSOfficers?${queryParams.toString()}`);
  },

  getAll: (): Promise<SSOfficer[]> =>
    api.get<SSOfficer[]>('/SSOfficers/all'),

  getById: (id: number): Promise<SSOfficer> =>
    api.get<SSOfficer>(`/SSOfficers/${id}`),

  create: (data: CreateOfficerRequest): Promise<{ id: number; success?: boolean; message?: string }> => {
    console.log('➕ API Call: POST /SSOfficers', data);
    return api.post<{ id: number; success?: boolean; message?: string }>('/SSOfficers', data);
  },

  update: (data: UpdateOfficerRequest): Promise<void> => {
    console.log('✏️ API Call: PUT /SSOfficers/' + data.id, data);
    return api.put<void>(`/SSOfficers/${data.id}`, data);
  },

  delete: (id: number): Promise<void> => {
    console.log('🗑️ API Call: DELETE /SSOfficers/' + id);
    return api.delete<void>(`/SSOfficers/${id}`);
  },
};