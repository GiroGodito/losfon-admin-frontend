// src/types/print-settings.types.ts
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
  fullName?: string;                      // ✅ ADDED - computed full name
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

export interface PrintRequest {
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}