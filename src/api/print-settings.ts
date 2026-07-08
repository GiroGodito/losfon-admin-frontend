// src/api/print-settings.ts
import { api } from './client';

export interface PrintSetting {
  id: number;
  settingKey: string;
  settingValue: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePrintSettingRequest {
  settingKey: string;
  settingValue: string;
  description?: string;
}

export interface OfficerSetting {
  officerId: number;
  firstName: string;
  lastName: string;
  contactInformation: string;
  isDefault: boolean;
}

export interface PrintLog {
  id: number;
  reportType: string;
  officerId: number;
  officerName: string;
  dateFrom: string | null;
  dateTo: string | null;
  searchTerm: string | null;
  itemCount: number;
  printedBy: number | null;
  printedByName: string | null;
  printedAt: string;
}

export interface PrintLogsQueryParams {
  reportType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

// ✅ FIXED: Match backend PaginatedResult shape
export interface PaginatedResponse<T> {
  items: T[];
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

export const printSettingsApi = {
  getSettings: (): Promise<{ success: boolean; data: PrintSetting[] }> =>
    api.get<{ success: boolean; data: PrintSetting[] }>('/PrintSettings/settings'),

  getSetting: (key: string): Promise<{ success: boolean; data: PrintSetting }> =>
    api.get<{ success: boolean; data: PrintSetting }>(`/PrintSettings/settings/${key}`),

  updateSetting: (data: UpdatePrintSettingRequest): Promise<{ success: boolean; message: string }> =>
    api.put<{ success: boolean; message: string }>('/PrintSettings/settings', data),

  getDefaultOfficer: (): Promise<{ success: boolean; data: OfficerSetting }> =>
    api.get<{ success: boolean; data: OfficerSetting }>('/PrintSettings/officer/default'),

  getAllOfficers: (): Promise<{ success: boolean; data: OfficerSetting[] }> =>
    api.get<{ success: boolean; data: OfficerSetting[] }>('/PrintSettings/officers'),

  setDefaultOfficer: (officerId: number): Promise<{ success: boolean; message: string }> =>
    api.post<{ success: boolean; message: string }>('/PrintSettings/officer/default', { officerId }),

  getPrintLogs: (params: PrintLogsQueryParams = {}): Promise<PaginatedResponse<PrintLog>> => {
    const queryParams = new URLSearchParams();
    if (params.reportType) queryParams.append('reportType', params.reportType);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
    return api.get<PaginatedResponse<PrintLog>>(`/PrintSettings/logs?${queryParams.toString()}`);
  },

  logPrintActivity: (data: {
    reportType: string;
    officerId: number;
    itemCount: number;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }): Promise<{ success: boolean; logId: number; message: string }> =>
    api.post<{ success: boolean; logId: number; message: string }>('/PrintSettings/log', data),
};