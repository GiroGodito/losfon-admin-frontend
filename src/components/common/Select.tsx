// src/components/common/Select.tsx
import React, { forwardRef, useState } from 'react';
import { ChevronDownIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
  placeholder?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      fullWidth = true,
      placeholder,
      helperText,
      leftIcon,
      required = false,
      className = '',
      id,
      value,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const widthStyles = fullWidth ? 'w-full' : '';
    const hasError = !!error;

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={`${widthStyles} ${className}`}>
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300">
              {label}
              {required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {helperText && !hasError && (
              <span className="text-xs text-gray-500">{helperText}</span>
            )}
          </div>
        )}

        {/* Select Wrapper */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <span className="text-gray-400">{leftIcon}</span>
            </div>
          )}

          {/* Native Select */}
          <select
            ref={ref}
            id={id}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              w-full px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm rounded-xl text-white
              transition-all duration-200 appearance-none cursor-pointer
              border 
              ${hasError 
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50' 
                : isFocused 
                  ? 'border-green-500 ring-2 ring-green-500/20' 
                  : 'border-gray-700 hover:border-gray-500'
              }
              ${leftIcon ? 'pl-10' : 'pl-4'}
              pr-10
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:bg-gray-800/20
              text-sm
              ${hasError ? 'text-red-400' : 'text-white'}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" className="text-gray-400 bg-gray-900">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={String(option.value)} 
                value={option.value} 
                className="text-white bg-gray-900 py-1"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon - Custom styled */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon 
              className={`
                w-5 h-5 transition-all duration-200
                ${isFocused ? 'text-green-400 rotate-180' : 'text-gray-400'}
                ${hasError ? 'text-red-400' : ''}
              `}
            />
          </div>

          {/* Error Icon */}
          {hasError && (
            <div className="absolute inset-y-0 right-8 pr-1 flex items-center pointer-events-none">
              <ExclamationCircleIcon className="w-5 h-5 text-red-400" />
            </div>
          )}
        </div>

        {/* Error Message */}
        {hasError && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <ExclamationCircleIcon className="w-4 h-4 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Helper Text (when no error) */}
        {helperText && !hasError && !label && (
          <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';