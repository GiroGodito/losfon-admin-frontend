// src/components/common/EmptyState.tsx
import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full py-12">
      <div className="text-center max-w-md mx-auto">
        {icon && (
          <div className="mx-auto h-16 w-16 text-gray-500 mb-4 flex items-center justify-center">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-400 mb-2">{title}</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};