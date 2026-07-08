// src/components/common/StatusBadge.tsx
import React from 'react';
import { Badge } from './Badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusMap: Record<string, { variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'; label: string }> = {
    'Active': { variant: 'success', label: 'Active' },
    'Claimed': { variant: 'purple', label: 'Claimed' },
    'Expired': { variant: 'warning', label: 'Expired' },
    'Done': { variant: 'success', label: 'Done' },
    'Cold Case': { variant: 'default', label: 'Cold Case' },
    'Disposal': { variant: 'danger', label: 'Disposal' },
    'Donated': { variant: 'info', label: 'Donated' },
    'New': { variant: 'danger', label: 'New' },
    'Seen': { variant: 'success', label: 'Seen' },
  };

  const { variant, label } = statusMap[status] || { variant: 'default', label: status };

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};