// // src/components/layout/Header.tsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { NotificationBell } from '../notifications/NotificationBell';
// import { Bars3Icon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

// interface HeaderProps {
//   onMenuToggle?: () => void;
// }

// export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//   };

//   return (
//     <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={onMenuToggle}
//               className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
//               aria-label="Toggle menu"
//             >
//               <Bars3Icon className="w-6 h-6" />
//             </button>

//             <Link to="/dashboard" className="flex items-center gap-2.5 group">
//               {/* ✅ GLASS GREEN LOGO - No glow, subtle glass effect */}
//               <div className="
//                 w-9 h-9 
//                 bg-green-500/10 backdrop-blur-sm 
//                 border border-green-500/20 
//                 rounded-xl 
//                 flex items-center justify-center 
//                 group-hover:bg-green-500/20
//                 group-hover:border-green-500/30
//                 transition-all duration-300
//               ">
//                 <span className="text-green-400 font-bold text-base group-hover:text-green-300 transition-colors">
//                   LF
//                 </span>
//               </div>
//               <span className="text-white font-semibold text-xl tracking-tight hidden sm:block">
//                 LosFon <span className="text-green-400">Admin</span>
//               </span>
//             </Link>
//           </div>

//           <div className="flex items-center gap-3">
//             <NotificationBell />

//             <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-700">
//               <div className="flex items-center gap-3">
//                 <div className="w-9 h-9 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-green-500/30">
//                   <span className="text-green-400 font-semibold text-sm">
//                     {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
//                   </span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-white text-sm font-medium leading-tight">
//                     {user?.fullName || 'Admin'}
//                   </span>
//                   <span className="text-gray-500 text-xs leading-tight">
//                     {user?.email || 'admin@losfon.com'}
//                   </span>
//                 </div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="ml-2 p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
//                 title="Logout"
//               >
//                 <ArrowRightOnRectangleIcon className="w-5 h-5" />
//               </button>
//             </div>

//             <Link 
//               to="/profile"
//               className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
//               title="Profile"
//             >
//               <UserCircleIcon className="w-6 h-6" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// src/components/layout/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';
import { Bars3Icon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Hamburger — mobile only */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* ✅ Logo — DESKTOP ONLY (mobile shows it in the sidebar) */}
            <Link
              to="/dashboard"
              className="hidden md:flex items-center gap-2.5 group"
            >
              <div className="
                w-9 h-9 
                bg-green-500/10 backdrop-blur-sm 
                border border-green-500/20 
                rounded-xl 
                flex items-center justify-center 
                group-hover:bg-green-500/20
                group-hover:border-green-500/30
                transition-all duration-300
              ">
                <span className="text-green-400 font-bold text-base group-hover:text-green-300 transition-colors">
                  LF
                </span>
              </div>
              <span className="text-white font-semibold text-xl tracking-tight">
                LosFon <span className="text-green-400">Admin</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />

            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                  <span className="text-green-400 font-semibold text-sm">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium leading-tight">
                    {user?.fullName || 'Admin'}
                  </span>
                  <span className="text-gray-500 text-xs leading-tight">
                    {user?.email || 'admin@losfon.com'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>

            <Link
              to="/profile"
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
              title="Profile"
            >
              <UserCircleIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;