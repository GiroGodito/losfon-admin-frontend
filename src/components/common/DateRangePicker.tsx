// // src/components/common/DateRangePicker.tsx
// import React from 'react';
// import { Input } from './Input';

// interface DateRangePickerProps {
//   dateFrom?: string;
//   dateTo?: string;
//   onDateFromChange: (value: string) => void;
//   onDateToChange: (value: string) => void;
//   className?: string;
// }

// export const DateRangePicker: React.FC<DateRangePickerProps> = ({
//   dateFrom,
//   dateTo,
//   onDateFromChange,
//   onDateToChange,
//   className = '',
// }) => {
//   return (
//     <div className={`flex items-center gap-3 ${className}`}>
//       <Input
//         type="date"
//         value={dateFrom || ''}
//         onChange={(e) => onDateFromChange(e.target.value)}
//         className="w-auto"
//         placeholder="From"
//       />
//       <span className="text-gray-500">to</span>
//       <Input
//         type="date"
//         value={dateTo || ''}
//         onChange={(e) => onDateToChange(e.target.value)}
//         className="w-auto"
//         placeholder="To"
//       />
//     </div>
//   );
// };

// src/components/common/DateRangePicker.tsx
import React from 'react';

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
  // Shared classes — forces identical height in Chrome & Safari and prevents overlap
  const dateInputClasses = [
    'w-full',
    'h-10',                  // fixed height in both browsers
    'px-3',
    'bg-gray-800/50',
    'border',
    'border-gray-700',
    'rounded-lg',
    'text-white',
    'text-sm',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-green-500',
    'focus:border-transparent',
    'hover:border-gray-500',
    // Neutralize Chrome's native date-picker button so it can't grow the input
    '[&::-webkit-calendar-picker-indicator]:opacity-70',
    '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
    '[&::-webkit-calendar-picker-indicator]:m-0',
    '[&::-webkit-calendar-picker-indicator]:p-0',
    '[&::-webkit-datetime-edit]:leading-10',
    '[&::-webkit-inner-spin-button]:appearance-none',
    '[&::-webkit-clear-button]:hidden',
  ].join(' ');

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 ${className}`}>
      {/* From */}
      <input
        type="date"
        value={dateFrom || ''}
        onChange={(e) => onDateFromChange(e.target.value)}
        className={dateInputClasses}
      />

      {/* "to" separator — hidden on mobile so it doesn't look weird stacked */}
      <span className="text-gray-500 flex-shrink-0 hidden sm:inline">to</span>

      {/* To */}
      <input
        type="date"
        value={dateTo || ''}
        onChange={(e) => onDateToChange(e.target.value)}
        className={dateInputClasses}
      />
    </div>
  );
};