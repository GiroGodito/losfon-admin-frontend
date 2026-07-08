// src/types/auth.types.ts
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export interface LoginCredentials {
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