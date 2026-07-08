// src/components/donated-items/DonatedItemCard.tsx
import React from 'react';
import type { DonatedItem } from '../../types/donated-item.types';
import { formatDate } from '../../lib/date';
import { CalendarIcon, UserIcon, PhoneIcon, HeartIcon } from '@heroicons/react/24/outline';

interface DonatedItemCardProps {
  item: DonatedItem;
  rowNumber?: number;
  variant?: 'glass-green' | 'glass-blue' | 'glass-purple' | 'glass-red' | 'glass-grey';
}

export const DonatedItemCard: React.FC<DonatedItemCardProps> = ({
  item,
  rowNumber,
  variant = 'glass-grey',
}) => {
  const glassStyles = {
    'glass-green': 'border-green-500/20 hover:border-green-500/40 hover:shadow-green-500/10',
    'glass-blue': 'border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10',
    'glass-purple': 'border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/10',
    'glass-red': 'border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/10',
    'glass-grey': 'border-gray-500/20 hover:border-gray-500/40 hover:shadow-gray-500/10',
  };

  const isLongDescription = item.itemDescription.length > 60;

  return (
    <div className={`
      bg-gray-900/40 backdrop-blur-sm rounded-xl border transition-all duration-300 
      hover:scale-[1.02] hover:shadow-xl
      ${glassStyles[variant]}
      max-w-sm w-full
      flex flex-col
    `}>
      {/* Image Section */}
      <div className="relative w-full h-44 rounded-t-xl overflow-hidden bg-gray-800/50 flex-shrink-0">
        {item.filePath ? (
          <img
            src={item.filePath}
            alt={item.itemDescription}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800/80 to-gray-900/80">
            <HeartIcon className="w-12 h-12 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">No Image</span>
          </div>
        )}
        
        {/* Row Number - Top Left */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold border border-white/10">
            {rowNumber || '#'}
          </span>
        </div>

        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm text-blue-400 bg-blue-500/10 border-blue-500/20">
            <HeartIcon className="w-3 h-3 mr-1" />
            Donated
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 relative">
        {/* Title */}
        <div className="relative mb-3">
          <h3 className={`
            text-base font-semibold text-white leading-snug break-words
            ${isLongDescription ? 'line-clamp-3' : 'line-clamp-2'}
          `}>
            {item.itemDescription}
          </h3>
          
          {isLongDescription && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs">{formatDate(item.dateFound)}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <UserIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs truncate break-words whitespace-normal">{item.foundBy || 'N/A'}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <PhoneIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs">Turned in by: {item.turnInBy}</span>
          </div>

          {/* {item.sourceLostItemId && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                Source Lost #{item.sourceLostItemId}
              </span>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};