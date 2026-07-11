// // src/lib/date.ts
// import { format, formatDistanceToNow, parseISO } from 'date-fns';

// export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
//   const dateObj = typeof date === 'string' ? parseISO(date) : date;
//   return format(dateObj, formatStr);
// };

// export const formatDateWithTime = (date: string | Date): string => {
//   return formatDate(date, 'MMM dd, yyyy hh:mm a');
// };

// export const formatRelativeTime = (date: string | Date): string => {
//   const dateObj = typeof date === 'string' ? parseISO(date) : date;
//   return formatDistanceToNow(dateObj, { addSuffix: true });
// };

// export const toISOString = (date: Date): string => {
//   return date.toISOString();
// };

// export const isValidDate = (date: any): boolean => {
//   return date instanceof Date && !isNaN(date.getTime());
// }; LAST WORKING IMIPLEMENTATION

// src/lib/date.ts
import { formatDistanceToNow } from 'date-fns';

/**
 * Format a date to local timezone without extra packages
 * Uses native JavaScript Date methods that automatically handle timezone conversion
 */
export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // ✅ JavaScript Date automatically converts UTC to local timezone
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export const formatDateWithTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // ✅ Automatically converts UTC to local timezone
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const toISOString = (date: Date): string => {
  return date.toISOString();
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};