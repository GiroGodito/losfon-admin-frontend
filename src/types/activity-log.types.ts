// src/types/activity-log.types.ts
export interface ActivityLog {
  id: number;
  actionType: string;
  description: string;
  entityType: string | null;
  entityId: number | null;
  entityName: string | null;
  itemCount: number | null;
  userName: string;
  userEmail: string;
  ipAddress: string;
  createdAt: string;
  additionalData: string | null;
  userAgent: string | null;  // ✅ ADD THIS
}

export interface ActivityLogsQueryParams {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  actionType?: string;
  entityType?: string;
  userId?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}