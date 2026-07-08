// src/components/common/SearchInput.tsx
import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Input } from './Input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />}
        rightIcon={
          value && (
            <button
              onClick={() => onChange('')}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )
        }
      />
    </div>
  );
};