// src/components/found-items/FoundItemDetails.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { FoundItem } from '../../types/found-item.types';
import { Button } from '../common/Button';
import { formatDateWithTime, formatRelativeTime } from '../../lib/date';
import {
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface FoundItemDetailsProps {
  item: FoundItem;
  onMarkAsClaimed?: (id: number) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export const FoundItemDetails: React.FC<FoundItemDetailsProps> = ({
  item,
  onMarkAsClaimed,
  onDelete,
  showActions = true,
}) => {
  const navigate = useNavigate();

  /**
   * Determines the appropriate status badge based on item state
   * Returns glass-green or solid green variant based on image presence
   */
  const getStatusBadge = (hasImage: boolean): React.ReactNode => {
    const baseClasses = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border';

    const getBadgeClasses = (status: string): string => {
      if (hasImage) {
        switch (status) {
          case 'Active':
            return `${baseClasses} text-green-300 bg-green-700/80 border-green-500/60 shadow-lg shadow-green-500/30`;
          case 'Claimed':
            return `${baseClasses} text-white bg-purple-600/80 border-purple-400/60 shadow-lg shadow-purple-500/30`;
          case 'Expired':
            return `${baseClasses} text-white bg-yellow-600/80 border-yellow-400/60 shadow-lg shadow-yellow-500/30`;
          default:
            return `${baseClasses} text-gray-300 bg-gray-700/80 border-gray-500/60 shadow-lg shadow-gray-500/30`;
        }
      } else {
        switch (status) {
          case 'Active':
            return `${baseClasses} text-green-400 bg-green-500/10 border-green-500/20`;
          case 'Claimed':
            return `${baseClasses} text-purple-400 bg-purple-500/10 border-purple-500/20`;
          case 'Expired':
            return `${baseClasses} text-yellow-400 bg-yellow-500/10 border-yellow-500/20`;
          default:
            return `${baseClasses} text-gray-400 bg-gray-500/10 border-gray-500/20`;
        }
      }
    };

    let status = 'Active';
    if (item.isClaimed) status = 'Claimed';
    else if (item.isExpired) status = 'Expired';

    return <span className={getBadgeClasses(status)}>{status}</span>;
  };

  const renderActions = (): React.ReactNode => {
    if (!showActions || item.isClaimed || item.isExpired) return null;

    return (
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex flex-wrap gap-3">
          {onMarkAsClaimed && (
            <Button variant="glass-green" onClick={() => onMarkAsClaimed(item.id)}>
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Mark as Claimed
            </Button>
          )}
          {onDelete && (
            <Button variant="glass-red" onClick={() => onDelete(item.id)}>
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete Item
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderResolvedIndicator = (): React.ReactNode => {
    if (!item.isClaimed) return null;

    return (
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-500/10 to-indigo-500/5 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <p className="font-medium text-purple-400">Item Has Been Claimed</p>
              <p className="text-sm text-gray-400">
                This item has been marked as claimed and moved to claimed items.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStatusTimeline = (): React.ReactNode => {
    const events = [
      {
        label: 'Found',
        value: formatDateWithTime(item.dateFound),
        icon: <CalendarIcon className="w-4 h-4" />,
      },
      ...(item.isExpired && item.dateTransferred
        ? [
            {
              label: 'Transferred to Disposal',
              value: formatDateWithTime(item.dateTransferred),
              icon: <ClockIcon className="w-4 h-4" />,
            },
          ]
        : []),
      ...(item.isClaimed
        ? [
            {
              label: 'Marked as Claimed',
              value: formatRelativeTime(item.updatedAt),
              icon: <CheckCircleIcon className="w-4 h-4" />,
            },
          ]
        : []),
    ];

    return (
      <div className="bg-gray-800/20 rounded-xl border border-gray-700/50 p-4">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Activity Timeline
        </h4>
        <div className="space-y-2.5">
          {events.map((event, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-400 flex-shrink-0">
                {event.icon}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm text-gray-300">{event.label}</span>
                <span className="text-sm text-gray-400">{event.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const hasImage = !!item.filePath;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="glass-grey"
            size="sm"
            onClick={() => navigate('/found-items')}
            aria-label="Return to found items list"
            className="!px-3"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold text-white">Found Item Details</h2>
        </div>

        {/* Image - Full width at top */}
        <div className="mb-5">
          {hasImage ? (
            <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700">
              <img
                src={item.filePath ?? ''}
                alt={`Item: ${item.itemDescription}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                {getStatusBadge(true)}
              </div>
            </div>
          ) : (
            <div className="relative w-full h-64 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 flex flex-col items-center justify-center">
              <div className="text-6xl mb-3 opacity-50">📷</div>
              <p className="text-sm text-gray-500">No Image Available</p>
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                {getStatusBadge(false)}
              </div>
            </div>
          )}
        </div>

        {/* ✅ Item Title - FIXED: Added word-break and max-width */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white break-words">
            {item.itemDescription}
          </h3>
        </div>

        {/* ✅ 2x2 Grid - FIXED: Added overflow handling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {/* TOP LEFT */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-400 flex-shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Date Found</p>
              <p className="text-sm text-white font-medium truncate">{formatDateWithTime(item.dateFound)}</p>
            </div>
          </div>

          {/* TOP RIGHT */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-400 flex-shrink-0">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Found By</p>
              <p className="text-sm text-white font-medium truncate">{item.foundBy || 'N/A'}</p>
            </div>
          </div>

          {/* BOTTOM LEFT */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-400 flex-shrink-0">
              <PhoneIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Turned In By</p>
              <p className="text-sm text-white font-medium truncate">{item.turnInBy}</p>
            </div>
          </div>

          {/* BOTTOM RIGHT */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-400 flex-shrink-0">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Last Updated</p>
              <p className="text-sm text-white font-medium truncate">{formatRelativeTime(item.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* System Metadata */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 bg-gray-800/20 rounded-lg border border-gray-700/50 px-4 py-2.5 flex-wrap">
          <span>
            Created <span className="text-gray-400">{formatRelativeTime(item.createdAt)}</span>
          </span>
          <span className="text-gray-700">•</span>
          <span>
            Updated <span className="text-gray-400">{formatRelativeTime(item.updatedAt)}</span>
          </span>
        </div>

        {/* Actions */}
        {renderActions()}

        {/* Resolved Indicator */}
        {renderResolvedIndicator()}
      </div>
    </div>
  );
};

export default FoundItemDetails;