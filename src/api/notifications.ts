// src/api/notifications.ts
import { api } from './client';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  relatedEntityId: number | null;
  relatedEntityType: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  itemName?: string;
  itemImage?: string;
  foundBy?: string;
  foundDate?: string;
  claimedBy?: string;
  claimedDate?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  unreadCount: number;
}

export const notificationsApi = {
  getNotifications: (page = 1, pageSize = 10): Promise<PaginatedResponse<Notification>> =>
    api.get<PaginatedResponse<Notification>>(`/user/UserNotifications?page=${page}&pageSize=${pageSize}`),

  getUnreadCount: (): Promise<{ success: boolean; unreadCount: number }> =>
    api.get<{ success: boolean; unreadCount: number }>('/user/UserNotifications/unread-count'),

  markAsRead: (id: number): Promise<{ success: boolean }> =>
    api.post<{ success: boolean }>(`/user/UserNotifications/${id}/mark-read`),

  markAllAsRead: (): Promise<{ success: boolean }> =>
    api.post<{ success: boolean }>('/user/UserNotifications/mark-all-read'),

  getNotificationDetails: (id: number): Promise<Notification> =>
    api.get<Notification>(`/user/UserNotifications/${id}`),
};