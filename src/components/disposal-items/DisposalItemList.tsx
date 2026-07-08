// src/components/disposal-items/DisposalItemList.tsx
import React from 'react';
import type { DisposalItem } from '../../types/disposal-item.types';
import { DisposalItemCard } from './DisposalItemCard';
import { DisposalItemFilters } from './DisposalItemFilters';
import { EmptyState } from '../common/EmptyState';
import { Spinner } from '../common/Spinner';
import { Pagination } from '../common/Pagination';
import type { DisposalItemsQueryParams } from '../../types/disposal-item.types';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';

interface DisposalItemListProps {
  items: DisposalItem[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  onDelete?: (id: number) => void;
  onDonateAll?: () => void;
  onRestoreAll?: () => void;
  onFilter?: (filters: DisposalItemsQueryParams) => void;
  onPageChange?: (page: number) => void;
  showFilters?: boolean;
  isDonating?: boolean;
  isRestoring?: boolean;
}

const glassVariants = ['glass-green', 'glass-blue', 'glass-purple', 'glass-red', 'glass-grey'] as const;

export const DisposalItemList: React.FC<DisposalItemListProps> = ({
  items = [],
  isLoading,
  pagination,
  onDelete,
  onDonateAll,
  onRestoreAll,
  onFilter,
  onPageChange,
  showFilters = true,
  isDonating = false,
  isRestoring = false,
}) => {
  const getRowNumber = (index: number) => {
    return (pagination.page - 1) * pagination.pageSize + index + 1;
  };

  return (
    <div>
      {showFilters && onFilter && (
        <DisposalItemFilters onFilter={onFilter} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No Disposal Items"
          description="No disposal items match your current filters. Try adjusting your search criteria."
          icon={<TrashIcon className="h-12 w-12 text-gray-500" />}
        />
      ) : (
        <>
          {/* Action Buttons Row */}
          <div className="flex flex-wrap gap-3 mb-4">
            {onDonateAll && (
              <Button
                variant="glass-green"
                size="sm"
                onClick={onDonateAll}
                isLoading={isDonating}
              >
                Donate All
              </Button>
            )}
            {onRestoreAll && (
              <Button
                variant="glass-blue"
                size="sm"
                onClick={onRestoreAll}
                isLoading={isRestoring}
              >
                Restore All
              </Button>
            )}
            <span className="text-sm text-gray-500 self-center">
              {items.length} items in disposal
            </span>
          </div>

          {/* TOP PAGINATION BAR */}
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

          {/* Grid Layout - 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {items.map((item, index) => (
              <DisposalItemCard
                key={item.id}
                item={item}
                rowNumber={getRowNumber(index)}
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