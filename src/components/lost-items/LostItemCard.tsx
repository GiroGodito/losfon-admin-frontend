// src/components/lost-items/LostItemCard.tsx
import React from 'react';
import type { LostItem } from '../../types/lost-item.types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../lib/date';
import { CalendarIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface LostItemCardProps {
  item: LostItem;
  rowNumber?: number;
  onMarkAsDone?: (id: number) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  variant?: 'glass-green' | 'glass-blue' | 'glass-purple' | 'glass-red' | 'glass-grey';
}

export const LostItemCard: React.FC<LostItemCardProps> = ({
  item,
  rowNumber,
  onMarkAsDone,
  onDelete,
  showActions = true,
  variant = 'glass-grey',
}) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    if (item.isDone) return <Badge variant="success">Found ✓</Badge>;
    if (item.isExpired) return <Badge variant="warning">Cold Case</Badge>;
    return <Badge variant="info">Active</Badge>;
  };

  // Glass variant styles for the card
  const glassStyles = {
    'glass-green': 'border-green-500/20 hover:border-green-500/40 hover:shadow-green-500/10',
    'glass-blue': 'border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10',
    'glass-purple': 'border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/10',
    'glass-red': 'border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/10',
    'glass-grey': 'border-gray-500/20 hover:border-gray-500/40 hover:shadow-gray-500/10',
  };

  const statusColors = {
    'Active': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Found ✓': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'Cold Case': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  };

  const statusColor = item.isDone ? 'Found ✓' : item.isExpired ? 'Cold Case' : 'Active';

  // Check if description is long enough to need truncation (more than 2 lines worth)
  const isLongDescription = item.itemDescription.length > 60;

  return (
    <div className={`
      bg-gray-900/40 backdrop-blur-sm rounded-xl border transition-all duration-300 
      hover:scale-[1.02] hover:shadow-xl
      ${glassStyles[variant]}
      max-w-sm w-full
      flex flex-col
    `}>
      {/* Image Section - Fixed height, no flex */}
      <div className="relative w-full h-44 rounded-t-xl overflow-hidden bg-gray-800/50 flex-shrink-0">
        {item.filePath ? (
          <img
            src={item.filePath}
            alt={item.itemDescription}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800/80 to-gray-900/80">
            <svg
              className="w-12 h-12 text-gray-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
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
          <span className={`
            inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm
            ${statusColors[statusColor as keyof typeof statusColors] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}
          `}>
            {statusColor}
          </span>
        </div>
      </div>

      {/* Content Section - Takes remaining space with flex-1 */}
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

        {/* Details - Takes remaining space */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs">{formatDate(item.dateReported)}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <UserIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs break-words whitespace-normal">{item.reportedBy}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <PhoneIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs break-words whitespace-normal">{item.contactNumber}</span>
          </div>

          {item.userId && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                User #{item.userId}
              </span>
            </div>
          )}
        </div>

        {/* Actions - Always at bottom */}
        {showActions && (
          <div className="mt-4 pt-3 border-t border-gray-800/60 flex flex-wrap gap-2">
            <Button
              variant="glass-grey"
              size="sm"
              onClick={() => navigate(`/lost-items/${item.id}`)}
              className="flex-1 min-w-[70px] text-xs"
            >
              View Details
            </Button>
            {!item.isDone && !item.isExpired && onMarkAsDone && (
              <Button
                variant="glass-green"
                size="sm"
                onClick={() => onMarkAsDone(item.id)}
                className="flex-1 min-w-[70px] text-xs"
              >
                Mark Found
              </Button>
            )}
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