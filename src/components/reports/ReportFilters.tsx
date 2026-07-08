// src/components/reports/ReportFilters.tsx
import React, { useState } from 'react';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { DateRangePicker } from '../common/DateRangePicker';
import { SearchInput } from '../common/SearchInput';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface ReportFiltersProps {
  onFilter: (filters: any) => void;
  initialFilters?: any;
  isLoading?: boolean;
  reportTypes: { value: string; label: string }[];
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  onFilter,
  initialFilters = {},
  isLoading = false,
  reportTypes,
}) => {
  const [reportType, setReportType] = useState(initialFilters.reportType || '');
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom || '');
  const [dateTo, setDateTo] = useState(initialFilters.dateTo || '');
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      reportType: reportType || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      searchTerm: searchTerm || undefined,
    });
  };

  const handleReset = () => {
    setReportType('');
    setDateFrom('');
    setDateTo('');
    setSearchTerm('');
    onFilter({});
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
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
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
                label="Report Type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                placeholder="All Types"
                options={[
                  { value: '', label: 'All Types' },
                  ...reportTypes,
                ]}
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
          </div>
        )}
      </form>
    </div>
  );
};