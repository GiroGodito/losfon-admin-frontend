// // src/api/lost-items.ts
// import { api } from './client';

// export interface LostItem {
//   id: number;
//   itemDescription: string;
//   dateReported: string;
//   reportedBy: string;
//   contactNumber: string;
//   isDone: boolean;
//   isExpired: boolean;
//   dateTransferred: string | null;
//   isSeen: boolean;
//   filePath: string | null;
//   createdAt: string;
//   updatedAt: string;
//   userId?: number;
//   studentName?: string;
//   studentIdNumber?: string;
// }

// export interface CreateLostItemRequest {
//   itemDescription: string;
//   reportedBy?: string;
//   contactNumber?: string;
//   filePath?: string | null;
//   userId?: number | null;
// }

// export interface UpdateLostItemRequest {
//   id: number;
//   itemDescription: string;
//   reportedBy: string;
//   contactNumber: string;
//   filePath?: string | null;
// }

// export interface MarkAsFoundRequest {
//   turnInBy?: string;
//   foundBy?: string;
//   filePath?: string;
// }

// export interface LostItemsQueryParams {
//   page?: number;
//   pageSize?: number;
//   dateFrom?: string;
//   dateTo?: string;
//   searchTerm?: string;
//   sortBy?: string;
//   sortDirection?: 'ASC' | 'DESC';
// }

// // ✅ FIXED: Match backend PaginatedResult shape
// export interface PaginatedResponse<T> {
//   items: T[];                    // ← "items" NOT "data"
//   totalCount: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
//   hasPreviousPage: boolean;
//   hasNextPage: boolean;
//   dateFrom?: string | null;
//   dateTo?: string | null;
//   searchTerm?: string | null;
//   sortBy?: string;
//   sortDirection?: string;
// }

// export interface UserInfoResponse {
//   success: boolean;
//   data: {
//     id: number;
//     fullName: string;
//     email: string;
//     contactNumber: string;
//   };
// }

// // ============ USER DROPDOWN API (PAGINATED) ============
// export interface UserDropdownDto {
//   id: number;
//   email: string;
//   fullName: string;
//   contactNumber: string;
//   displayName: string;
// }

// export interface PaginatedUserResponse {
//   items: UserDropdownDto[];
//   totalCount: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
//   hasPreviousPage: boolean;
//   hasNextPage: boolean;
// }

// export const userApi = {
//   getUsersForDropdown: (page: number = 1, pageSize: number = 20, searchTerm?: string): Promise<PaginatedUserResponse> => {
//     const params = new URLSearchParams();
//     params.append('page', String(page));
//     params.append('pageSize', String(pageSize));
//     if (searchTerm) params.append('searchTerm', searchTerm);
//     return api.get<PaginatedUserResponse>(`/UserDropdown?${params.toString()}`);
//   },
// };

// export const lostItemsApi = {
//   getActive: (params: LostItemsQueryParams = {}): Promise<PaginatedResponse<LostItem>> => {
//     const queryParams = new URLSearchParams();
//     if (params.page) queryParams.append('page', String(params.page));
//     if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
//     if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
//     if (params.dateTo) queryParams.append('dateTo', params.dateTo);
//     if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
//     if (params.sortBy) queryParams.append('sortBy', params.sortBy);
//     if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
//     return api.get<PaginatedResponse<LostItem>>(`/LostItems?${queryParams.toString()}`);
//   },

//   getAll: (params: LostItemsQueryParams = {}): Promise<PaginatedResponse<LostItem>> => {
//     const queryParams = new URLSearchParams();
//     if (params.page) queryParams.append('page', String(params.page));
//     if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
//     if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
//     if (params.dateTo) queryParams.append('dateTo', params.dateTo);
//     if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
//     if (params.sortBy) queryParams.append('sortBy', params.sortBy);
//     if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
//     return api.get<PaginatedResponse<LostItem>>(`/LostItems/all?${queryParams.toString()}`);
//   },

//   getById: (id: number): Promise<LostItem> =>
//     api.get<LostItem>(`/LostItems/${id}`),

//   getUnseenCount: (): Promise<{ count: number }> =>
//     api.get<{ count: number }>('/LostItems/unseen-count'),

//   getUserInfo: (userId: number): Promise<UserInfoResponse> =>
//     api.get<UserInfoResponse>(`/LostItems/user/${userId}/info`),

//   create: (data: CreateLostItemRequest): Promise<{ success: boolean; id: number; message: string }> =>
//     api.post<{ success: boolean; id: number; message: string }>('/LostItems', data),

//   update: (data: UpdateLostItemRequest): Promise<{ success: boolean; message: string }> =>
//     api.put<{ success: boolean; message: string }>(`/LostItems/${data.id}`, data),

//   delete: (id: number): Promise<void> =>
//     api.delete<void>(`/LostItems/${id}`),

//   markAsSeen: (id: number): Promise<{ success: boolean; message: string }> =>
//     api.post<{ success: boolean; message: string }>(`/LostItems/${id}/mark-seen`),

//   markAsDone: (id: number, data: MarkAsFoundRequest): Promise<{ success: boolean; message: string }> =>
//     api.post<{ success: boolean; message: string }>(`/LostItems/${id}/mark-done`, data),

//   undoMarkAsDone: (id: number): Promise<{ success: boolean; message: string }> =>
//     api.post<{ success: boolean; message: string }>(`/LostItems/${id}/undo-mark-done`),
// };

// src/api/lost-items.ts
import { api } from './client';

export interface LostItem {
  id: number;
  itemDescription: string;
  dateReported: string;
  reportedBy: string;
  contactNumber: string;
  isDone: boolean;
  isExpired: boolean;
  dateTransferred: string | null;
  isSeen: boolean;
  filePath: string | null;
  createdAt: string;
  updatedAt: string;
  userId?: number;
  studentName?: string;
  studentIdNumber?: string;
}

export interface CreateLostItemRequest {
  itemDescription: string;
  reportedBy?: string;
  contactNumber?: string;
  filePath?: string | null;
  userId?: number | null;
}

export interface UpdateLostItemRequest {
  id: number;
  itemDescription: string;
  reportedBy: string;
  contactNumber: string;
  filePath?: string | null;
}

export interface MarkAsFoundRequest {
  turnInBy?: string;
  foundBy?: string;
  filePath?: string;
}

export interface LostItemsQueryParams {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

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

export interface UserInfoResponse {
  success: boolean;
  data: {
    id: number;
    fullName: string;
    email: string;
    contactNumber: string;
  };
}

// ============ USER DROPDOWN API (PAGINATED) ============
export interface UserDropdownDto {
  id: number;
  email: string;
  fullName: string;
  contactNumber: string;
  displayName: string;
}

export interface PaginatedUserResponse {
  items: UserDropdownDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// // ✅ Convert a bare date (YYYY-MM-DD) into a full ISO string.
// // End date must be end-of-day so items ON that day are included.
// const formatDateParam = (date: string, isEndOfDay: boolean = false): string => {
//   if (!date) return '';
//   if (isEndOfDay) {
//     return `${date}T23:59:59`;
//   }
//   return `${date}T00:00:00`;
// };

// ✅ Convert a bare date (YYYY-MM-DD) into a full ISO string.
// The backend compares with strict '<' on dateTo, so we send the NEXT day
// at 00:00:00 to include the entire selected end day.
const formatDateParam = (date: string, isEndOfDay: boolean = false): string => {
  if (!date) return '';

  if (isEndOfDay) {
    // Parse YYYY-MM-DD and add one day
    const [y, m, d] = date.split('-').map(Number);
    const next = new Date(y, m - 1, d + 1);
    const yyyy = next.getFullYear();
    const mm = String(next.getMonth() + 1).padStart(2, '0');
    const dd = String(next.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T00:00:00`;
  }

  return `${date}T00:00:00`;
};

export const userApi = {
  getUsersForDropdown: (
    page: number = 1,
    pageSize: number = 20,
    searchTerm?: string
  ): Promise<PaginatedUserResponse> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('pageSize', String(pageSize));
    if (searchTerm) params.append('searchTerm', searchTerm);
    return api.get<PaginatedUserResponse>(`/UserDropdown?${params.toString()}`);
  },
};

export const lostItemsApi = {
  getActive: (params: LostItemsQueryParams = {}): Promise<PaginatedResponse<LostItem>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));

    // ✅ FIXED: inclusive end date
    if (params.dateFrom) {
      queryParams.append('dateFrom', formatDateParam(params.dateFrom, false)); // T00:00:00
    }
    if (params.dateTo) {
      queryParams.append('dateTo', formatDateParam(params.dateTo, true));      // T23:59:59
    }

    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return api.get<PaginatedResponse<LostItem>>(`/LostItems?${queryParams.toString()}`);
  },

  getAll: (params: LostItemsQueryParams = {}): Promise<PaginatedResponse<LostItem>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));

    // ✅ FIXED: inclusive end date
    if (params.dateFrom) {
      queryParams.append('dateFrom', formatDateParam(params.dateFrom, false));
    }
    if (params.dateTo) {
      queryParams.append('dateTo', formatDateParam(params.dateTo, true));
    }

    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return api.get<PaginatedResponse<LostItem>>(`/LostItems/all?${queryParams.toString()}`);
  },

  getById: (id: number): Promise<LostItem> =>
    api.get<LostItem>(`/LostItems/${id}`),

  getUnseenCount: (): Promise<{ count: number }> =>
    api.get<{ count: number }>('/LostItems/unseen-count'),

  getUserInfo: (userId: number): Promise<UserInfoResponse> =>
    api.get<UserInfoResponse>(`/LostItems/user/${userId}/info`),

  create: (data: CreateLostItemRequest): Promise<{ success: boolean; id: number; message: string }> =>
    api.post<{ success: boolean; id: number; message: string }>('/LostItems', data),

  update: (data: UpdateLostItemRequest): Promise<{ success: boolean; message: string }> =>
    api.put<{ success: boolean; message: string }>(`/LostItems/${data.id}`, data),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`/LostItems/${id}`),

  markAsSeen: (id: number): Promise<{ success: boolean; message: string }> =>
    api.post<{ success: boolean; message: string }>(`/LostItems/${id}/mark-seen`),

  markAsDone: (id: number, data: MarkAsFoundRequest): Promise<{ success: boolean; message: string }> =>
    api.post<{ success: boolean; message: string }>(`/LostItems/${id}/mark-done`, data),

  undoMarkAsDone: (id: number): Promise<{ success: boolean; message: string }> =>
    api.post<{ success: boolean; message: string }>(`/LostItems/${id}/undo-mark-done`),
};