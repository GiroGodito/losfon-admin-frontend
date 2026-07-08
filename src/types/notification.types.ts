// src/types/notification.types.ts
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
  // Enriched fields for display
  itemName?: string;
  itemImage?: string;
  foundBy?: string;
  foundDate?: string;
  claimedBy?: string;
  claimedDate?: string;
}