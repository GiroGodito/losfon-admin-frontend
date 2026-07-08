// src/components/dashboard/Charts.tsx
import React from 'react';
import { Card } from '../common/Card';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ChartsProps {
  title: string;
  subtitle?: string;
  data: ChartData[];
  type?: 'bar' | 'horizontal' | 'pie';
}

export const Charts: React.FC<ChartsProps> = ({
  title,
  subtitle,
  data,
  type = 'bar',
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  const getColor = (index: number) => {
    const colors = [
      'bg-green-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-pink-500',
      'bg-indigo-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <Card title={title} subtitle={subtitle}>
      <div className="space-y-3">
        {type === 'bar' && data.map((item, index) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white">{item.value}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${getColor(index)}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}

        {type === 'horizontal' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.map((item, index) => (
              <div key={item.label} className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${getColor(index)}/20`}>
                  <span className={`text-lg font-bold ${getColor(index)}`}>{item.value}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {type === 'pie' && (
          <div className="flex flex-wrap justify-center gap-4">
            {data.map((item, index) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getColor(index)}`} />
                <span className="text-sm text-gray-400">{item.label}</span>
                <span className="text-sm text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};