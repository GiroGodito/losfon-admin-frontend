// src/components/claimed-items/CreatedClaimedItemForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ImageUpload } from '../common/ImageUpload';
import { Select } from '../common/Select';
import { useToast } from '../../hooks/useToast';
import { uploadApi } from '../../api/upload';
import { claimedItemsApi } from '../../api/claimed-items';

interface UserOption {
  id: number;
  fullName: string;
  email: string;
  contactNumber: string;
}

interface CreateClaimedItemFormProps {
  onSubmit: (data: {
    itemDescription: string;
    userId?: number | null;
    claimedBy?: string;
    releasedBy?: string;
    claimedContactInformation?: string;
    filePath?: string | null;
    sourceFoundItemId?: number | null;
  }) => Promise<void>;
  isLoading?: boolean;
  foundItemId?: number;
  initialDescription?: string;
}

export const CreateClaimedItemForm: React.FC<CreateClaimedItemFormProps> = ({
  onSubmit,
  isLoading = false,
  foundItemId,
  initialDescription = '',
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [userId, setUserId] = useState<number | ''>('');
  const [claimedBy, setClaimedBy] = useState('');
  const [releasedBy, setReleasedBy] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Fetch users for dropdown
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        // This would need a proper endpoint to list users
        setUsers([]);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

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

  const handleUserIdChange = async (value: string | number) => {
    const id = typeof value === 'string' ? parseInt(value) : value;
    setUserId(id || '');
    
    if (id) {
      try {
        const response = await claimedItemsApi.getUserInfo(id);
        if (response.success) {
          setClaimedBy(response.data.fullName);
          setContactInfo(response.data.contactNumber);
          setIsManualEntry(false);
          showToast('User info auto-filled', 'success');
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please describe the item', 'error');
      return;
    }

    if (userId) {
      await onSubmit({
        itemDescription: description,
        userId: Number(userId),
        filePath: imageUrl,
        sourceFoundItemId: foundItemId || null,
      });
    } else {
      if (!claimedBy.trim()) {
        showToast('Please enter who claimed the item', 'error');
        return;
      }
      if (!releasedBy.trim()) {
        showToast('Please enter who released the item', 'error');
        return;
      }
      if (!contactInfo.trim()) {
        showToast('Please enter contact information', 'error');
        return;
      }

      await onSubmit({
        itemDescription: description,
        claimedBy: claimedBy.trim(),
        releasedBy: releasedBy.trim(),
        claimedContactInformation: contactInfo.trim(),
        filePath: imageUrl,
        sourceFoundItemId: foundItemId || null,
      });
    }

    setDescription('');
    setUserId('');
    setClaimedBy('');
    setReleasedBy('');
    setContactInfo('');
    setImageUrl(null);
    setImageFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Item Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          rows={4}
          placeholder="Describe the claimed item..."
          required
        />
      </div>

      <div>
        <div className="flex gap-4 mb-4">
          <Button
            type="button"
            variant={!isManualEntry ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setIsManualEntry(false)}
          >
            Link to Registered User
          </Button>
          <Button
            type="button"
            variant={isManualEntry ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setIsManualEntry(true)}
          >
            Manual Entry
          </Button>
        </div>

        {isManualEntry ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Claimed By"
              placeholder="Name of the person claiming"
              value={claimedBy}
              onChange={(e) => setClaimedBy(e.target.value)}
              required
            />
            <Input
              label="Released By"
              placeholder="Name of the SSO officer"
              value={releasedBy}
              onChange={(e) => setReleasedBy(e.target.value)}
              required
            />
            <Input
              label="Contact Information"
              placeholder="Phone number or email"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
          </div>
        ) : (
          <Select
            label="Select Registered User"
            value={userId}
            onChange={(e) => handleUserIdChange(e.target.value)}
            placeholder="Select a registered user..."
            options={users.map(u => ({
              value: u.id,
              label: `${u.fullName} (${u.email})`
            }))}
          />
        )}
      </div>

      <ImageUpload
        onFileSelect={handleImageUpload}
        isUploading={isUploading}
        previewUrl={imageUrl}
        label="Upload Image"
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading || isUploading}
        disabled={!description.trim()}
        className="py-3"
      >
        {isUploading ? 'Uploading Image...' : 'Add Claimed Item'}
      </Button>
    </form>
  );
};