// src/components/donated-items/DonatedItemList.tsx
import React from 'react';
import type { DonatedItem, DonatedItemGroup } from '../../types/donated-item.types';
import { DonatedItemCard } from './DonatedItemCard';
import { DonatedItemGroupCard } from './DonatedItemGroupCard';
import { DonatedItemFilters } from './DonatedItemFilters';
import { EmptyState } from '../common/EmptyState';
import { Spinner } from '../common/Spinner';
import { Pagination } from '../common/Pagination';
import type { DonatedItemsQueryParams } from '../../types/donated-item.types';
import { HeartIcon } from '@heroicons/react/24/outline';

interface DonatedItemListProps {
  items: DonatedItem[];
  groups: DonatedItemGroup[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  onFilter?: (filters: DonatedItemsQueryParams) => void;
  onPageChange?: (page: number) => void;
  showFilters?: boolean;
  grouped?: boolean;
}

const glassVariants = ['glass-green', 'glass-blue', 'glass-purple', 'glass-red', 'glass-grey'] as const;

export const DonatedItemList: React.FC<DonatedItemListProps> = ({
  items = [],
  groups = [],
  isLoading,
  pagination,
  onFilter,
  onPageChange,
  showFilters = true,
  grouped = true,
}) => {
  const getRowNumber = (index: number) => {
    return (pagination.page - 1) * pagination.pageSize + index + 1;
  };

  return (
    <div>
      {showFilters && onFilter && (
        <DonatedItemFilters onFilter={onFilter} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 && groups.length === 0 ? (
        <EmptyState
          title="No Donated Items"
          description="No donated items match your current filters. Try adjusting your search criteria."
          icon={<HeartIcon className="h-12 w-12 text-gray-500" />}
        />
      ) : (
        <>
          {/* ✅ TOP PAGINATION BAR - Same style as LostItems and FoundItems */}
          {(pagination.totalPages > 1 || pagination.totalCount > pagination.pageSize) && onPageChange && (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Left: Items info */}
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-white">
                    {grouped ? groups.length : items.length}
                  </span>
                  <span className="mx-1">of</span>
                  <span className="font-medium text-white">{pagination.totalCount}</span>
                  <span className="ml-1">{grouped ? 'groups' : 'items'}</span>
                </div>

                {/* Center: Pagination controls */}
                <div className="flex items-center gap-4">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={onPageChange}
                  />
                </div>

                {/* No right side content - matches LostItems/FoundItems */}
              </div>
            </div>
          )}

          {grouped ? (
            // ✅ GROUPED VIEW - Each group has its own internal pagination
            <div className="space-y-4">
              {groups.map((group, index) => (
                <DonatedItemGroupCard 
                  key={`${group.donationDate}-${index}`} 
                  group={group}
                />
              ))}
            </div>
          ) : (
            // ✅ FLAT VIEW - Grid layout
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {items.map((item, index) => (
                <DonatedItemCard
                  key={item.id}
                  item={item}
                  rowNumber={getRowNumber(index)}
                  variant={glassVariants[index % glassVariants.length]}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DonatedItemList;