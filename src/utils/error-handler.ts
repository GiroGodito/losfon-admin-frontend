// src/utils/error-handler.ts
import type { ApiError } from '../types/common.types';

export function formatErrorMessage(error: ApiError | Error | unknown): string {
  if ((error as ApiError).status) {
    const apiError = error as ApiError;
    switch (apiError.status) {
      case 400:
        return `Bad Request: ${apiError.message}`;
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return apiError.message || 'Resource not found.';
      case 422:
        return apiError.message || 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return apiError.message || 'An unexpected error occurred.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred.';
}

export function handleApiError(error: unknown): string {
  return formatErrorMessage(error);
}