// src/components/found-items/MarkAsClaimedForm.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext'; // ✅ ADD THIS
import { userApi } from '../../api/lost-items';
import type { UserDropdownDto } from '../../api/lost-items';
import { CheckCircleIcon, UserIcon, ShieldCheckIcon, PhoneIcon } from '@heroicons/react/24/outline';

// ============================================================================
// HOOKS
// ============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ============================================================================
// TYPES
// ============================================================================

interface MarkAsClaimedFormProps {
  onSubmit: (data: {
    claimedBy: string;
    releasedBy: string;
    claimedContactInformation: string;
    userId?: number | null;
  }) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const MarkAsClaimedForm: React.FC<MarkAsClaimedFormProps> = ({
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  // ✅ GET LOGGED-IN USER
  const { user } = useAuth();

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [claimedBy, setClaimedBy] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<UserDropdownDto | null>(null);

  // ✅ USE USER'S FULL NAME, FALLBACK TO "System Administrator"
  const releasedBy = user?.fullName || 'System';

  const [users, setUsers] = useState<UserDropdownDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastUserRef = useRef<HTMLDivElement | null>(null);
  const currentPageRef = useRef(1);
  const isLoadingRef = useRef(false);

  const { showToast } = useToast();
  const debouncedSearch = useDebounce(searchInput, 300);

  // --------------------------------------------------------------------------
  // Data Fetching
  // --------------------------------------------------------------------------

  const fetchUsers = useCallback(
    async (page: number, search: string = '', append: boolean = false) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoadingUsers(true);

      try {
        const response = await userApi.getUsersForDropdown(page, 20, search || undefined);

        const newUsers = response.items || [];
        setTotalCount(response.totalCount);

        setUsers((prev) => (append ? [...prev, ...newUsers] : newUsers));

        const hasMore = newUsers.length === 20 && page * 20 < response.totalCount;
        setHasMoreUsers(hasMore);
        currentPageRef.current = page;
      } catch (error) {
        console.error('Failed to fetch users:', error);
        showToast('Failed to load users list', 'error');
      } finally {
        isLoadingRef.current = false;
        setIsLoadingUsers(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchUsers(1, '', false);
  }, [fetchUsers]);

  useEffect(() => {
    if (debouncedSearch.length >= 2 || debouncedSearch.length === 0) {
      fetchUsers(1, debouncedSearch, false);
    }
  }, [debouncedSearch, fetchUsers]);

  useEffect(() => {
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreUsers && !isLoadingRef.current) {
          fetchUsers(currentPageRef.current + 1, debouncedSearch, true);
        }
      },
      { root: null, rootMargin: '100px', threshold: 0.1 }
    );

    if (lastUserRef.current) {
      observerRef.current.observe(lastUserRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMoreUsers, debouncedSearch, fetchUsers]);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  const handleUserSelect = (value: string | number) => {
    const id = typeof value === 'string' ? parseInt(value) : value;
    const userId = id || null;

    setSelectedUserId(userId);
    setSelectedUserInfo(null);
    setIsAutoFilled(false);
    setClaimedBy('');
    setContactInfo('');

    if (userId) {
      const foundUser = users.find((u) => u.id === userId);
      if (foundUser) {
        setSelectedUserInfo(foundUser);
        setClaimedBy(foundUser.fullName);
        setContactInfo(foundUser.contactNumber);
        setIsAutoFilled(true);
        showToast('User info auto-filled', 'success');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate that a user is selected
    if (!selectedUserId) {
      showToast('Please select a registered user', 'error');
      return;
    }

    // ✅ Make sure userId is a number (not null)
    const userId = Number(selectedUserId);
    
    console.log('🔍 SUBMITTING WITH USER ID:', userId);
    console.log('🔍 FULL PAYLOAD:', {
      claimedBy: claimedBy.trim(),
      releasedBy,
      claimedContactInformation: contactInfo.trim(),
      userId: userId,
    });

    await onSubmit({
      claimedBy: claimedBy.trim(),
      releasedBy,
      claimedContactInformation: contactInfo.trim(),
      userId: userId,
    });

    // Reset form
    setSelectedUserId(null);
    setClaimedBy('');
    setContactInfo('');
    setIsAutoFilled(false);
    setSelectedUserInfo(null);
    setSearchInput('');
  };

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.fullName} (${user.email})${user.contactNumber ? ` • ${user.contactNumber}` : ''}`,
  }));

  const getHelperText = () => {
    if (users.length === 0) return undefined;
    return hasMoreUsers
      ? `Showing ${users.length} of ${totalCount} users - scroll to load more`
      : `Showing ${users.length} of ${totalCount} users`;
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ===== INFO BANNER ===== */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
        <p className="text-sm text-purple-400 text-left">
          Marking this item as claimed will move it to the <strong>Claimed Items</strong> list.
          The item will no longer appear in found items.
        </p>
      </div>

      {/* ===== USER SELECT ===== */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-300 text-left">
          Claimed By <span className="text-red-400">*</span>
        </label>

        <Select
          value={selectedUserId ?? ''}
          onChange={(e) => handleUserSelect(e.target.value)}
          placeholder={
            isLoadingUsers && users.length === 0 ? 'Loading users...' : 'Select a registered user...'
          }
          options={userOptions}
          disabled={isLoadingUsers}
          helperText={getHelperText()}
          className="bg-gray-800/30 border-gray-700 focus:border-purple-500 text-left"
        />

        {isAutoFilled && selectedUserInfo && (
          <div className="mt-2 p-3 bg-green-500/5 border border-green-500/20 rounded-lg flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xs text-gray-400">
              <span className="text-white font-medium">{selectedUserInfo.fullName}</span>
              <span className="text-gray-500 mx-1.5">•</span>
              <span>{selectedUserInfo.email}</span>
              {selectedUserInfo.contactNumber && (
                <>
                  <span className="text-gray-500 mx-1.5">•</span>
                  <span>{selectedUserInfo.contactNumber}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== RELEASED BY (Auto-filled from logged-in user) ===== */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-300 text-left">Released By</label>
        <Input
          value={releasedBy}
          disabled
          className="cursor-not-allowed opacity-75 border-gray-700 bg-gray-800/30 text-left"
          rightIcon={<ShieldCheckIcon className="w-4 h-4 text-green-400" />}
        />
      </div>

      {/* ===== CONTACT INFORMATION ===== */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-300 text-left">
          Contact Information <span className="text-red-400">*</span>
        </label>
        <Input
          value={contactInfo}
          disabled
          placeholder="Auto-filled from user profile"
          className="cursor-not-allowed opacity-75 border-gray-700 bg-gray-800/30 text-left"
          rightIcon={<PhoneIcon className="w-4 h-4 text-gray-500" />}
        />
      </div>

      {/* ===== ACTIONS ===== */}
      <div className="flex gap-3 pt-2 border-t border-gray-800/60">
        <Button
          type="submit"
          variant="glass-blue"
          isLoading={isLoading || isLoadingUsers}
          disabled={!selectedUserId}
          className="flex-1 py-2.5"
        >
          Confirm Claim
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="glass-grey"
            onClick={onCancel}
            className="flex-1 py-2.5"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default MarkAsClaimedForm;