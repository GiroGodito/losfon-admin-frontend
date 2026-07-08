// src/components/dashboard/StatsCard.tsx
import React from 'react';
import { Card } from '../common/Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'green' | 'blue' | 'purple' | 'yellow' | 'red' | 'gray';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = 'green',
}) => {
  const colorStyles = {
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <Card className="hover:border-gray-600 transition-all duration-200">
      <div className="flex justify-between items-start">
        {/* Left side: Title and Value */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white text-left">{value}</p>
        </div>
        
        {/* Right side: Icon */}
        <div className={`rounded-xl border ${colorStyles[color]} flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};