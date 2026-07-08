// src/components/common/RateLimitBanner.tsx
import React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface RateLimitBannerProps {
  isRateLimited: boolean;
  countdown: number;
  resourceType?: string;
  onDismiss?: () => void;
  className?: string;
}

export const RateLimitBanner: React.FC<RateLimitBannerProps> = ({
  isRateLimited,
  countdown,
  resourceType,
  onDismiss,
  className = '',
}) => {
  if (!isRateLimited) return null;

  const resourceMessage = resourceType ? ` for ${resourceType}` : '';

  return (
    <div className={`bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-yellow-400 text-sm font-medium">
              Too many requests{resourceMessage}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              Please wait <span className="font-bold text-white">{countdown}</span> seconds before trying again.
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0 mt-0.5"
            aria-label="Dismiss"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RateLimitBanner;