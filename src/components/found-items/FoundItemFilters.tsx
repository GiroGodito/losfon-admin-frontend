// src/components/found-items/FoundItemFilters.tsx
import React, { useState, useEffect } from 'react';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { DateRangePicker } from '../common/DateRangePicker';
import { SearchInput } from '../common/SearchInput';
import type { FoundItemsQueryParams } from '../../types/found-item.types';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface FoundItemFiltersProps {
  onFilter: (filters: FoundItemsQueryParams) => void;
  initialFilters?: FoundItemsQueryParams;
  isLoading?: boolean;
}

export const FoundItemFilters: React.FC<FoundItemFiltersProps> = ({
  onFilter,
  initialFilters = {},
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom || '');
  const [dateTo, setDateTo] = useState(initialFilters.dateTo || '');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'DateFound');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>(
    initialFilters.sortDirection || 'DESC'
  );
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Sync local state with parent's initialFilters
  useEffect(() => {
    setSearchTerm(initialFilters.searchTerm || '');
    setDateFrom(initialFilters.dateFrom || '');
    setDateTo(initialFilters.dateTo || '');
    setSortBy(initialFilters.sortBy || 'DateFound');
    setSortDirection(initialFilters.sortDirection || 'DESC');
  }, [initialFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      searchTerm: searchTerm || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy,
      sortDirection,
      page: 1,
    });
  };

  // src/components/found-items/FoundItemFilters.tsx
// Update the reset function:
const handleReset = () => {
  setSearchTerm('');
  setDateFrom('');
  setDateTo('');
  setSortBy('DateFound');
  setSortDirection('DESC');
  onFilter({
    page: 1,
    pageSize: 3,  // ✅ Changed from 10 to 3
    searchTerm: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    sortBy: 'DateFound',
    sortDirection: 'DESC',
  });
};

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by description or finder..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="glass-green"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              type="button"
              variant="glass-green"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="glass-green"
              size="sm"
              isLoading={isLoading}
            >
              Apply
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Date Range</label>
              <DateRangePicker
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
              />
            </div>
            <div>
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'DateFound', label: 'Date Found' },
                  { value: 'ItemDescription', label: 'Description' },
                  { value: 'FoundBy', label: 'Found By' },
                  { value: 'CreatedAt', label: 'Created At' },
                ]}
              />
            </div>
            <div>
              <Select
                label="Sort Direction"
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value as 'ASC' | 'DESC')}
                options={[
                  { value: 'DESC', label: 'Newest First' },
                  { value: 'ASC', label: 'Oldest First' },
                ]}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};