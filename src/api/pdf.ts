// // src/api/pdf.ts
// import { api } from './client';

// export interface PrintRequest {
//   dateFrom?: string;
//   dateTo?: string;
//   searchTerm?: string;
//   sortBy?: string;
//   sortDirection?: 'ASC' | 'DESC';
// }

// export const pdfApi = {
//   generateLostItems: (data: PrintRequest): Promise<Blob> =>
//     api.post<Blob>('/Pdf/lost-items', data, { responseType: 'blob' }),

//   generateFoundItems: (data: PrintRequest): Promise<Blob> =>
//     api.post<Blob>('/Pdf/found-items', data, { responseType: 'blob' }),

//   generateClaimedItems: (data: PrintRequest): Promise<Blob> =>
//     api.post<Blob>('/Pdf/claimed-items', data, { responseType: 'blob' }),

//   generateDisposalItems: (data: PrintRequest): Promise<Blob> =>
//     api.post<Blob>('/Pdf/disposal-items', data, { responseType: 'blob' }),

//   generateColdCaseItems: (data: PrintRequest): Promise<Blob> =>
//     api.post<Blob>('/Pdf/cold-case-items', data, { responseType: 'blob' }),

//   generateDonatedItems: (data: PrintRequest): Promise<Blob> =>
//     api.post<Blob>('/Pdf/donated-items', data, { responseType: 'blob' }),
// };

export interface PrintRequest {
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

// ✅ Add a dedicated fetch function for blob responses
async function fetchBlob(endpoint: string, data: PrintRequest): Promise<Blob> {
  const url = `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7149/api'}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/pdf',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const error = JSON.parse(text);
      throw new Error(error.message || 'Failed to generate PDF');
    } catch {
      throw new Error(text || 'Failed to generate PDF');
    }
  }

  return response.blob();
}

export const pdfApi = {
  generateLostItems: (data: PrintRequest): Promise<Blob> =>
    fetchBlob('/Pdf/lost-items', data),

  generateFoundItems: (data: PrintRequest): Promise<Blob> =>
    fetchBlob('/Pdf/found-items', data),

  generateClaimedItems: (data: PrintRequest): Promise<Blob> =>
    fetchBlob('/Pdf/claimed-items', data),

  generateDisposalItems: (data: PrintRequest): Promise<Blob> =>
    fetchBlob('/Pdf/disposal-items', data),

  generateColdCaseItems: (data: PrintRequest): Promise<Blob> =>
    fetchBlob('/Pdf/cold-case-items', data),

  generateDonatedItems: (data: PrintRequest): Promise<Blob> =>
    fetchBlob('/Pdf/donated-items', data),
};