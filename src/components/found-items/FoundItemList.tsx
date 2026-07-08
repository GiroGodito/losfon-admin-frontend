// src/components/found-items/FoundItemList.tsx
import React from 'react';
import type { FoundItem } from '../../types/found-item.types';
import { FoundItemCard } from './FoundItemCard';
import { FoundItemFilters } from './FoundItemFilters';
import { EmptyState } from '../common/EmptyState';
import { Spinner } from '../common/Spinner';
import { Pagination } from '../common/Pagination';
import type { FoundItemsQueryParams } from '../../types/found-item.types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface FoundItemListProps {
  items: FoundItem[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  currentFilters?: FoundItemsQueryParams;
  onMarkAsClaimed?: (id: number) => void;
  onDelete?: (id: number) => void;
  onFilter?: (filters: FoundItemsQueryParams) => void;
  onPageChange?: (page: number) => void;
  showFilters?: boolean;
}

const glassVariants = ['glass-green', 'glass-blue', 'glass-purple', 'glass-red', 'glass-grey'] as const;

export const FoundItemList: React.FC<FoundItemListProps> = ({
  items = [],
  isLoading,
  pagination,
  currentFilters = {},
  onMarkAsClaimed,
  onDelete,
  onFilter,
  onPageChange,
  showFilters = true,
}) => {
  const getRowNumber = (index: number) => {
    return (pagination.page - 1) * pagination.pageSize + index + 1;
  };

  return (
    <div>
      {showFilters && onFilter && (
        <FoundItemFilters 
          onFilter={onFilter} 
          initialFilters={currentFilters}
          isLoading={isLoading}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No Found Items"
          description="No found items match your current filters. Try adjusting your search criteria."
          icon={<MagnifyingGlassIcon className="h-12 w-12 text-gray-500" />}
        />
      ) : (
        <>
          {/* ✅ TOP PAGINATION BAR - EXACT MATCH TO LOST ITEMS (NO right side) */}
          {(pagination.totalPages > 1 || pagination.totalCount > pagination.pageSize) && onPageChange && (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Left: Items info */}
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-white">{items.length}</span>
                  <span className="mx-1">of</span>
                  <span className="font-medium text-white">{pagination.totalCount}</span>
                  <span className="ml-1">items</span>
                </div>

                {/* Center: Pagination controls */}
                <div className="flex items-center gap-4">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Grid Layout - 3 columns - EXACT MATCH TO LOST ITEMS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {items.map((item, index) => (
              <FoundItemCard
                key={item.id}
                item={item}
                rowNumber={getRowNumber(index)}
                onMarkAsClaimed={onMarkAsClaimed}
                onDelete={onDelete}
                variant={glassVariants[index % glassVariants.length]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};