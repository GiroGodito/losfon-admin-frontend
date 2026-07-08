// src/api/auth.ts
import { api } from './client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    username: string;
    fullName: string;
    email: string;
    expiresAt?: string;
  };
  message?: string;
}

export interface ProfileResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  username?: string;
  fullName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/login', data, {
      headers: {
        'X-RateLimit-Policy': 'AdminLoginPolicy' // ✅ Inform backend this is admin login
      }
    }),

  logout: (): Promise<{ success: boolean; message: string }> =>
    api.post<{ success: boolean; message: string }>('/auth/logout'),

  getProfile: (): Promise<ProfileResponse> =>
    api.get<ProfileResponse>('/auth/profile'),

  updateProfile: (data: UpdateProfileRequest): Promise<{ success: boolean; message: string }> =>
    api.put<{ success: boolean; message: string }>('/auth/profile', data),

  changePassword: (data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> =>
    api.post<{ success: boolean; message: string }>('/auth/change-password', data),
};