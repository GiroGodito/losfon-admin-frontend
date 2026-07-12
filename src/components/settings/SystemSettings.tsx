// src/components/settings/SystemSettings.tsx
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useSystemSettings } from '../../hooks/useSystemSettings';
import { useToast } from '../../hooks/useToast';
import { 
  Cog6ToothIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  PencilSquareIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export const SystemSettings: React.FC = () => {
  const { expirationDays, isLoading, isUpdating, updateExpirationDays } = useSystemSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(expirationDays);
  const { showToast } = useToast();

  const handleStartEdit = () => {
    setEditValue(expirationDays);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(expirationDays);
  };

  const handleSaveEdit = async () => {
    if (editValue < 1 || editValue > 365) {
      showToast('Days must be between 1 and 365', 'error');
      return;
    }
    try {
      await updateExpirationDays(editValue);
      setIsEditing(false);
    } catch (error) {
      // Error already handled in hook
    }
  };

  return (
    <Card 
      title="System Settings" 
      subtitle="Configure system-wide settings"
      icon={<Cog6ToothIcon className="w-5 h-5 text-green-400" />}
    >
      <div className="space-y-4">
        {/* Expiration Days Setting */}
        <div className="group flex items-start gap-4 p-4 rounded-xl bg-gray-800/20 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-200 hover:bg-gray-800/30">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center group-hover:border-green-500/30 transition-colors">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-white">
                Item Expiration Days
              </span>
              <span className="text-[10px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full border border-gray-700/30 font-mono">
                ItemExpirationDays
              </span>
            </div>

            {isEditing ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                    min={1}
                    max={365}
                    className="bg-gray-800/30 border-gray-700 focus:border-green-500 w-32"
                  />
                  <span className="text-sm text-gray-400">days</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="glass-green"
                    onClick={handleSaveEdit}
                    isLoading={isUpdating}
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
                <p className="text-gray-300 text-sm text-left">
                  Items expire after <span className="font-bold text-white">{expirationDays}</span> days
                </p>
                <p className="text-xs text-gray-500 mt-0.5 text-left">
                  After this period, Lost Items go to Cold Case and Found Items go to Disposal
                </p>
              </div>
            )}
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <Button
              size="sm"
              variant="glass-green"
              onClick={handleStartEdit}
              disabled={isLoading}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <PencilSquareIcon className="w-4 h-4 mr-1.5" />
              Edit
            </Button>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-blue-400 font-medium">How expiration works</p>
              <p className="text-sm text-gray-400 mt-1">
                Items count days from their report/found date. When an item reaches the expiration days:
              </p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1 list-disc list-inside">
                <li>Lost Items move to <span className="text-yellow-400">Cold Case</span></li>
                <li>Found Items move to <span className="text-red-400">Disposal</span></li>
                <li>Admins receive notifications for expired items</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};