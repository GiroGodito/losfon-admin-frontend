// src/components/lost-items/CreateLostItemForm.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ImageUpload } from '../common/ImageUpload';
import { Select } from '../common/Select';
import { useToast } from '../../hooks/useToast';
import { uploadApi } from '../../api/upload';
import { userApi } from '../../api/lost-items';
import type { UserDropdownDto } from '../../api/lost-items';
import { InformationCircleIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// ==============================================
// DEBOUNCE HOOK
// ==============================================
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ==============================================
// PROPS INTERFACE
// ==============================================
interface CreateLostItemFormProps {
  onSubmit: (data: {
    itemDescription: string;
    reportedBy?: string;
    contactNumber?: string;
    filePath?: string | null;
    userId?: number | null;
  }) => Promise<void>;
  isLoading?: boolean;
}

// ==============================================
// MAIN COMPONENT
// ==============================================
export const CreateLostItemForm: React.FC<CreateLostItemFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  // ============ FORM STATE ============
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<UserDropdownDto | null>(null);

  // ============ USER DROPDOWN STATE ============
  const [users, setUsers] = useState<UserDropdownDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  // ============ REFS ============
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastUserRef = useRef<HTMLDivElement | null>(null);
  const currentPageRef = useRef(1);
  const isLoadingRef = useRef(false);

  const { showToast } = useToast();
  const debouncedSearch = useDebounce(searchInput, 300);

  // ==============================================
  // FETCH USERS FROM BACKEND
  // ==============================================
  const fetchUsers = useCallback(async (page: number, search: string = '', append: boolean = false) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setIsLoadingUsers(true);
    
    try {
      const response = await userApi.getUsersForDropdown(page, 20, search || undefined);
      
      const newUsers = response.items || [];
      setTotalCount(response.totalCount);
      
      if (append) {
        setUsers(prev => [...prev, ...newUsers]);
      } else {
        setUsers(newUsers);
      }
      
      setHasMoreUsers(newUsers.length === 20 && (page * 20) < response.totalCount);
      currentPageRef.current = page;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showToast('Failed to load users list', 'error');
    } finally {
      isLoadingRef.current = false;
      setIsLoadingUsers(false);
    }
  }, [showToast]);

  // ==============================================
  // LOAD INITIAL USERS
  // ==============================================
  useEffect(() => {
    fetchUsers(1, '', false);
  }, []);

  // ==============================================
  // DEBOUNCED SEARCH
  // ==============================================
  useEffect(() => {
    if (debouncedSearch.length >= 2 || debouncedSearch.length === 0) {
      fetchUsers(1, debouncedSearch, false);
    }
  }, [debouncedSearch]);

  // ==============================================
  // INFINITE SCROLL - Observer
  // ==============================================
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreUsers && !isLoadingRef.current) {
        fetchUsers(currentPageRef.current + 1, debouncedSearch, true);
      }
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (lastUserRef.current) {
      observerRef.current.observe(lastUserRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMoreUsers, debouncedSearch]);

  // ==============================================
  // IMAGE UPLOAD
  // ==============================================
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await uploadApi.uploadImage(file);
      if (response.success) {
        setImageUrl(response.imageUrl);
        showToast('Image uploaded successfully', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // ==============================================
  // USER SELECTION - AUTO-FILL NAME & CONTACT
  // ==============================================
  const handleUserSelect = (value: string | number) => {
    const id = typeof value === 'string' ? parseInt(value) : value;
    const userId = id || null;

    setSelectedUserId(userId);
    setSelectedUserInfo(null);
    setIsAutoFilled(false);
    setContactNumber('');

    if (userId) {
      // Find user in the loaded list
      const foundUser = users.find(u => u.id === userId);
      if (foundUser) {
        setSelectedUserInfo(foundUser);
        setContactNumber(foundUser.contactNumber);
        setIsAutoFilled(true);
        showToast('User info auto-filled', 'success');
      }
    }
  };

  // ==============================================
  // SUBMIT
  // ==============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      showToast('Please describe the item', 'error');
      return;
    }
    
    if (!selectedUserId) {
      showToast('Please select a user', 'error');
      return;
    }
    
    if (!contactNumber.trim()) {
      showToast('Contact number is required', 'error');
      return;
    }

    // Find the selected user to get their full name
    const selectedUser = users.find(u => u.id === selectedUserId);
    
    await onSubmit({
      itemDescription: description.trim(),
      reportedBy: selectedUser?.fullName || 'Unknown User',
      contactNumber: contactNumber.trim(),
      filePath: imageUrl,
      userId: selectedUserId,
    });

    // Reset form
    setDescription('');
    setContactNumber('');
    setSelectedUserId(null);
    setSelectedUserInfo(null);
    setIsAutoFilled(false);
    setImageUrl(null);
    setImageFile(null);
    setSearchInput('');
  };

  // ==============================================
  // BUILD USER OPTIONS
  // ==============================================
  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.fullName} (${user.email})${user.contactNumber ? ` • ${user.contactNumber}` : ''}`,
  }));

  // ==============================================
  // RENDER
  // ==============================================
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ===== ITEM DESCRIPTION - MANUAL ===== */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5 text-left">
          Item Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
          rows={3}
          placeholder="Describe the lost item... (e.g., color, brand, size, distinguishing features)"
          required
        />
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 text-left">
          <InformationCircleIcon className="w-3 h-3" />
          Be as detailed as possible to help identify the item
        </p>
      </div>

      {/* ===== REPORTED BY - DROPDOWN OF USERS ===== */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <label className="block text-sm font-medium text-gray-300 text-left">
            Reported By <span className="text-red-400">*</span>
          </label>
          {isAutoFilled && selectedUserInfo && (
            <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
              <CheckCircleIcon className="w-3 h-3" />
              Auto-filled
            </span>
          )}
        </div>
        
        <Select
          label=""
          value={selectedUserId ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            handleUserSelect(value ? Number(value) : '');
          }}
          placeholder={isLoadingUsers && users.length === 0 ? "Loading users..." : "Select a registered user..."}
          options={userOptions}
          disabled={isLoadingUsers}
          className="bg-gray-800/30 border-gray-700 focus:border-green-500 text-left"
          helperText={
            users.length > 0 
              ? hasMoreUsers 
                ? `Showing ${users.length} of ${totalCount} users - scroll to load more` 
                : `Showing ${users.length} of ${totalCount} users`
              : undefined
          }
        />
        
        {isAutoFilled && selectedUserInfo && (
          <div className="mt-2 p-2.5 bg-green-500/5 border border-green-500/20 rounded-lg flex items-center gap-2 text-left">
            <UserIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-xs text-gray-400">
              Auto-filled from: <span className="text-white font-medium">{selectedUserInfo.fullName}</span>
              <span className="text-gray-500 mx-1">•</span>
              <span className="text-gray-500">{selectedUserInfo.email}</span>
            </span>
          </div>
        )}
      </div>

      {/* ===== CONTACT NUMBER - AUTO-FILLED ===== */}
      <div>
        <Input
          label="Contact Number"
          placeholder="Auto-filled from selected user"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          required
          className={`text-left ${isAutoFilled ? 'border-green-500/50 bg-green-500/5' : ''}`}
          disabled={true}
          rightIcon={isAutoFilled ? <CheckCircleIcon className="w-4 h-4 text-green-400" /> : undefined}
        />
      </div>

      {/* ===== IMAGE UPLOAD - MANUAL ===== */}
      <div>
        <ImageUpload
          onFileSelect={handleImageUpload}
          isUploading={isUploading}
          previewUrl={imageUrl}
          label="Upload Image"
        />
      </div>

      {/* ===== SUBMIT BUTTON ===== */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading || isUploading}
        disabled={!description.trim() || !selectedUserId || !contactNumber.trim()}
        className="py-2.5 text-sm font-semibold"
      >
        {isUploading ? 'Uploading Image...' : 'Report Lost Item'}
      </Button>
    </form>
  );
};