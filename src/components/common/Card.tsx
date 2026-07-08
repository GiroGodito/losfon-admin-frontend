// src/components/common/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  icon,
  actions,
}) => {
  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden ${className}`}>
      {(title || subtitle || icon || actions) && (
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-start gap-3"> {/* ✅ Changed items-center to items-start */}
            {icon && <div className="text-green-400 mt-0.5">{icon}</div>} {/* ✅ Added mt-0.5 to align icon with title */}
            <div className="text-left"> {/* ✅ ADDED text-left wrapper */}
              {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};