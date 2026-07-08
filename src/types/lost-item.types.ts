// src/types/lost-item.types.ts
export interface LostItem {
  id: number;
  itemDescription: string;
  dateReported: string;
  reportedBy: string;
  contactNumber: string;
  isDone: boolean;
  isExpired: boolean;
  dateTransferred: string | null;
  isSeen: boolean;
  filePath: string | null;
  createdAt: string;
  updatedAt: string;
  userId?: number;                        // ✅ ADDED - references the user who reported it
  studentName?: string;                  // ✅ ADDED - for display
  studentIdNumber?: string;              // ✅ ADDED - for display
}

export interface CreateLostItemRequest {
  itemDescription: string;
  reportedBy?: string;
  contactNumber?: string;
  filePath?: string | null;
  userId?: number | null;
}

export interface UpdateLostItemRequest {
  id: number;
  itemDescription: string;
  reportedBy: string;
  contactNumber: string;
  filePath?: string | null;
}

export interface MarkAsFoundRequest {
  turnInBy?: string;
  foundBy?: string;
  filePath?: string;
}

export interface LostItemsQueryParams {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}