// src/types/found-item.types.ts
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
  isDonated: boolean;                    // ✅ ADDED
  donatedAt: string | null;              // ✅ ADDED
  sourceLostItemId?: number | null;      // ✅ ADDED - references the lost item this came from
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