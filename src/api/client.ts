// // src/api/client.ts
// import type { DeviceFingerprint } from '../utils/fingerprint';

// const API_BASE_URL = '/api';

// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   pagination?: {
//     page: number;
//     pageSize: number;
//     totalCount: number;
//     totalPages: number;
//     hasPreviousPage: boolean;
//     hasNextPage: boolean;
//   };
// }

// export interface ApiError {
//   status: number;
//   type: string;
//   message: string;
//   code?: string;
//   timestamp: string;
//   retryAfter?: number;
// }

// let deviceFingerprint: DeviceFingerprint | null = null;

// async function getDeviceFingerprintHeaders(): Promise<Record<string, string>> {
//   if (!deviceFingerprint) {
//     try {
//       const { getDeviceFingerprint } = await import('../utils/fingerprint');
//       deviceFingerprint = await getDeviceFingerprint();
//       console.log('✅ Device fingerprint generated');
//     } catch (error) {
//       console.warn('Failed to generate device fingerprint:', error);
//       return {};
//     }
//   }
  
//   return {
//     'X-Canvas-Fingerprint': deviceFingerprint.canvas || '',
//     'X-User-Agent': deviceFingerprint.userAgent || '',
//     'X-Accept-Language': deviceFingerprint.language || '',
//     'X-Screen-Resolution': deviceFingerprint.screenResolution || '',
//     'X-Timezone': deviceFingerprint.timezone || '',
//     'X-Color-Depth': String(deviceFingerprint.colorDepth || 0),
//     'X-Touch-Support': String(deviceFingerprint.touchSupport || false),
//   };
// }

// export async function apiFetch<T = any>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const url = `${API_BASE_URL}${endpoint}`;

//   const headers: Record<string, string> = {
//     'Accept': 'application/json',
//   };

//   // ✅ Add fingerprint headers for auth endpoints
//   const isAuthEndpoint = endpoint.includes('/login') || endpoint.includes('/register');
//   if (isAuthEndpoint) {
//     const fingerprintHeaders = await getDeviceFingerprintHeaders();
//     Object.assign(headers, fingerprintHeaders);
//   }

//   // Copy existing headers
//   if (options.headers) {
//     const existingHeaders = options.headers as Record<string, string>;
//     Object.keys(existingHeaders).forEach(key => {
//       headers[key] = existingHeaders[key];
//     });
//   }

//   // Set Content-Type for JSON bodies
//   if (options.body && !(options.body instanceof FormData)) {
//     headers['Content-Type'] = 'application/json';
//   }

//   const fetchOptions: RequestInit = {
//     ...options,
//     headers: headers as HeadersInit,
//     credentials: 'include',
//     mode: 'cors',
//     cache: 'no-store',
//   };

//   try {
//     const response = await fetch(url, fetchOptions);

//     // Handle 204 No Content
//     if (response.status === 204) {
//       return {} as T;
//     }

//     const contentType = response.headers.get('content-type') || '';
//     let data: any;

//     if (contentType.includes('application/json')) {
//       data = await response.json();
//     } else if (contentType.includes('text/')) {
//       data = await response.text();
//     } else {
//       try {
//         data = await response.json();
//       } catch {
//         data = await response.text();
//       }
//     }

//     // Handle error responses
//     if (!response.ok) {
//       let errorMessage = response.statusText || 'An error occurred';
//       let errorType = 'UnknownError';
//       let errorCode = undefined;
//       let retryAfter = undefined;
      
//       if (data && typeof data === 'object') {
//         errorMessage = data.message || data.error || data.title || response.statusText || 'An error occurred';
//         errorType = data.type || data.errorType || 'UnknownError';
//         errorCode = data.code || data.errorCode;
//       } else if (typeof data === 'string' && data.length > 0) {
//         errorMessage = data;
//       }

//       // ✅ Handle rate limiting (429)
//       if (response.status === 429) {
//         errorType = 'RateLimitError';
//         const retryAfterHeader = response.headers.get('Retry-After');
//         if (retryAfterHeader) {
//           retryAfter = parseInt(retryAfterHeader, 10);
//         }
//         if (data?.retryAfter) {
//           retryAfter = data.retryAfter;
//         }
        
//         // ✅ Special handling for admin login rate limits
//         if (endpoint.includes('/auth/login')) {
//           errorMessage = 'Too many admin login attempts. Please wait before trying again.';
//         }
//       }
      
//       const error: ApiError = {
//         status: response.status,
//         type: errorType,
//         message: errorMessage,
//         code: errorCode,
//         timestamp: data?.timestamp || new Date().toISOString(),
//         retryAfter,
//       };
//       throw error;
//     }

//     return data;
//   } catch (error) {
//     // Network errors
//     if (error instanceof TypeError && error.message === 'Failed to fetch') {
//       throw {
//         status: 0,
//         type: 'NetworkError',
//         message: 'Unable to connect to the server. Please check if the backend is running.',
//         timestamp: new Date().toISOString(),
//       } as ApiError;
//     }
    
//     if (error instanceof Error && error.message.includes('fetch')) {
//       throw {
//         status: 0,
//         type: 'NetworkError',
//         message: 'Network error. Please check your internet connection.',
//         timestamp: new Date().toISOString(),
//       } as ApiError;
//     }

//     // Re-throw ApiError as is
//     if ((error as ApiError).status !== undefined) {
//       throw error;
//     }

//     // Unknown errors
//     throw {
//       status: 0,
//       type: 'UnknownError',
//       message: error instanceof Error ? error.message : 'An unexpected error occurred',
//       timestamp: new Date().toISOString(),
//     } as ApiError;
//   }
// }

// export const api = {
//   get: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
//     apiFetch<T>(endpoint, { ...options, method: 'GET' }),
//   post: <T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> =>
//     apiFetch<T>(endpoint, {
//       ...options,
//       method: 'POST',
//       body: body instanceof FormData ? body : JSON.stringify(body),
//     }),
//   put: <T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> =>
//     apiFetch<T>(endpoint, {
//       ...options,
//       method: 'PUT',
//       body: body instanceof FormData ? body : JSON.stringify(body),
//     }),
//   patch: <T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> =>
//     apiFetch<T>(endpoint, {
//       ...options,
//       method: 'PATCH',
//       body: body instanceof FormData ? body : JSON.stringify(body),
//     }),
//   delete: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
//     apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
// };

// export default api; LAST WORKING IMPLEMENTATION

// src/api/client.ts
import type { DeviceFingerprint } from '../utils/fingerprint';

const API_BASE_URL = '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface ApiError {
  status: number;
  type: string;
  message: string;
  code?: string;
  timestamp: string;
  retryAfter?: number;
}

// ✅ Custom options extending RequestInit with responseType
export interface ApiRequestOptions extends RequestInit {
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer';
}

let deviceFingerprint: DeviceFingerprint | null = null;

async function getDeviceFingerprintHeaders(): Promise<Record<string, string>> {
  if (!deviceFingerprint) {
    try {
      const { getDeviceFingerprint } = await import('../utils/fingerprint');
      deviceFingerprint = await getDeviceFingerprint();
      console.log('✅ Device fingerprint generated');
    } catch (error) {
      console.warn('Failed to generate device fingerprint:', error);
      return {};
    }
  }
  
  return {
    'X-Canvas-Fingerprint': deviceFingerprint.canvas || '',
    'X-User-Agent': deviceFingerprint.userAgent || '',
    'X-Accept-Language': deviceFingerprint.language || '',
    'X-Screen-Resolution': deviceFingerprint.screenResolution || '',
    'X-Timezone': deviceFingerprint.timezone || '',
    'X-Color-Depth': String(deviceFingerprint.colorDepth || 0),
    'X-Touch-Support': String(deviceFingerprint.touchSupport || false),
  };
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}  // ✅ Use custom type
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  // ✅ Add fingerprint headers for auth endpoints
  const isAuthEndpoint = endpoint.includes('/login') || endpoint.includes('/register');
  if (isAuthEndpoint) {
    const fingerprintHeaders = await getDeviceFingerprintHeaders();
    Object.assign(headers, fingerprintHeaders);
  }

  // Copy existing headers
  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>;
    Object.keys(existingHeaders).forEach(key => {
      headers[key] = existingHeaders[key];
    });
  }

  // Set Content-Type for JSON bodies
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // ✅ For blob responses, set Accept header properly
  if (options.responseType === 'blob') {
    headers['Accept'] = 'application/pdf';
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: headers as HeadersInit,
    credentials: 'include',
    mode: 'cors',
    cache: 'no-store',
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // ✅ Handle blob responses (PDF, images, etc.)
    if (options.responseType === 'blob') {
      // Check for error responses
      if (!response.ok) {
        // Try to read as text for error message
        try {
          const text = await response.text();
          const error = JSON.parse(text);
          throw {
            status: response.status,
            type: error.type || 'Error',
            message: error.message || response.statusText,
            timestamp: new Date().toISOString(),
          } as ApiError;
        } catch {
          // If can't parse as JSON, use status text
          throw {
            status: response.status,
            type: 'Error',
            message: response.statusText || 'Failed to generate PDF',
            timestamp: new Date().toISOString(),
          } as ApiError;
        }
      }
      
      const blob = await response.blob();
      return blob as T;
    }

    const contentType = response.headers.get('content-type') || '';
    let data: any;

    // Handle JSON responses
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/')) {
      data = await response.text();
    } else {
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
    }

    // Handle error responses
    if (!response.ok) {
      let errorMessage = response.statusText || 'An error occurred';
      let errorType = 'UnknownError';
      let errorCode = undefined;
      let retryAfter = undefined;
      
      if (data && typeof data === 'object') {
        errorMessage = data.message || data.error || data.title || response.statusText || 'An error occurred';
        errorType = data.type || data.errorType || 'UnknownError';
        errorCode = data.code || data.errorCode;
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      }

      // ✅ Handle rate limiting (429)
      if (response.status === 429) {
        errorType = 'RateLimitError';
        const retryAfterHeader = response.headers.get('Retry-After');
        if (retryAfterHeader) {
          retryAfter = parseInt(retryAfterHeader, 10);
        }
        if (data?.retryAfter) {
          retryAfter = data.retryAfter;
        }
        
        // ✅ Special handling for admin login rate limits
        if (endpoint.includes('/auth/login')) {
          errorMessage = 'Too many admin login attempts. Please wait before trying again.';
        }
      }
      
      const error: ApiError = {
        status: response.status,
        type: errorType,
        message: errorMessage,
        code: errorCode,
        timestamp: data?.timestamp || new Date().toISOString(),
        retryAfter,
      };
      throw error;
    }

    return data;
  } catch (error) {
    // Network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw {
        status: 0,
        type: 'NetworkError',
        message: 'Unable to connect to the server. Please check if the backend is running.',
        timestamp: new Date().toISOString(),
      } as ApiError;
    }
    
    if (error instanceof Error && error.message.includes('fetch')) {
      throw {
        status: 0,
        type: 'NetworkError',
        message: 'Network error. Please check your internet connection.',
        timestamp: new Date().toISOString(),
      } as ApiError;
    }

    // Re-throw ApiError as is
    if ((error as ApiError).status !== undefined) {
      throw error;
    }

    // Unknown errors
    throw {
      status: 0,
      type: 'UnknownError',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    } as ApiError;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: ApiRequestOptions): Promise<T> =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  put: <T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  patch: <T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  delete: <T>(endpoint: string, options?: ApiRequestOptions): Promise<T> =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;