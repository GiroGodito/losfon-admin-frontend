// import React from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import {
//   HomeIcon,
//   ClipboardDocumentListIcon,
//   MagnifyingGlassIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   TrashIcon,
//   HeartIcon,
//   UserGroupIcon,
//   BellIcon,
//   UserCircleIcon,
//   DocumentTextIcon,
//   Cog6ToothIcon,
// } from '@heroicons/react/24/outline';
// import {
//   HomeIcon as HomeIconSolid,
//   ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
//   MagnifyingGlassIcon as MagnifyingGlassIconSolid,
//   CheckCircleIcon as CheckCircleIconSolid,
//   ClockIcon as ClockIconSolid,
//   TrashIcon as TrashIconSolid,
//   HeartIcon as HeartIconSolid,
//   UserGroupIcon as UserGroupIconSolid,
//   BellIcon as BellIconSolid,
//   UserCircleIcon as UserCircleIconSolid,
//   DocumentTextIcon as DocumentTextIconSolid,
//   Cog6ToothIcon as Cog6ToothIconSolid,
// } from '@heroicons/react/24/solid';
// import { useColdCaseItems } from '../../hooks/useColdCaseItems';
// import { useDisposalItems } from '../../hooks/useDisposalItems';

// interface NavItem {
//   path: string;
//   label: string;
//   icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
//   iconSolid: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
// }

// const navItems: NavItem[] = [
//   {
//     path: '/dashboard',
//     label: 'Dashboard',
//     icon: HomeIcon,
//     iconSolid: HomeIconSolid,
//   },
//   {
//     path: '/lost-items',
//     label: 'Lost Items',
//     icon: ClipboardDocumentListIcon,
//     iconSolid: ClipboardDocumentListIconSolid,
//   },
//   {
//     path: '/found-items',
//     label: 'Found Items',
//     icon: MagnifyingGlassIcon,
//     iconSolid: MagnifyingGlassIconSolid,
//   },
//   {
//     path: '/claimed-items',
//     label: 'Claimed Items',
//     icon: CheckCircleIcon,
//     iconSolid: CheckCircleIconSolid,
//   },
//   {
//     path: '/cold-case',
//     label: 'Cold Case',
//     icon: ClockIcon,
//     iconSolid: ClockIconSolid,
//   },
//   {
//     path: '/disposal',
//     label: 'Disposal',
//     icon: TrashIcon,
//     iconSolid: TrashIconSolid,
//   },
//   {
//     path: '/donated',
//     label: 'Donated',
//     icon: HeartIcon,
//     iconSolid: HeartIconSolid,
//   },
//   {
//     path: '/officers',
//     label: 'SSO Officers',
//     icon: UserGroupIcon,
//     iconSolid: UserGroupIconSolid,
//   },
//   {
//     path: '/notifications',
//     label: 'Notifications',
//     icon: BellIcon,
//     iconSolid: BellIconSolid,
//   },
//   {
//     path: '/reports',
//     label: 'Reports',
//     icon: DocumentTextIcon,
//     iconSolid: DocumentTextIconSolid,
//   },
//   {
//     path: '/activity-logs',
//     label: 'Activity Logs',
//     icon: DocumentTextIcon,
//     iconSolid: DocumentTextIconSolid,
//   },
//   {
//     path: '/print-settings',
//     label: 'Print Settings',
//     icon: Cog6ToothIcon,
//     iconSolid: Cog6ToothIconSolid,
//   },
//   {
//     path: '/profile',
//     label: 'Profile',
//     icon: UserCircleIcon,
//     iconSolid: UserCircleIconSolid,
//   },
//   {
//     path: '/settings',
//     label: 'Settings',
//     icon: Cog6ToothIcon,
//     iconSolid: Cog6ToothIconSolid,
//   },
// ];

// interface NavigationProps {
//   className?: string;
//   onItemClick?: () => void;
// }

// export const Navigation: React.FC<NavigationProps> = ({ 
//   className = '', 
//   onItemClick 
// }) => {
//   const location = useLocation();
  
//   // ✅ FETCH COLD CASE ITEMS (just 1 item to get the count and unseen status)
//   const { items: coldCaseItems, isLoading: coldCaseLoading } = useColdCaseItems({ 
//     page: 1, 
//     pageSize: 1 
//   });
  
//   // ✅ FETCH DISPOSAL ITEMS (just 1 item to get the count and unseen status)
//   const { items: disposalItems, isLoading: disposalLoading } = useDisposalItems({ 
//     page: 1, 
//     pageSize: 1 
//   });

//   // ✅ CALCULATE UNSEEN COUNTS
//   const coldCaseUnseenCount = coldCaseItems.filter(item => !item.isSeen).length;
//   const disposalUnseenCount = disposalItems.filter(item => !item.isSeen).length;

//   return (
//     <nav className={`space-y-1 ${className}`}>
//       {navItems.map((item) => {
//         const isActive = location.pathname === item.path || 
//                          (item.path !== '/' && location.pathname.startsWith(item.path));
//         const Icon = isActive ? item.iconSolid : item.icon;

//         // ✅ DETERMINE BADGE COUNT FOR THIS NAV ITEM
//         let badgeCount = 0;
//         if (item.path === '/cold-case') {
//           badgeCount = coldCaseUnseenCount;
//         } else if (item.path === '/disposal') {
//           badgeCount = disposalUnseenCount;
//         }

//         return (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             onClick={onItemClick}
//             className={({ isActive: navLinkActive }) => `
//               flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
//               ${navLinkActive || isActive
//                 ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-lg shadow-green-500/5'
//                 : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
//               }
//             `}
//           >
//             <Icon className="w-5 h-5 flex-shrink-0" />
//             <span className="text-sm font-medium">{item.label}</span>
            
//             {/* ✅ SHOW BADGE IF THERE ARE UNSEEN ITEMS */}
//             {badgeCount > 0 && (
//               <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/30 animate-pulse">
//                 {badgeCount}
//               </span>
//             )}
            
//             {isActive && (
//               <span className="ml-auto w-1 h-6 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></span>
//             )}
//           </NavLink>
//         );
//       })}
//     </nav>
//   );
// };
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
  HeartIcon,
  UserGroupIcon,
  BellIcon,
  UserCircleIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid,
  TrashIcon as TrashIconSolid,
  HeartIcon as HeartIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BellIcon as BellIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';
import { coldCaseItemsApi } from '../../api/cold-case-items';
import { disposalItemsApi } from '../../api/disposal-items';

interface NavItem {
  path: string;
  label: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  iconSolid: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    path: '/lost-items',
    label: 'Lost Items',
    icon: ClipboardDocumentListIcon,
    iconSolid: ClipboardDocumentListIconSolid,
  },
  {
    path: '/found-items',
    label: 'Found Items',
    icon: MagnifyingGlassIcon,
    iconSolid: MagnifyingGlassIconSolid,
  },
  {
    path: '/claimed-items',
    label: 'Claimed Items',
    icon: CheckCircleIcon,
    iconSolid: CheckCircleIconSolid,
  },
  {
    path: '/cold-case',
    label: 'Cold Case',
    icon: ClockIcon,
    iconSolid: ClockIconSolid,
  },
  {
    path: '/disposal',
    label: 'Disposal',
    icon: TrashIcon,
    iconSolid: TrashIconSolid,
  },
  {
    path: '/donated',
    label: 'Donated',
    icon: HeartIcon,
    iconSolid: HeartIconSolid,
  },
  {
    path: '/officers',
    label: 'SSO Officers',
    icon: UserGroupIcon,
    iconSolid: UserGroupIconSolid,
  },
  {
    path: '/notifications',
    label: 'Notifications',
    icon: BellIcon,
    iconSolid: BellIconSolid,
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: DocumentTextIcon,
    iconSolid: DocumentTextIconSolid,
  },
  {
    path: '/activity-logs',
    label: 'Activity Logs',
    icon: DocumentTextIcon,
    iconSolid: DocumentTextIconSolid,
  },
  {
    path: '/print-settings',
    label: 'Print Settings',
    icon: Cog6ToothIcon,
    iconSolid: Cog6ToothIconSolid,
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: UserCircleIcon,
    iconSolid: UserCircleIconSolid,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Cog6ToothIcon,
    iconSolid: Cog6ToothIconSolid,
  },
];

interface NavigationProps {
  className?: string;
  onItemClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  className = '',
  onItemClick,
}) => {
  const location = useLocation();

  // State for unseen counts
  const [coldCaseUnseenCount, setColdCaseUnseenCount] = useState(0);
  const [disposalUnseenCount, setDisposalUnseenCount] = useState(0);

  // Fetch unseen counts on mount and when route changes (so it updates after marking seen)
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [cold, disposal] = await Promise.all([
          coldCaseItemsApi.getUnseenCount(),
          disposalItemsApi.getUnseenCount(),
        ]);
        setColdCaseUnseenCount(cold.count);
        setDisposalUnseenCount(disposal.count);
      } catch (error) {
        console.error('Failed to fetch unseen counts', error);
      }
    };
    fetchCounts();
  }, [location.pathname]); // refetch when navigating

  return (
    <nav className={`space-y-1 ${className}`}>
      {navItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));
        const Icon = isActive ? item.iconSolid : item.icon;

        // Determine badge count for this nav item
        let badgeCount = 0;
        if (item.path === '/cold-case') {
          badgeCount = coldCaseUnseenCount;
        } else if (item.path === '/disposal') {
          badgeCount = disposalUnseenCount;
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={({ isActive: navLinkActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                navLinkActive || isActive
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-lg shadow-green-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }
            `}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>

            {/* Badge with fixed width to prevent layout shift */}
            <span
              className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white transition-all ${
                badgeCount > 0
                  ? 'bg-red-500 shadow-lg shadow-red-500/30 animate-pulse'
                  : 'invisible bg-transparent'
              }`}
            >
              {badgeCount > 0 ? (badgeCount > 9 ? '9+' : badgeCount) : ''}
            </span>

            {isActive && (
              <span className="w-1 h-6 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};