// src/components/auth/ProfileCard.tsx
import React, { useState } from 'react';
import type { ProfileResponse } from '../../api/auth';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { 
  EnvelopeIcon, 
  UserIcon, 
  KeyIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface ProfileCardProps {
  user: ProfileResponse;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const { updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    fullName: user.fullName,
    email: user.email,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
      });
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await changePassword(passwordData);
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6 md:p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border-2 border-green-500/30 group-hover:border-green-400/50 transition-all duration-300">
              <span className="text-3xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg shadow-green-500/30"></div>
          </div>

          {/* User Info */}
          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-gray-800/30 border-gray-700 focus:border-green-500"
                />
                <Input
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-gray-800/30 border-gray-700 focus:border-green-500"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-800/30 border-gray-700 focus:border-green-500"
                />
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="glass-green" 
                    onClick={handleUpdateProfile} 
                    isLoading={isLoading}
                    className="flex-1"
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    variant="glass-grey" 
                    onClick={handleEditToggle}
                    className="flex-1"
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white text-left">{user.fullName}</h2>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400 bg-gray-800/30 px-3 py-1 rounded-full border border-gray-700/50">
                      <UserIcon className="w-3.5 h-3.5 text-green-400" />
                      <span>@{user.username}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 bg-gray-800/30 px-3 py-1 rounded-full border border-gray-700/50">
                      <EnvelopeIcon className="w-3.5 h-3.5 text-green-400" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="glass-green" 
                  onClick={handleEditToggle}
                  className="whitespace-nowrap"
                >
                  <PencilSquareIcon className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 pt-6 border-t border-gray-800/60">
          {/* Change Password Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-green-400" />
              <h4 className="text-sm font-medium text-gray-300">Security</h4>
            </div>
            {!isChangingPassword && (
              <Button 
                variant="glass-grey" 
                size="sm" 
                onClick={() => setIsChangingPassword(true)}
              >
                <KeyIcon className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            )}
          </div>

          {isChangingPassword ? (
            <div className="space-y-4 bg-gray-800/20 rounded-xl p-5 border border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="password"
                  label="Current Password"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="bg-gray-800/30 border-gray-700 focus:border-green-500"
                />
                <Input
                  type="password"
                  label="New Password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="bg-gray-800/30 border-gray-700 focus:border-green-500"
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                  className="bg-gray-800/30 border-gray-700 focus:border-green-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="glass-green" 
                  onClick={handleChangePassword} 
                  isLoading={isLoading}
                  className="flex-1"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
                <Button 
                  variant="glass-grey" 
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1"
                >
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-800/20 rounded-lg px-4 py-3 border border-gray-700/30">
              <KeyIcon className="w-4 h-4 text-gray-600" />
              <span>Password last changed: <span className="text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};