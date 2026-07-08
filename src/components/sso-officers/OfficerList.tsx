// src/components/sso-officers/OfficerList.tsx
import React from 'react';
import type { SSOfficer } from '../../types/sso-officer.types';
import { OfficerCard } from './OfficerCard';
import { OfficerFilters } from './OfficerFilters';
import { EmptyState } from '../common/EmptyState';
import { Spinner } from '../common/Spinner';
import { Pagination } from '../common/Pagination';
import type { OfficersQueryParams } from '../../types/sso-officer.types';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

interface OfficerListProps {
  officers: SSOfficer[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  defaultOfficerId?: number;
  onEdit: (officer: SSOfficer) => void;
  onDelete: (id: number) => void;
  onAdd?: () => void;
  onFilter?: (filters: OfficersQueryParams) => void;
  onPageChange?: (page: number) => void;
  showFilters?: boolean;
}

const glassVariants = ['glass-green', 'glass-blue', 'glass-purple', 'glass-red', 'glass-grey'] as const;

export const OfficerList: React.FC<OfficerListProps> = ({
  officers = [],
  isLoading,
  pagination,
  defaultOfficerId,
  onEdit,
  onDelete,
  onAdd,
  onFilter,
  onPageChange,
  showFilters = true,
}) => {
  const getRowNumber = (index: number) => {
    return (pagination.page - 1) * pagination.pageSize + index + 1;
  };

  const renderFilters = () => {
    if (showFilters && onFilter) {
      return <OfficerFilters onFilter={onFilter} />;
    }
    return null;
  };

  const renderAddButton = () => {
    if (onAdd) {
      return (
        <Button variant="glass-green" size="sm" onClick={onAdd}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Officer
        </Button>
      );
    }
    return null;
  };

  return (
    <div>
      {renderFilters()}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : officers.length === 0 ? (
        <>
          <div className="flex justify-end mb-4">
            {renderAddButton()}
          </div>
          <EmptyState
            title="No SSO Officers"
            description="No officers match your current filters. Try adjusting your search criteria."
            icon={<UserGroupIcon className="h-12 w-12 text-gray-500" />}
            actionLabel={onAdd ? "Add Officer" : undefined}
            onAction={onAdd}
          />
        </>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            {renderAddButton()}
          </div>

          {/* ✅ TOP PAGINATION BAR - Same style as LostItemList */}
          {(pagination.totalPages > 1 || pagination.totalCount > pagination.pageSize) && onPageChange && (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Left: Items info */}
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-white">{officers.length}</span>
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

          {/* Grid Layout - 3 columns - Same as LostItemList */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {officers.map((officer, index) => (
              <OfficerCard
                key={officer.id}
                officer={officer}
                rowNumber={getRowNumber(index)}
                onEdit={onEdit}
                onDelete={onDelete}
                isDefault={officer.id === defaultOfficerId}
                variant={glassVariants[index % glassVariants.length]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};