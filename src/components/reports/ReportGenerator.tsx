// src/components/reports/ReportGenerator.tsx
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { DateRangePicker } from '../common/DateRangePicker';
import { SearchInput } from '../common/SearchInput';
import { useToast } from '../../hooks/useToast';
import { pdfApi } from '../../api/pdf';
import { DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';

interface ReportGeneratorProps {
  reportTypes: { value: string; label: string }[];
  onGenerate?: (type: string, data: any, blob: Blob) => Promise<void>;
  onPreview?: (type: string, blob: Blob) => void;  // ✅ NEW
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  reportTypes,
  onGenerate,
  onPreview,  // ✅ NEW
  isLoading = false,
  setIsLoading,
}) => {
  const [reportType, setReportType] = useState(reportTypes[0]?.value || '');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useToast();

  const getReportApi = (type: string) => {
    const apis: Record<string, (data: any) => Promise<Blob>> = {
      'lost-items': pdfApi.generateLostItems,
      'found-items': pdfApi.generateFoundItems,
      'claimed-items': pdfApi.generateClaimedItems,
      'disposal-items': pdfApi.generateDisposalItems,
      'cold-case-items': pdfApi.generateColdCaseItems,
      'donated-items': pdfApi.generateDonatedItems,
    };
    return apis[type];
  };

  const generateReport = async (action: 'download' | 'preview') => {
    if (!reportType) {
      showToast('Please select a report type', 'error');
      return;
    }

    const data = {
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      searchTerm: searchTerm || undefined,
      sortBy: sortBy || undefined,
      sortDirection: sortDirection || undefined,
    };

    const apiFn = getReportApi(reportType);
    if (!apiFn) {
      showToast('Invalid report type', 'error');
      return;
    }

    setIsGenerating(true);
    if (setIsLoading) setIsLoading(true);

    try {
      const blob = await apiFn(data);

      if (!(blob instanceof Blob)) {
        showToast('Unexpected response from server', 'error');
        return;
      }

      if (blob.type !== 'application/pdf') {
        try {
          const text = await blob.text();
          const errorData = JSON.parse(text);
          showToast(errorData.message || 'No items found to generate report', 'error');
        } catch {
          showToast('No items found to generate report', 'error');
        }
        return;
      }

      // ✅ Call onGenerate for logging
      if (onGenerate) {
        await onGenerate(reportType, data, blob);
      }

      // ✅ Preview or Download
      if (action === 'preview' && onPreview) {
        onPreview(reportType, blob);
        showToast('Report preview ready', 'info');
      } else {
        // Download
        const fileName = `${reportType}_${new Date().toISOString().slice(0, 10)}.pdf`;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Report downloaded successfully', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to generate report', 'error');
    } finally {
      setIsGenerating(false);
      if (setIsLoading) setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4">
      {/* Report Type */}
      <Select
        label="Report Type"
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
        options={reportTypes}
        required
      />

      {/* Sort Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          placeholder="Default"
          options={[
            { value: 'DateReported', label: 'Date Reported' },
            { value: 'DateFound', label: 'Date Found' },
            { value: 'ReleasedDate', label: 'Released Date' },
            { value: 'DateTransferred', label: 'Date Transferred' },
            { value: 'ItemDescription', label: 'Description' },
          ]}
        />
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

      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Date Range</label>
        <DateRangePicker
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
      </div>

      {/* Search */}
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by description or name..."
      />

      {/* ✅ TWO BUTTONS: Preview & Download */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="glass-blue"
          isLoading={isGenerating || isLoading}
          onClick={() => generateReport('preview')}
          className="flex-1 py-3"
        >
          <EyeIcon className="w-5 h-5 mr-2" />
          Preview Report
        </Button>
        <Button
          type="button"
          variant="glass-green"
          isLoading={isGenerating || isLoading}
          onClick={() => generateReport('download')}
          className="flex-1 py-3"
        >
          <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
          Download PDF
        </Button>
      </div>
    </form>
  );
};