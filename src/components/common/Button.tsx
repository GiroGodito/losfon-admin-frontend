// src/components/common/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 
    | 'primary' 
    | 'secondary' 
    | 'outline' 
    | 'outline-dark' 
    | 'danger' 
    | 'success' 
    | 'ghost' 
    | 'purple' 
    | 'green'
    | 'glass-green'
    | 'glass-red'
    | 'glass-blue'
    | 'glass-yellow'
    | 'glass-grey';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-offset-gray-900',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
  ].join(' ');

  const variantStyles = {
    // ✅ GLASS GREEN - matches your screenshot perfectly!
    'glass-green': [
      'bg-green-500/15',
      'backdrop-blur-sm',
      'text-green-400',
      'border',
      'border-green-500/25',
      'hover:bg-green-500/25',
      'hover:border-green-500/40',
      'hover:text-green-300',
      'focus:ring-green-500',
      'shadow-sm',
      'shadow-green-500/5',
      'hover:shadow-green-500/20',
      'hover:scale-[1.02]',
      'transition-all',
      'duration-200',
    ].join(' '),
    
    // ✅ GLASS RED - warm, energetic glass effect
    'glass-red': [
      'bg-red-500/15',
      'backdrop-blur-sm',
      'text-red-400',
      'border',
      'border-red-500/25',
      'hover:bg-red-500/25',
      'hover:border-red-500/40',
      'hover:text-red-300',
      'focus:ring-red-500',
      'shadow-sm',
      'shadow-red-500/5',
      'hover:shadow-red-500/20',
      'hover:scale-[1.02]',
      'transition-all',
      'duration-200',
    ].join(' '),
    
    // ✅ GLASS BLUE - cool, professional glass effect
    'glass-blue': [
      'bg-blue-500/15',
      'backdrop-blur-sm',
      'text-blue-400',
      'border',
      'border-blue-500/25',
      'hover:bg-blue-500/25',
      'hover:border-blue-500/40',
      'hover:text-blue-300',
      'focus:ring-blue-500',
      'shadow-sm',
      'shadow-blue-500/5',
      'hover:shadow-blue-500/20',
      'hover:scale-[1.02]',
      'transition-all',
      'duration-200',
    ].join(' '),
    
    // ✅ GLASS YELLOW - warm, inviting glass effect
    'glass-yellow': [
      'bg-yellow-500/15',
      'backdrop-blur-sm',
      'text-yellow-400',
      'border',
      'border-yellow-500/25',
      'hover:bg-yellow-500/25',
      'hover:border-yellow-500/40',
      'hover:text-yellow-300',
      'focus:ring-yellow-500',
      'shadow-sm',
      'shadow-yellow-500/5',
      'hover:shadow-yellow-500/20',
      'hover:scale-[1.02]',
      'transition-all',
      'duration-200',
    ].join(' '),
    
    // ✅ GLASS GREY - neutral, subtle glass effect
    'glass-grey': [
      'bg-gray-500/15',
      'backdrop-blur-sm',
      'text-gray-300',
      'border',
      'border-gray-500/25',
      'hover:bg-gray-500/25',
      'hover:border-gray-500/40',
      'hover:text-gray-200',
      'focus:ring-gray-500',
      'shadow-sm',
      'shadow-gray-500/5',
      'hover:shadow-gray-500/20',
      'hover:scale-[1.02]',
      'transition-all',
      'duration-200',
    ].join(' '),
    
    primary: [
      'bg-green-600',
      'text-white',
      'hover:bg-green-500',
      'focus:ring-green-500',
      'shadow-lg',
      'shadow-green-600/30',
      'hover:shadow-green-500/50',
      'hover:scale-[1.02]',
    ].join(' '),
    
    green: [
      'bg-green-500',
      'text-white',
      'hover:bg-green-600',
      'focus:ring-green-500',
      'shadow-sm',
      'shadow-green-500/20',
      'hover:shadow-green-500/40',
      'transition-all',
    ].join(' '),
    
    secondary: [
      'bg-gray-700',
      'text-gray-200',
      'hover:bg-gray-600',
      'focus:ring-gray-500',
    ].join(' '),
    
    outline: [
      'border-2',
      'border-green-500',
      'text-green-400',
      'hover:bg-green-500/10',
      'hover:border-green-400',
      'hover:text-green-300',
      'focus:ring-green-500',
    ].join(' '),
    
    'outline-dark': [
      'bg-gray-900/40',
      'backdrop-blur-sm',
      'text-white',
      'border',
      'border-gray-700/50',
      'hover:bg-gray-800/60',
      'hover:border-gray-600/70',
      'focus:ring-gray-500',
      'shadow-sm',
      'hover:shadow-md',
      'transition-all',
      'duration-200',
    ].join(' '),
    
    danger: [
      'bg-red-600',
      'text-white',
      'hover:bg-red-500',
      'focus:ring-red-500',
    ].join(' '),
    
    success: [
      'bg-emerald-600',
      'text-white',
      'hover:bg-emerald-500',
      'focus:ring-emerald-500',
    ].join(' '),
    
    ghost: [
      'text-gray-400',
      'hover:text-white',
      'hover:bg-gray-700/50',
      'focus:ring-gray-500',
    ].join(' '),
    
    purple: [
      'bg-purple-600',
      'text-white',
      'hover:bg-purple-500',
      'focus:ring-purple-500',
      'shadow-lg',
      'shadow-purple-600/30',
      'hover:shadow-purple-500/50',
      'hover:scale-[1.02]',
    ].join(' '),
  };

  const sizeStyles = {
    sm: ['px-3', 'py-1.5', 'text-sm'].join(' '),
    md: ['px-4', 'py-2', 'text-base'].join(' '),
    lg: ['px-6', 'py-3', 'text-lg'].join(' '),
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyles}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;