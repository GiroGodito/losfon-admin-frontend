// src/components/sso-officers/OfficerCard.tsx
import React from 'react';
import type { SSOfficer } from '../../types/sso-officer.types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatDate } from '../../lib/date';
import { PencilSquareIcon, TrashIcon, PhoneIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface OfficerCardProps {
  officer: SSOfficer;
  rowNumber?: number;
  onEdit: (officer: SSOfficer) => void;
  onDelete: (id: number) => void;
  isDefault?: boolean;
  variant?: 'glass-green' | 'glass-blue' | 'glass-purple' | 'glass-red' | 'glass-grey';
}

export const OfficerCard: React.FC<OfficerCardProps> = ({
  officer,
  rowNumber,
  onEdit,
  onDelete,
  isDefault = false,
  variant = 'glass-grey',
}) => {
  // Get initials for avatar
  const getInitials = () => {
    const first = officer.firstName?.charAt(0)?.toUpperCase() || '';
    const last = officer.lastName?.charAt(0)?.toUpperCase() || '';
    return first + last;
  };

  // Generate a consistent color based on the name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-green-500/20 to-blue-500/20 border-green-500/30 text-green-400',
      'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
      'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
      'from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-orange-400',
      'from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400',
      'from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400',
      'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-400',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Glass variant styles for the card
  const glassStyles = {
    'glass-green': 'border-green-500/20 hover:border-green-500/40 hover:shadow-green-500/10',
    'glass-blue': 'border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10',
    'glass-purple': 'border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/10',
    'glass-red': 'border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/10',
    'glass-grey': 'border-gray-500/20 hover:border-gray-500/40 hover:shadow-gray-500/10',
  };

  // Check if full name is long enough to need truncation
  const fullName = `${officer.firstName} ${officer.lastName}`;
  const isLongName = fullName.length > 25;

  return (
    <div className={`
      bg-gray-900/40 backdrop-blur-sm rounded-xl border transition-all duration-300 
      hover:scale-[1.02] hover:shadow-xl
      ${glassStyles[variant]}
      max-w-sm w-full
      flex flex-col
    `}>
      {/* Image Section - Full width with avatar */}
      <div className="relative w-full h-44 rounded-t-xl overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 flex items-center justify-center flex-shrink-0">
        <div className={`w-24 h-24 bg-gradient-to-br ${getAvatarColor(officer.firstName + officer.lastName)} rounded-full flex items-center justify-center border-2 shadow-lg shadow-green-500/20`}>
          <span className="text-3xl font-semibold text-white">
            {getInitials()}
          </span>
        </div>
        
        {/* Row Number - Top Left */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold border border-white/10">
            {rowNumber || '#'}
          </span>
        </div>

        {/* Default Badge - Top Right */}
        <div className="absolute top-3 right-3">
          {isDefault && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm text-green-400 bg-green-500/10 border-green-500/20">
              ★ Default
            </span>
          )}
        </div>
      </div>

      {/* Content Section - Takes remaining space with flex-1 */}
      <div className="p-4 flex flex-col flex-1 relative">
        {/* Name - With gradient fade for long names */}
        <div className="relative mb-3">
          <h3 className={`
            text-base font-semibold text-white leading-snug text-center break-words
            ${isLongName ? 'line-clamp-2' : 'truncate'}
          `}>
            {fullName}
          </h3>
          
          {/* Gradient fade overlay - appears when name is long */}
          {isLongName && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Details - Takes remaining space */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <PhoneIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs truncate break-words whitespace-normal">{officer.contactInformation}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs">Added {formatDate(officer.createdAt)}</span>
          </div>
        </div>

        {/* Actions - Always at bottom */}
        <div className="mt-4 pt-3 border-t border-gray-800/60 flex flex-wrap gap-2">
          <Button
            variant="glass-green"
            size="sm"
            onClick={() => onEdit(officer)}
            className="flex-1 min-w-[70px] text-xs"
          >
            <PencilSquareIcon className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="glass-red"
            size="sm"
            onClick={() => onDelete(officer.id)}
            className="flex-1 min-w-[70px] text-xs"
          >
            <TrashIcon className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};