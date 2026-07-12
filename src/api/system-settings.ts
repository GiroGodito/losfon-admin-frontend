// src/api/system-settings.ts
import { api } from './client';

export interface UpdateExpirationDaysRequest {
  days: number;
}

export interface ExpirationDaysResponse {
  success: boolean;
  days: number;
  message?: string;
}

export const systemSettingsApi = {
  // Get current expiration days
  getExpirationDays: (): Promise<ExpirationDaysResponse> =>
    api.get<ExpirationDaysResponse>('/SystemSettings/expiration-days'),

  // Update expiration days
  updateExpirationDays: (data: UpdateExpirationDaysRequest): Promise<ExpirationDaysResponse> =>
    api.put<ExpirationDaysResponse>('/SystemSettings/expiration-days', data),
};