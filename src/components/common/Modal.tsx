// src/components/common/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | '2xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  maxHeight?: string; // ✅ ADD THIS
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = '',
  maxHeight = '90vh', // ✅ Default max height
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-6xl',
    '2xl': 'max-w-3xl', // ✅ ADDED 2xl size
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        closeOnOverlayClick &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnOverlayClick]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />
      <div
        ref={modalRef}
        className={`
          relative bg-gray-900 rounded-xl shadow-2xl w-full ${sizeStyles[size]} 
          border border-gray-800
          transform transition-all duration-200
          flex flex-col
          ${className}
        `}
        style={{ maxHeight: maxHeight }}
      >
        {/* Header - Fixed */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Body - Scrollable */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};