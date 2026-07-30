// src/components/found-items/CreateFoundItemForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ImageUpload } from '../common/ImageUpload';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext'; // ✅ ADD THIS
import { uploadApi } from '../../api/upload';
import { officersApi } from '../../api/sso-officers';
import type { SSOfficer } from '../../types/sso-officer.types';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface CreateFoundItemFormProps {
  onSubmit: (data: {
    itemDescription: string;
    foundBy?: string;
    turnInBy: string;
    filePath?: string | null;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const CreateFoundItemForm: React.FC<CreateFoundItemFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  // ✅ GET LOGGED-IN USER
  const { user } = useAuth();

  const [description, setDescription] = useState('');
  // ✅ USE USER'S FULL NAME, FALLBACK TO "System Administrator"
  const [turnInBy, setTurnInBy] = useState(user?.fullName || 'System');
  const [foundBy, setFoundBy] = useState('');
  const [officers, setOfficers] = useState<SSOfficer[]>([]);
  const [isLoadingOfficers, setIsLoadingOfficers] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  // Fetch SSO Officers for dropdown
  useEffect(() => {
    const fetchOfficers = async () => {
      setIsLoadingOfficers(true);
      try {
        const response = await officersApi.getAll();
        setOfficers(response || []);
      } catch (error) {
        console.error('Failed to fetch officers:', error);
        showToast('Failed to load officers list', 'error');
      } finally {
        setIsLoadingOfficers(false);
      }
    };
    fetchOfficers();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      showToast('Please describe the item', 'error');
      return;
    }

    if (!turnInBy.trim()) {
      showToast('Please enter who turned in the item', 'error');
      return;
    }

    if (!foundBy) {
      showToast('Please select an SSO officer', 'error');
      return;
    }

    if (!imageUrl) {
      showToast('Please upload an image of the found item', 'error');
      return;
    }

    await onSubmit({
      itemDescription: description,
      foundBy: foundBy,
      turnInBy: turnInBy.trim(),
      filePath: imageUrl,
    });

    setDescription('');
    // ✅ RESET TO USER'S NAME (or fallback)
    setTurnInBy(user?.fullName || 'System');
    setFoundBy('');
    setImageUrl(null);
    setImageFile(null);
  };

  // Officer options for dropdown
  const officerOptions = officers.map(officer => ({
    value: `${officer.firstName} ${officer.lastName}`,
    label: `${officer.firstName} ${officer.lastName}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Info Banner
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-green-400 text-left">
          This item will be added to the <strong>Found Items</strong> list.
          It will remain active for 180 days before being moved to Disposal.
        </p>
      </div> */}

      {/* Item Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5 text-left">
          Item Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
          rows={3}
          placeholder="Describe the found item... (e.g., color, brand, size, distinguishing features)"
          required
        />
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 text-left">
          <InformationCircleIcon className="w-3 h-3" />
          Be as detailed as possible to help identify the item
        </p>
      </div>

      {/* Turned In By - AUTO-FILLED FROM LOGGED-IN USER */}
      <Input
        label="Turned In By"
        placeholder="Name of the person who turned in the item"
        value={turnInBy}
        onChange={(e) => setTurnInBy(e.target.value)}
        disabled={true}
        className="cursor-not-allowed opacity-75 text-left"
      />

      {/* Found By - Dropdown for SSO Officer */}
      <Select
        label="Found By (SSO Officer)"
        value={foundBy}
        onChange={(e) => setFoundBy(e.target.value)}
        options={officerOptions}
        placeholder={isLoadingOfficers ? "Loading officers..." : "Select SSO Officer..."}
        disabled={isLoadingOfficers}
        required
        className="text-left"
      />

      {/* Image Upload - Required */}
      <ImageUpload
        onFileSelect={handleImageUpload}
        isUploading={isUploading}
        previewUrl={imageUrl}
        label="Upload Found Item Image"
        required={true}
      />

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          variant="glass-green"
          isLoading={isLoading || isUploading}
          disabled={!description.trim() || !turnInBy.trim() || !foundBy || !imageUrl}
          className="flex-1 py-2.5"
        >
          Confirm Found
        </Button>
      </div>
    </form>
  );
};