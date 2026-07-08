// src/types/disposal-item.types.ts
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
  isDonated: boolean;           // ✅ ADDED - matches backend
  donatedAt: string | null;     // ✅ ADDED - matches backend
  sourceLostItemId?: number | null;
  isClaimed: boolean;
  isExpired: boolean;
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