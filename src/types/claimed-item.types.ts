// src/types/claimed-item.types.ts
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
  sourceFoundItemId?: number | null;  // ✅ ADDED - references the found item this came from
}

export interface CreateClaimedItemRequest {
  itemDescription: string;
  userId?: number | null;
  claimedBy?: string;
  releasedBy?: string;
  claimedContactInformation?: string;
  filePath?: string | null;
  sourceFoundItemId?: number | null;  // ✅ ADDED
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