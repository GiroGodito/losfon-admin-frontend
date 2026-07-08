// src/api/upload.ts
import { api } from './client';

export const uploadApi = {
  uploadImage: (file: File): Promise<{ success: boolean; imageUrl: string; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ success: boolean; imageUrl: string; message: string }>('/upload', formData);
  },

  deleteImage: (imageUrl: string): Promise<{ success: boolean; message: string }> =>
    api.delete<{ success: boolean; message: string }>(`/upload?imageUrl=${encodeURIComponent(imageUrl)}`),
};