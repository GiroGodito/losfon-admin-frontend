// src/pages/DashboardPage.tsx
import { useEffect } from 'react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useLostItems } from '../hooks/useLostItems';
import { useFoundItems } from '../hooks/useFoundItems';
import { useClaimedItems } from '../hooks/useClaimedItems';
import { useColdCaseItems } from '../hooks/useColdCaseItems';
import { useDonatedItems } from '../hooks/useDonatedItems';
import { useDisposalItems } from '../hooks/useDisposalItems';
import { useActivityLogs } from '../hooks/useActivityLogs';

export const DashboardPage = () => {
  // Fetch activity logs for recent activity
  const { logs, isLoading: logsLoading, fetchLogs } = useActivityLogs({ page: 1, pageSize: 5 });
  
  // Fetch with pageSize: 1 to get pagination data with totalCount
  const { items: lostItems, pagination: lostPagination } = useLostItems({ page: 1, pageSize: 1 });
  const { items: foundItems, pagination: foundPagination } = useFoundItems({ page: 1, pageSize: 1 });
  const { items: claimedItems, pagination: claimedPagination } = useClaimedItems({ page: 1, pageSize: 1 });
  const { items: coldCaseItems, pagination: coldPagination } = useColdCaseItems({ page: 1, pageSize: 1 });
  const { items: donatedItems, pagination: donatedPagination } = useDonatedItems({ page: 1, pageSize: 1 });
  const { items: disposalItems, pagination: disposalPagination } = useDisposalItems({ page: 1, pageSize: 1 });

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Get total counts from pagination
  const lostCount = lostPagination?.totalCount || lostItems.length || 0;
  const foundCount = foundPagination?.totalCount || foundItems.length || 0;
  const claimedCount = claimedPagination?.totalCount || claimedItems.length || 0;
  const coldCaseCount = coldPagination?.totalCount || coldCaseItems.length || 0;
  const donatedCount = donatedPagination?.totalCount || donatedItems.length || 0;
  const disposalCount = disposalPagination?.totalCount || disposalItems.length || 0;

  // All stats - 6 items now
  const allStats = [
    {
      title: 'Lost Items',
      value: lostCount,
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
      color: 'yellow' as const,
    },
    {
      title: 'Found Items',
      value: foundCount,
      icon: <MagnifyingGlassIcon className="w-5 h-5" />,
      color: 'blue' as const,
    },
    {
      title: 'Claimed Items',
      value: claimedCount,
      icon: <CheckCircleIcon className="w-5 h-5" />,
      color: 'green' as const,
    },
    {
      title: 'Cold Case',
      value: coldCaseCount,
      icon: <ClockIcon className="w-5 h-5" />,
      color: 'gray' as const,
    },
    {
      title: 'Disposal',
      value: disposalCount,
      icon: <TrashIcon className="w-5 h-5" />,
      color: 'red' as const,
    },
    {
      title: 'Donated',
      value: donatedCount,
      icon: <HeartIcon className="w-5 h-5" />,
      color: 'purple' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards - 3 columns on desktop, 2 columns on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allStats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity - Full Width */}
      <RecentActivity logs={logs} isLoading={logsLoading} />
    </div>
  );
};