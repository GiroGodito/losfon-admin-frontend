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
 * Parse date STRICTLY as UTC, then convert to local
 * This forces JavaScript to treat the string as UTC even if it doesn't have a 'Z'
 */
const parseDate = (date: string | Date): Date => {
  if (date instanceof Date) return date;
  
  // ✅ APPEND 'Z' to force UTC parsing
  const utcString = date.endsWith('Z') ? date : date + 'Z';
  const utcDate = new Date(utcString);
  
  // ✅ Log for debugging
  console.log('📅 RAW:', date);
  console.log('📅 UTC STRING:', utcString);
  console.log('📅 PARSED UTC:', utcDate);
  console.log('📅 LOCAL TIME:', utcDate.toLocaleString());
  
  return utcDate;
};

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  const dateObj = parseDate(date);
  
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export const formatDateWithTime = (date: string | Date): string => {
  const dateObj = parseDate(date);
  
  // ✅ Force display in LOCAL timezone
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // ← Force local
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = parseDate(date);
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const toISOString = (date: Date): string => {
  return date.toISOString();
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};