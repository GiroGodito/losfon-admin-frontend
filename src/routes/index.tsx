// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LostItemsPage } from '../pages/LostItemsPage';
import { FoundItemsPage } from '../pages/FoundItemsPage';
import { ClaimedItemsPage } from '../pages/ClaimedItemsPage';
import { ColdCaseItemsPage } from '../pages/ColdCaseItemsPage';
import { DisposalItemsPage } from '../pages/DisposalItemsPage';
import { DonatedItemsPage } from '../pages/DonatedItemsPage';
import { SSOOfficersPage } from '../pages/SSOOfficersPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ActivityLogsPage } from '../pages/ActivityLogsPage';
import { PrintSettingsPage } from '../pages/PrintSettingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ReportsPage } from '../pages/ReportsPage';
import { LostItemDetailsPage } from '../pages/LostItemDetailsPage';
import { FoundItemDetailsPage } from '../pages/FoundItemDetailsPage';
import { ClaimedItemDetailsPage } from '../pages/ClaimedItemDetailsPage';
import { ColdCaseItemDetailsPage } from '../pages/ColdCaseItemDetailsPage';
import { DisposalItemDetailsPage } from '../pages/DisposalItemDetailsPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/lost-items', element: <LostItemsPage /> },
          { path: '/lost-items/:id', element: <LostItemDetailsPage /> },
          { path: '/found-items', element: <FoundItemsPage /> },
          { path: '/found-items/:id', element: <FoundItemDetailsPage /> },
          { path: '/claimed-items', element: <ClaimedItemsPage /> },
          { path: '/claimed-items/:id', element: <ClaimedItemDetailsPage /> },
          { path: '/cold-case', element: <ColdCaseItemsPage /> },
          { path: '/cold-case/:id', element: <ColdCaseItemDetailsPage /> },
          { path: '/disposal', element: <DisposalItemsPage /> },
          { path: '/disposal/:id', element: <DisposalItemDetailsPage /> },
          { path: '/donated', element: <DonatedItemsPage /> },
          { path: '/officers', element: <SSOOfficersPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/activity-logs', element: <ActivityLogsPage /> },
          { path: '/print-settings', element: <PrintSettingsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '/', element: <LoginPage /> },
]);

export default router;