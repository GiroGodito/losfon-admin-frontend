// src/api/activity-logs.ts
import { api } from './client';

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
  userAgent: string | null;
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

// ✅ Backend response shape (matches ActivityLogsController)
export interface ActivityLogsResponse {
  success: boolean;
  data: ActivityLog[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  filters: {
    dateFrom: string | null;
    dateTo: string | null;
    searchTerm: string | null;
    sortBy: string;
    sortDirection: string;
  };
}

export const activityLogsApi = {
  get: (params: ActivityLogsQueryParams = {}): Promise<ActivityLogsResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.actionType) queryParams.append('actionType', params.actionType);
    if (params.entityType) queryParams.append('entityType', params.entityType);
    if (params.userId) queryParams.append('userId', String(params.userId));
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return api.get<ActivityLogsResponse>(`/ActivityLogs?${queryParams.toString()}`);
  },

  getById: (id: number): Promise<{ success: boolean; data: ActivityLog }> =>
    api.get<{ success: boolean; data: ActivityLog }>(`/ActivityLogs/${id}`),

  getByEntity: (entityType: string, entityId: number): Promise<{ success: boolean; data: ActivityLog[]; count: number }> =>
    api.get<{ success: boolean; data: ActivityLog[]; count: number }>(`/ActivityLogs/entity/${entityType}/${entityId}`),

  getByUser: (userId: number): Promise<{ success: boolean; data: ActivityLog[]; count: number }> =>
    api.get<{ success: boolean; data: ActivityLog[]; count: number }>(`/ActivityLogs/user/${userId}`),

  getByAction: (actionType: string): Promise<{ success: boolean; data: ActivityLog[]; count: number }> =>
    api.get<{ success: boolean; data: ActivityLog[]; count: number }>(`/ActivityLogs/action/${actionType}`),

  getRecent: (days: number): Promise<{ success: boolean; data: ActivityLog[]; count: number }> =>
    api.get<{ success: boolean; data: ActivityLog[]; count: number }>(`/ActivityLogs/recent/${days}`),
};