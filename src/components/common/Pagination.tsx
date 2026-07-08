// src/components/common/Pagination.tsx
import React from 'react';
import { Button } from './Button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {/* Previous Button */}
      <Button
        variant="glass-grey"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 p-0 flex items-center justify-center rounded-full"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </Button>

      {/* Page Indicator - "1 of 2 pages" style matching your design */}
      <div className="flex items-center gap-1 text-sm text-gray-400">
        <span className="font-medium text-white">{currentPage}</span>
        <span className="mx-0.5">of</span>
        <span className="font-medium text-white">{totalPages}</span>
      </div>

      {/* Next Button */}
      <Button
        variant="glass-grey"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 p-0 flex items-center justify-center rounded-full"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};