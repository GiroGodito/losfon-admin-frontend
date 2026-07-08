// src/types/cold-case-item.types.ts
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