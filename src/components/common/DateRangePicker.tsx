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
  // Inline styles are intentional — Tailwind's arbitrary variants for
  // ::-webkit-* pseudo-elements are not always compiled by @tailwindcss/postcss v4.
  // Inline style + a plain CSS class guarantees it works in every browser.
  const inputClass = 'date-input';

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full ${className}`}>
      <input
        type="date"
        value={dateFrom || ''}
        onChange={(e) => onDateFromChange(e.target.value)}
        className={inputClass}
        aria-label="Date from"
      />
      <span className="text-gray-500 flex-shrink-0 hidden sm:inline">to</span>
      <input
        type="date"
        value={dateTo || ''}
        onChange={(e) => onDateToChange(e.target.value)}
        className={inputClass}
        aria-label="Date to"
      />
    </div>
  );
};