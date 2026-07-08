// src/lib/constants.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7149/api';

export const APP_NAME = 'LosFon Admin';

export const PAGINATION_DEFAULTS = {
  page: 1,
  pageSize: 10,
};

export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  displayWithTime: 'MMM dd, yyyy hh:mm a',
  iso: 'yyyy-MM-dd',
  api: 'yyyy-MM-ddTHH:mm:ss',
};

export const ITEM_STATUS = {
  ACTIVE: 'Active',
  CLAIMED: 'Claimed',
  EXPIRED: 'Expired',
  DONE: 'Done',
  COLD_CASE: 'Cold Case',
  DISPOSAL: 'Disposal',
  DONATED: 'Donated',
};

export const ACTION_TYPES = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  PRINT: 'PRINT',
  DONATE: 'DONATE',
  RESTORE: 'RESTORE',
};