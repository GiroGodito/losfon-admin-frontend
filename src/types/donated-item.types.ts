// src/types/donated-item.types.ts

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
  itemsPerPage: number;  // ✅ ADD THIS - optional since backend sends it
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

// ✅ FIXED: Match backend PaginatedResult shape (NO 'success' wrapper)
export interface PaginatedResponse<T> {
  items: T[];                  // ← "items" NOT "data"
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