// // src/pages/ProfilePage.tsx
// import React from 'react';
// import { useAuth } from '../context/AuthContext';
// import { ProfileCard } from '../components/auth/ProfileCard';
// import { UserCircleIcon } from '@heroicons/react/24/outline';

// export const ProfilePage = () => {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="flex justify-center py-12">
//         <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-400">Please log in to view your profile.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="text-left"> {/* ✅ WRAP in div with text-left */}
//         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//           Profile
//         </h2>
//         <p className="text-gray-400 text-sm mt-1">Your account information</p>
//       </div>

//       <ProfileCard user={user} />
//     </div>
//   );
// };
// src/pages/ProfilePage.tsx
import { useAuth } from '../context/AuthContext';
import { ProfileCard } from '../components/auth/ProfileCard';

export const ProfilePage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Profile
        </h2>
        <p className="text-gray-400 text-sm mt-1">Your account information</p>
      </div>

      <ProfileCard user={user} />
    </div>
  );
};