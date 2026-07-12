// src/pages/SettingsPage.tsx
import { SystemSettings } from '../components/settings/SystemSettings';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Settings
        </h2>
        <p className="text-gray-400 text-sm mt-1">Configure system settings</p>
      </div>

      <SystemSettings />
    </div>
  );
};