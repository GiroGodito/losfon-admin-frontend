// src/components/common/ConfirmDialog.tsx
import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-500 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500',
  };

  const iconStyles = {
    danger: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 ${iconStyles[variant]}`}>
          <ExclamationTriangleIcon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-400">{message}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Button variant="glass-grey" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'glass-red' : variant === 'warning' ? 'glass-green' : 'glass-green'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};