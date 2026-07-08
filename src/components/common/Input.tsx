// src/components/common/Input.tsx
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', id, leftIcon, rightIcon, ...props }, ref) => {
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthStyles} ${className}`}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full px-4 py-2.5 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 hover:border-gray-500'}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';