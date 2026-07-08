// src/components/activity-logs/ActivityLogFilters.tsx
import React, { useState } from 'react';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { DateRangePicker } from '../common/DateRangePicker';
import { SearchInput } from '../common/SearchInput';
import type { ActivityLogsQueryParams } from '../../types/activity-log.types';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface ActivityLogFiltersProps {
  onFilter: (filters: ActivityLogsQueryParams) => void;
  initialFilters?: ActivityLogsQueryParams;
  isLoading?: boolean;
}

export const ActivityLogFilters: React.FC<ActivityLogFiltersProps> = ({
  onFilter,
  initialFilters = {},
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom || '');
  const [dateTo, setDateTo] = useState(initialFilters.dateTo || '');
  const [actionType, setActionType] = useState(initialFilters.actionType || '');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'CreatedAt');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>(
    initialFilters.sortDirection || 'DESC'
  );
  const [showFilters, setShowFilters] = useState(false);

  const actionTypes = [
    { value: '', label: 'All Actions' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'PRINT', label: 'Print' },
    { value: 'DONATE', label: 'Donate' },
    { value: 'RESTORE', label: 'Restore' },
    { value: 'USER_REPORT', label: 'User Report' },
    { value: 'USER_CANCEL', label: 'User Cancel' },
    { value: 'LOGIN_FAILED', label: 'Login Failed' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      searchTerm: searchTerm || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      actionType: actionType || undefined,
      sortBy,
      sortDirection,
      page: 1,
      pageSize: 5, // ✅ Keep pageSize 5
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setActionType('');
    setSortBy('CreatedAt');
    setSortDirection('DESC');
    onFilter({
      page: 1,
      pageSize: 5, // ✅ Set to 5
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
              placeholder="Search logs..."
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
              <Select
                label="Action Type"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                options={actionTypes}
              />
            </div>
            <div className="md:col-span-2">
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
                  { value: 'CreatedAt', label: 'Date' },
                  { value: 'ActionType', label: 'Action Type' },
                  { value: 'UserName', label: 'User' },
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