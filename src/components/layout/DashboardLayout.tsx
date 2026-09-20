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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    // ✅ FIX 1: h-screen (not min-h-screen) — locks total page height to viewport
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Header stays at the top and never scrolls */}
      <Header onMenuToggle={toggleSidebar} />

      {/* ✅ FIX 2: flex-1 + min-h-0 — this row fills the remaining height and
          lets its children handle their own scrolling */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={closeSidebar}
          />
        )}

        {/* ✅ FIX 3: Sidebar is sticky, fixed height, only its nav scrolls */}
        <aside
          className={`
            fixed md:sticky top-0 z-40 h-screen md:h-full w-72
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

          {/* ✅ FIX 4: ONLY this nav section scrolls, so if the nav list is
              long you can scroll it with the sidebar's own scrollbar.
              The user footer below stays pinned. */}
          <div className="flex-1 min-h-0 overflow-y-auto pt-4 px-3 pb-3">
            <Navigation onItemClick={closeSidebar} />
          </div>

          {/* User info / logout footer stays pinned at the bottom of the sidebar */}
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

        {/* ✅ FIX 5: Main content is the ONLY scrolling area */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Footer stays at the bottom and never scrolls */}
      <Footer />
    </div>
  );
};