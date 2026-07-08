// src/components/common/DateRangePicker.tsx
import React from 'react';
import { Input } from './Input';

interface DateRangePickerProps {
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Input
        type="date"
        value={dateFrom || ''}
        onChange={(e) => onDateFromChange(e.target.value)}
        className="w-auto"
        placeholder="From"
      />
      <span className="text-gray-500">to</span>
      <Input
        type="date"
        value={dateTo || ''}
        onChange={(e) => onDateToChange(e.target.value)}
        className="w-auto"
        placeholder="To"
      />
    </div>
  );
};