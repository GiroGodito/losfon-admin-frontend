// src/components/claimed-items/ClaimedItemCard.tsx
import React from 'react';
import type { ClaimedItem } from '../../types/claimed-item.types';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../lib/date';
import { CalendarIcon, UserIcon, PhoneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ClaimedItemCardProps {
  item: ClaimedItem;
  rowNumber?: number;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  variant?: 'glass-green' | 'glass-blue' | 'glass-purple' | 'glass-red' | 'glass-grey';
}

export const ClaimedItemCard: React.FC<ClaimedItemCardProps> = ({
  item,
  rowNumber,
  onDelete,
  showActions = true,
  variant = 'glass-grey',
}) => {
  const navigate = useNavigate();

  // Glass variant styles for the card
  const glassStyles = {
    'glass-green': 'border-green-500/20 hover:border-green-500/40 hover:shadow-green-500/10',
    'glass-blue': 'border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10',
    'glass-purple': 'border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/10',
    'glass-red': 'border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/10',
    'glass-grey': 'border-gray-500/20 hover:border-gray-500/40 hover:shadow-gray-500/10',
  };

  // Status colors - GREEN "Resolved" matching FoundItemCard's "Active" badge
  const getStatusColorClasses = (hasImage: boolean) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm';
    
    if (hasImage) {
      return {
        'Resolved': `${baseClasses} text-green-300 bg-green-700/80 border-green-500/60 shadow-lg shadow-green-500/30`,
      };
    } else {
      return {
        'Resolved': `${baseClasses} text-green-500 bg-green-500/10 border-green-500/20`,
      };
    }
  };

  const statusClasses = getStatusColorClasses(!!item.filePath);

  // Check if description is long enough to need truncation
  const isLongDescription = item.itemDescription.length > 60;

  return (
    <div className={`
      bg-gray-900/40 backdrop-blur-sm rounded-xl border transition-all duration-300 
      hover:scale-[1.02] hover:shadow-xl
      ${glassStyles[variant]}
      max-w-sm w-full
      flex flex-col
    `}>
      {/* Image Section - Full width with placeholder */}
      <div className="relative w-full h-44 rounded-t-xl overflow-hidden bg-gray-800/50 flex-shrink-0">
        {item.filePath ? (
          <img
            src={item.filePath}
            alt={item.itemDescription}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800/80 to-gray-900/80">
            <CheckCircleIcon className="w-12 h-12 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">No Image</span>
          </div>
        )}
        
        {/* Row Number - Top Left */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold border border-white/10">
            {rowNumber || '#'}
          </span>
        </div>

        {/* Status Badge - Top Right - "Resolved" with green styling */}
        <div className="absolute top-3 right-3">
          <span className={statusClasses['Resolved']}>
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Resolved
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 relative">
        {/* Title - With gradient fade for long text */}
        <div className="relative mb-3">
          <h3 className={`
            text-base font-semibold text-white leading-snug break-words
            ${isLongDescription ? 'line-clamp-3' : 'line-clamp-2'}
          `}>
            {item.itemDescription}
          </h3>
          
          {/* Gradient fade overlay - appears when text is long */}
          {isLongDescription && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Details Grid */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <UserIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs truncate">Claimed by: {item.claimedBy}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs">{formatDate(item.releasedDate)}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <PhoneIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs truncate">{item.claimedContactInformation}</span>
          </div>

          {item.userId && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                User #{item.userId}
              </span>
            </div>
          )}
        </div>

        {/* Actions - All buttons use glass variants */}
        {showActions && (
          <div className="mt-4 pt-3 border-t border-gray-800/60 flex flex-wrap gap-2">
            <Button
              variant="glass-grey"
              size="sm"
              onClick={() => navigate(`/claimed-items/${item.id}`)}
              className="flex-1 min-w-[70px] text-xs"
            >
              View Details
            </Button>
            {onDelete && (
              <Button
                variant="glass-red"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="flex-1 min-w-[70px] text-xs"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};