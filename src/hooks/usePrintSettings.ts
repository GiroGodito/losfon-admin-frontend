// src/hooks/usePrintSettings.ts
import { useState, useEffect, useCallback } from 'react';
import { printSettingsApi } from '../api/print-settings';
import type { 
  PrintSetting, 
  OfficerSetting, 
  PrintLog,
  PrintLogsQueryParams,
  UpdatePrintSettingRequest
} from '../types/print-settings.types';
import { useToast } from './useToast';

export const usePrintSettings = () => {
  const [settings, setSettings] = useState<PrintSetting[]>([]);
  const [defaultOfficer, setDefaultOfficerState] = useState<OfficerSetting | null>(null);
  const [allOfficers, setAllOfficers] = useState<OfficerSetting[]>([]);
  const [printLogs, setPrintLogs] = useState<PrintLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logsPagination, setLogsPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const { showToast } = useToast();

  // ==============================================
  // LOAD SETTINGS
  // ==============================================
  const loadSettings = useCallback(async () => {
    try {
      const response = await printSettingsApi.getSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error: any) {
      console.error('Failed to load print settings:', error);
    }
  }, []);

  // ==============================================
  // LOAD DEFAULT OFFICER
  // ==============================================
  const loadDefaultOfficer = useCallback(async () => {
    try {
      const response = await printSettingsApi.getDefaultOfficer();
      if (response.success) {
        const officerWithFullName = {
          ...response.data,
          fullName: `${response.data.firstName} ${response.data.lastName}`
        };
        setDefaultOfficerState(officerWithFullName);
      }
    } catch (error) {
      console.debug('No default officer found:', error);
      setDefaultOfficerState(null);
    }
  }, []);

  // ==============================================
  // LOAD ALL OFFICERS
  // ==============================================
  const loadAllOfficers = useCallback(async () => {
    try {
      const response = await printSettingsApi.getAllOfficers();
      if (response.success) {
        const officersWithFullName = response.data.map(officer => ({
          ...officer,
          fullName: `${officer.firstName} ${officer.lastName}`
        }));
        setAllOfficers(officersWithFullName);
      }
    } catch (error) {
      console.error('Failed to load officers:', error);
    }
  }, []);

  // ==============================================
  // LOAD PRINT LOGS
  // ==============================================
  const loadPrintLogs = useCallback(async (params: PrintLogsQueryParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await printSettingsApi.getPrintLogs(params);
      if (response.success) {
        setPrintLogs(response.data);
        setLogsPagination(response.pagination);
      } else {
        setError('Failed to load print logs');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load print logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==============================================
  // UPDATE SETTING - ✅ FIXED to return Promise<void>
  // ==============================================
  const updateSetting = useCallback(async (data: UpdatePrintSettingRequest): Promise<void> => {
    try {
      const response = await printSettingsApi.updateSetting(data);
      if (response.success) {
        showToast(response.message || 'Setting updated successfully', 'success');
        await loadSettings();
      } else {
        showToast(response.message || 'Failed to update setting', 'error');
        throw new Error(response.message || 'Failed to update setting');
      }
    } catch (error: any) {
      const message = error.message || 'Failed to update setting';
      showToast(message, 'error');
      throw error;
    }
  }, [loadSettings, showToast]);

  // ==============================================
  // SET DEFAULT OFFICER - ✅ FIXED to return Promise<void>
  // ==============================================
  const setDefaultOfficer = useCallback(async (officerId: number): Promise<void> => {
    try {
      const response = await printSettingsApi.setDefaultOfficer(officerId);
      if (response.success) {
        showToast(response.message || 'Default officer updated', 'success');
        await loadDefaultOfficer();
        await loadAllOfficers();
      } else {
        showToast(response.message || 'Failed to set default officer', 'error');
        throw new Error(response.message || 'Failed to set default officer');
      }
    } catch (error: any) {
      const message = error.message || 'Failed to set default officer';
      showToast(message, 'error');
      throw error;
    }
  }, [loadDefaultOfficer, loadAllOfficers, showToast]);

  // ==============================================
  // LOG PRINT ACTIVITY
  // ==============================================
  const logPrintActivity = useCallback(async (data: {
    reportType: string;
    officerId: number;
    itemCount: number;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }) => {
    try {
      const response = await printSettingsApi.logPrintActivity(data);
      if (response.success) {
        return response;
      }
    } catch (error: any) {
      console.error('Failed to log print activity:', error);
    }
  }, []);

  // ==============================================
  // PAGINATION HELPERS
  // ==============================================
  const goToLogsPage = useCallback((page: number) => {
    if (page >= 1 && page <= logsPagination.totalPages) {
      loadPrintLogs({ page });
    }
  }, [logsPagination.totalPages, loadPrintLogs]);

  const changeLogsPageSize = useCallback((pageSize: number) => {
    loadPrintLogs({ pageSize, page: 1 });
  }, [loadPrintLogs]);

  // ==============================================
  // INITIAL LOAD
  // ==============================================
  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadSettings(),
          loadDefaultOfficer(),
          loadAllOfficers(),
          loadPrintLogs(),
        ]);
      } catch (error) {
        console.error('Error loading print settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  return {
    // State
    settings,
    defaultOfficer,
    allOfficers,
    printLogs,
    logsPagination,
    isLoading,
    error,
    // Actions
    loadSettings,
    loadDefaultOfficer,
    loadAllOfficers,
    loadPrintLogs,
    updateSetting,
    setDefaultOfficer,
    logPrintActivity,
    goToLogsPage,
    changeLogsPageSize,
  };
};

export default usePrintSettings;