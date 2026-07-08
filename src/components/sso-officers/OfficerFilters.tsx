// src/components/sso-officers/OfficerFilters.tsx
import React, { useState } from 'react';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import type { OfficersQueryParams } from '../../types/sso-officer.types';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface OfficerFiltersProps {
  onFilter: (filters: OfficersQueryParams) => void;
  initialFilters?: OfficersQueryParams;
  isLoading?: boolean;
}

export const OfficerFilters: React.FC<OfficerFiltersProps> = ({
  onFilter,
  initialFilters = {},
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'FirstName');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>(
    initialFilters.sortDirection || 'ASC'
  );
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      searchTerm: searchTerm || undefined,
      sortBy,
      sortDirection,
      page: 1,
    });
  };

 // src/components/sso-officers/OfficerFilters.tsx
// Update the reset function:
const handleReset = () => {
  setSearchTerm('');
  setSortBy('FirstName');
  setSortDirection('ASC');
  onFilter({
    page: 1,
    pageSize: 3,  // ✅ Changed from 10 to 3
    searchTerm: undefined,
    sortBy: 'FirstName',
    sortDirection: 'ASC',
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
              placeholder="Search by name or contact..."
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
          <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'FirstName', label: 'First Name' },
                  { value: 'LastName', label: 'Last Name' },
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
                  { value: 'ASC', label: 'A → Z' },
                  { value: 'DESC', label: 'Z → A' },
                ]}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};