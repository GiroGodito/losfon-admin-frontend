// src/components/reports/PrintSettings.tsx
import React, { useState, useEffect } from 'react';
import type { PrintSetting, OfficerSetting, UpdatePrintSettingRequest } from '../../types/print-settings.types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useToast } from '../../hooks/useToast';
import { 
  PencilSquareIcon, 
  CheckIcon, 
  XMarkIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface PrintSettingsProps {
  settings: PrintSetting[];
  officers: OfficerSetting[];
  defaultOfficerId?: number;
  onUpdateSetting: (data: UpdatePrintSettingRequest) => Promise<void>;
  onSetDefaultOfficer: (officerId: number) => Promise<void>;
  isLoading?: boolean;
}

export const PrintSettings: React.FC<PrintSettingsProps> = ({
  settings,
  officers,
  defaultOfficerId,
  onUpdateSetting,
  onSetDefaultOfficer,
  isLoading = false,
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const getInitialOfficerId = () => {
    if (defaultOfficerId && defaultOfficerId > 0) {
      return defaultOfficerId;
    }
    const defaultOfficer = officers.find(o => o.isDefault === true);
    if (defaultOfficer) {
      return defaultOfficer.officerId;
    }
    if (officers.length > 0) {
      return officers[0].officerId;
    }
    return undefined;
  };

  const [selectedOfficer, setSelectedOfficer] = useState<number | undefined>(getInitialOfficerId());
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const newDefaultId = getInitialOfficerId();
    if (newDefaultId !== undefined) {
      setSelectedOfficer(newDefaultId);
    }
  }, [defaultOfficerId, officers]);

  const handleStartEdit = (setting: PrintSetting) => {
    setEditingKey(setting.settingKey);
    setEditValue(setting.settingValue);
    setEditDescription(setting.description || '');
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
    setEditDescription('');
  };

  const handleSaveEdit = async (key: string) => {
    setIsSaving(true);
    try {
      await onUpdateSetting({
        settingKey: key,
        settingValue: editValue,
        description: editDescription || undefined,
      });
      setEditingKey(null);
    } catch (error: any) {
      // Error is already shown in the hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefaultOfficer = async () => {
    if (!selectedOfficer || selectedOfficer <= 0) {
      showToast('Please select a valid officer', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await onSetDefaultOfficer(selectedOfficer);
    } catch (error: any) {
      // Error is already shown in the hook
    } finally {
      setIsSaving(false);
    }
  };

  const getSettingIcon = (key: string) => {
    const icons: Record<string, React.ReactNode> = {
      'CompanyName': <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />,
      'CompanyAddress': <InformationCircleIcon className="w-4 h-4 text-gray-500" />,
      'CompanyPhone': <PhoneIcon className="w-4 h-4 text-gray-500" />,
      'FooterText': <DocumentTextIcon className="w-4 h-4 text-gray-500" />,
      'DefaultOfficerId': <UserGroupIcon className="w-4 h-4 text-gray-500" />,
    };
    return icons[key] || <Cog6ToothIcon className="w-4 h-4 text-gray-500" />;
  };

  const getSettingLabel = (key: string) => {
    const labels: Record<string, string> = {
      'DefaultOfficerId': 'Default Officer ID',
      'CompanyName': 'Company Name',
      'CompanyAddress': 'Company Address',
      'CompanyPhone': 'Company Phone',
      'FooterText': 'Footer Text',
    };
    return labels[key] || key;
  };

  const defaultOfficer = officers.find(o => o.officerId === defaultOfficerId);

  // Filter out DefaultOfficerId from settings display
  const displaySettings = settings.filter(s => s.settingKey !== 'DefaultOfficerId');

  return (
    <div className="space-y-6">
      {/* Print Settings Card */}
      <Card 
        title="Print Settings" 
        subtitle="Configure default values for PDF reports"
        icon={<Cog6ToothIcon className="w-5 h-5 text-green-400" />}
      >
        <div className="space-y-3">
          {displaySettings.map((setting) => (
            <div 
              key={setting.id} 
              className="group flex items-start gap-4 p-4 rounded-xl bg-gray-800/20 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-200 hover:bg-gray-800/30"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center group-hover:border-green-500/30 transition-colors">
                  {getSettingIcon(setting.settingKey)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">
                    {getSettingLabel(setting.settingKey)}
                  </span>
                  <span className="text-[10px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full border border-gray-700/30 font-mono">
                    {setting.settingKey}
                  </span>
                </div>

                {editingKey === setting.settingKey ? (
                  <div className="mt-3 space-y-3">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Enter value"
                      className="bg-gray-800/30 border-gray-700 focus:border-green-500"
                    />
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description (optional)"
                      className="bg-gray-800/30 border-gray-700 focus:border-green-500"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="glass-green"
                        onClick={() => handleSaveEdit(setting.settingKey)}
                        isLoading={isSaving || isLoading}
                        className="flex-1"
                      >
                        <CheckIcon className="w-4 h-4 mr-1.5" />
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="glass-grey" 
                        onClick={handleCancelEdit}
                        className="flex-1"
                      >
                        <XMarkIcon className="w-4 h-4 mr-1.5" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1.5">
                    <p className="text-gray-300 text-sm text-left">{setting.settingValue}</p>
                    {setting.description && (
                      <p className="text-xs text-gray-500 mt-0.5 text-left">{setting.description}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Edit Button */}
              {editingKey !== setting.settingKey && (
                <Button
                  size="sm"
                  variant="glass-green"
                  onClick={() => handleStartEdit(setting)}
                  disabled={isSaving || isLoading}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <PencilSquareIcon className="w-4 h-4 mr-1.5" />
                  Edit
                </Button>
              )}
            </div>
          ))}

          {displaySettings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No print settings configured</p>
            </div>
          )}
        </div>
      </Card>

      {/* Officer In Charge Card */}
      <Card 
        title="Officer In Charge" 
        subtitle="Select the default SSO officer for printed reports"
        icon={<UserGroupIcon className="w-5 h-5 text-green-400" />}
      >
        <div className="space-y-5">
          {/* Current Default Officer Display */}
          {defaultOfficerId && defaultOfficer && (
            <div className="flex items-center gap-4 bg-green-500/5 rounded-xl px-5 py-4 border border-green-500/20">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center border-2 border-green-500/30 flex-shrink-0">
                <span className="text-green-400 font-semibold text-lg">
                  {defaultOfficer.firstName.charAt(0)}{defaultOfficer.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-medium">
                    {defaultOfficer.firstName} {defaultOfficer.lastName}
                  </span>
                  <span className="text-green-400 text-xs bg-green-500/15 px-2.5 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
                    <ShieldCheckIcon className="w-3 h-3" />
                    Active Default
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5 text-left">{defaultOfficer.contactInformation}</p>
              </div>
            </div>
          )}

          {/* Select New Officer */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Select
                value={selectedOfficer ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedOfficer(value ? Number(value) : undefined);
                }}
                placeholder={officers.length === 0 ? "No officers available" : "Select an officer..."}
                options={officers.map(o => ({
                  value: o.officerId,
                  label: `${o.firstName} ${o.lastName}${o.isDefault ? ' ⭐' : ''}`,
                }))}
                className="bg-gray-800/30 border-gray-700 focus:border-green-500"
              />
            </div>
            <Button
              variant="glass-green"
              onClick={handleSetDefaultOfficer}
              isLoading={isSaving || isLoading}
              disabled={!selectedOfficer || selectedOfficer <= 0 || selectedOfficer === defaultOfficerId}
              className="flex-shrink-0 mb-0.5 min-w-[140px]"
            >
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              Set as Default
            </Button>
          </div>

          {officers.length === 0 && (
            <div className="text-center py-4 text-sm text-gray-500 bg-gray-800/20 rounded-xl border border-gray-700/50">
              <UserGroupIcon className="w-6 h-6 mx-auto text-gray-600 mb-2" />
              <p>No SSO officers available. Please add an officer first.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PrintSettings;