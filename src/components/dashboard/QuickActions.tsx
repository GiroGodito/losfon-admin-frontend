// src/components/dashboard/QuickActions.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import {
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface QuickAction {
  to: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    to: '/lost-items/create',
    icon: PlusCircleIcon,
    title: 'Report Lost Item',
    description: 'Add a new lost item report',
    color: 'green',
  },
  {
    to: '/found-items/create',
    icon: PlusCircleIcon,
    title: 'Add Found Item',
    description: 'Record a found item',
    color: 'blue',
  },
  {
    to: '/lost-items',
    icon: ClipboardDocumentListIcon,
    title: 'View Lost Items',
    description: 'Manage lost item reports',
    color: 'yellow',
  },
  {
    to: '/found-items',
    icon: MagnifyingGlassIcon,
    title: 'View Found Items',
    description: 'Manage found items',
    color: 'purple',
  },
  {
    to: '/claimed-items',
    icon: CheckCircleIcon,
    title: 'View Claimed Items',
    description: 'Manage claimed items',
    color: 'green',
  },
  {
    to: '/cold-case',
    icon: ClipboardDocumentListIcon,
    title: 'Cold Case',
    description: 'View cold case items',
    color: 'gray',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <Card title="Quick Actions" subtitle="Common tasks">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const colorClasses = {
            green: 'hover:border-green-500/50 hover:bg-green-500/5',
            blue: 'hover:border-blue-500/50 hover:bg-blue-500/5',
            purple: 'hover:border-purple-500/50 hover:bg-purple-500/5',
            yellow: 'hover:border-yellow-500/50 hover:bg-yellow-500/5',
            gray: 'hover:border-gray-500/50 hover:bg-gray-500/5',
          };

          return (
            <Link
              key={action.to}
              to={action.to}
              className={`
                flex items-center gap-3 p-3 rounded-lg border border-gray-800
                transition-all duration-200 hover:scale-[1.02]
                ${colorClasses[action.color as keyof typeof colorClasses]}
              `}
            >
              <Icon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};