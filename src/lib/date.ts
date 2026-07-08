// src/lib/date.ts
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatDateWithTime = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy hh:mm a');
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const toISOString = (date: Date): string => {
  return date.toISOString();
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};