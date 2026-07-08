// src/api/pdf.ts
import { api } from './client';

export interface PrintRequest {
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export const pdfApi = {
  generateLostItems: (data: PrintRequest): Promise<Blob> =>
    api.post<Blob>('/Pdf/lost-items', data, { responseType: 'blob' }),

  generateFoundItems: (data: PrintRequest): Promise<Blob> =>
    api.post<Blob>('/Pdf/found-items', data, { responseType: 'blob' }),

  generateClaimedItems: (data: PrintRequest): Promise<Blob> =>
    api.post<Blob>('/Pdf/claimed-items', data, { responseType: 'blob' }),

  generateDisposalItems: (data: PrintRequest): Promise<Blob> =>
    api.post<Blob>('/Pdf/disposal-items', data, { responseType: 'blob' }),

  generateColdCaseItems: (data: PrintRequest): Promise<Blob> =>
    api.post<Blob>('/Pdf/cold-case-items', data, { responseType: 'blob' }),

  generateDonatedItems: (data: PrintRequest): Promise<Blob> =>
    api.post<Blob>('/Pdf/donated-items', data, { responseType: 'blob' }),
};