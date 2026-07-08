// src/pages/ReportsPage.tsx
import React, { useState } from 'react';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { DocumentTextIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useToast } from '../hooks/useToast';
import { printSettingsApi } from '../api/print-settings';

const reportTypes = [
  { value: 'lost-items', label: 'Lost Items Report' },
  { value: 'found-items', label: 'Found Items Report' },
  { value: 'claimed-items', label: 'Claimed Items Report' },
  { value: 'disposal-items', label: 'Disposal Items Report' },
  { value: 'cold-case-items', label: 'Cold Case Items Report' },
  { value: 'donated-items', label: 'Donated Items Report' },
];

export const ReportsPage = () => {
  const { showToast } = useToast();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [currentReportType, setCurrentReportType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (type: string, data: any, blob: Blob) => {
    try {
      const defaultOfficer = await printSettingsApi.getDefaultOfficer();
      await printSettingsApi.logPrintActivity({
        reportType: type,
        officerId: defaultOfficer.data?.officerId || 0,
        itemCount: 0,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        searchTerm: data.searchTerm,
      });
    } catch (error) {
      console.error('Failed to log print activity:', error);
    }
  };

  // ✅ Called when user clicks "Preview"
  const handlePreview = (type: string, blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setPdfBlob(blob);
    setCurrentReportType(type);
    setIsPreviewModalOpen(true);
  };

  // ✅ Called when user clicks "Download" from preview
  const handleDownloadFromPreview = () => {
    if (pdfBlob) {
      const fileName = `${currentReportType}_${new Date().toISOString().slice(0, 10)}.pdf`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Report downloaded successfully', 'success');
    }
  };

  const handleClosePreview = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setPdfBlob(null);
    setIsPreviewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Reports
        </h2>
        <p className="text-gray-400 text-sm mt-1">Generate and preview PDF reports for all system data</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
          <ReportGenerator
            reportTypes={reportTypes}
            onGenerate={handleGenerate}
            onPreview={handlePreview}  // ✅ Pass preview handler
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>

      {/* ✅ Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
        title={`Preview: ${currentReportType.replace('-', ' ')} Report`}
        size="full"
        maxHeight="90vh"
      >
        {pdfUrl && (
          <div className="flex flex-col h-full">
            {/* PDF Viewer */}
            <div className="flex-1 min-h-[60vh]">
              <iframe
                src={pdfUrl}
                className="w-full h-[70vh] rounded-lg border border-gray-700"
                title="PDF Preview"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-800">
              <Button variant="glass-grey" onClick={handleClosePreview} className="flex-1">
                Close
              </Button>
              <Button
                variant="glass-green"
                onClick={handleDownloadFromPreview}
                className="flex-1"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};