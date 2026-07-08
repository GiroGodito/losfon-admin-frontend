// src/pages/PrintSettingsPage.tsx
import { usePrintSettings } from '../hooks/usePrintSettings';
import { PrintSettings } from '../components/reports/PrintSettings';
import { PrintLogs } from '../components/reports/PrintLogs';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export const PrintSettingsPage = () => {
  const {
    settings,
    defaultOfficer,
    allOfficers,
    printLogs,
    logsPagination,
    isLoading,
    updateSetting,
    setDefaultOfficer,
    loadPrintLogs,
    goToLogsPage,
    changeLogsPageSize,
  } = usePrintSettings();

  return (
    <div className="space-y-6">
      {/* <div className="text-left"> 
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Print Settings
        </h2>
        <p className="text-gray-400 text-sm mt-1">Configure print settings and view print logs</p>
      </div> */}

      <PrintSettings
        settings={settings}
        officers={allOfficers}
        defaultOfficerId={defaultOfficer?.officerId}
        onUpdateSetting={updateSetting}
        onSetDefaultOfficer={setDefaultOfficer}
        isLoading={isLoading}
      />

      {/* <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Print Logs</h2>
        <PrintLogs
          logs={printLogs}
          isLoading={isLoading}
          pagination={logsPagination}
          onPageChange={goToLogsPage}
        />
      </div> */}
    </div>
  );
};