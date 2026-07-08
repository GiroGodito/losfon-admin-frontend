// src/api/donated-items.ts
import { api } from './client';

export interface DonatedItem {
  id: number;
  itemDescription: string;
  dateFound: string;
  foundBy: string | null;
  turnInBy: string;
  donatedAt: string | null;
  filePath: string | null;
  sourceLostItemId: number | null;
  rowNumber?: number;
}

export interface DonatedItemGroup {
  donationDate: string;
  itemCount: number;
  items: DonatedItem[];
  itemsPerPage: number;
}

export interface DonatedItemsQueryParams {
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

export const donatedItemsApi = {
  // ============ GET DONATED ITEMS (FLAT LIST) ============
  get: (params: DonatedItemsQueryParams = {}): Promise<PaginatedResponse<DonatedItem>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return api.get<PaginatedResponse<DonatedItem>>(`/Disposal/donated?${queryParams.toString()}`);
  },

  // ============ GET DONATED ITEMS GROUPED BY DATE ============
  getGrouped: (params: DonatedItemsQueryParams = {}): Promise<PaginatedResponse<DonatedItemGroup>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return api.get<PaginatedResponse<DonatedItemGroup>>(`/Disposal/donated/grouped?${queryParams.toString()}`);
  },
};