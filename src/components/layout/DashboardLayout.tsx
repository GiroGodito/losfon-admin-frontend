// // src/components/layout/DashboardLayout.tsx
// import React, { useState, useEffect } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { Header } from './Header';
// import { Footer } from './Footer';
// import { Navigation } from './Navigation';
// import { XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
// import { useAuth } from '../../context/AuthContext';

// export const DashboardLayout: React.FC = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && sidebarOpen) {
//         setSidebarOpen(false);
//       }
//     };
//     window.addEventListener('keydown', handleEscape);
//     return () => window.removeEventListener('keydown', handleEscape);
//   }, [sidebarOpen]);

//   useEffect(() => {
//     if (sidebarOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [sidebarOpen]);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//   const closeSidebar = () => setSidebarOpen(false);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black">
//       <Header onMenuToggle={toggleSidebar} />

//       <div className="flex flex-1 overflow-hidden">
//         {sidebarOpen && (
//           <div 
//             className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
//             onClick={closeSidebar}
//           />
//         )}

//         <aside className={`
//           fixed md:sticky top-0 z-40 h-screen w-72 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800
//           transition-transform duration-300 ease-in-out
//           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
//           flex flex-col shadow-2xl
//         `}>
//           <button
//             onClick={closeSidebar}
//             className="md:hidden absolute top-4 right-4 z-50 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
//             aria-label="Close menu"
//           >
//             <XMarkIcon className="w-6 h-6" />
//           </button>

//           <div className="flex-1 overflow-y-auto pt-4 px-3 pb-3">
//             <Navigation onItemClick={closeSidebar} />
//           </div>

//           <div className="p-4 border-t border-gray-800">
//             <div className="flex items-center gap-3 text-sm">
//               <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-green-500/30 flex-shrink-0">
//                 <span className="text-green-400 font-semibold text-sm">
//                   {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
//                 </span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-white text-sm font-medium truncate">
//                   {user?.fullName || 'Admin'}
//                 </p>
//                 <p className="text-gray-500 text-xs truncate">
//                   {user?.email || 'admin@losfon.com'}
//                 </p>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
//                 title="Logout"
//               >
//                 <ArrowRightOnRectangleIcon className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </aside>

//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//             <Outlet />
//         </main>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// src/components/layout/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Navigation } from './Navigation';
import { XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    // ✅ h-screen + overflow-hidden: page never scrolls as a whole;
    //    only <main> scrolls. Keeps sidebar sticky.
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      <Header onMenuToggle={toggleSidebar} />

      {/* min-h-0 is required so flex children can actually scroll */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Mobile overlay: z-30 so it sits BELOW the sidebar (z-50) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-0 z-50 h-screen md:h-full w-72
            bg-gray-900/95 backdrop-blur-sm border-r border-gray-800
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            flex flex-col shadow-2xl flex-shrink-0
          `}
        >
          <button
            onClick={closeSidebar}
            className="md:hidden absolute top-4 right-4 z-50 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/*
            ✅ KEY FIX: pt-20 on mobile pushes the nav content below the
            64px sticky header so "Dashboard" isn't hidden behind it.
            On desktop (md:pt-4), the sidebar is already below the header
            thanks to the flex layout, so no extra padding is needed.
          */}
          <div className="flex-1 min-h-0 overflow-y-auto pt-20 md:pt-4 px-3 pb-3">
            <Navigation onItemClick={closeSidebar} />
          </div>

          {/* User footer pinned at bottom of sidebar (doesn't scroll) */}
          <div className="p-4 border-t border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-green-500/30 flex-shrink-0">
                <span className="text-green-400 font-semibold text-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.fullName || 'Admin'}
                </p>
                <p className="text-gray-500 text-xs truncate">
                  {user?.email || 'admin@losfon.com'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main content — the ONLY scrolling area */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};