// src/components/cold-case-items/MarkAsFoundFromColdCaseForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ImageUpload } from '../common/ImageUpload';
import { useToast } from '../../hooks/useToast';
import { uploadApi } from '../../api/upload';
import { officersApi } from '../../api/sso-officers';
import type { SSOfficer } from '../../types/sso-officer.types';

interface MarkAsFoundFromColdCaseFormProps {
  onSubmit: (data: {
    turnInBy?: string;
    foundBy?: string;
    filePath?: string;
  }) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const MarkAsFoundFromColdCaseForm: React.FC<MarkAsFoundFromColdCaseFormProps> = ({
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [turnInBy, setTurnInBy] = useState('System Administrator');
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
      turnInBy: turnInBy.trim(),
      foundBy: foundBy,
      filePath: imageUrl,
    });

    setTurnInBy('System Administrator');
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
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-400">
          This item has been in cold case for a long time. Marking it as found will move it to the Found Items list.
        </p>
      </div>

      <Input
        label="Turned In By"
        placeholder="Name of the person who turned in the item"
        value={turnInBy}
        onChange={(e) => setTurnInBy(e.target.value)}
        disabled={true}
        className="cursor-not-allowed opacity-75"
      />

      <Select
        label="Found By (SSO Officer)"
        value={foundBy}
        onChange={(e) => setFoundBy(e.target.value)}
        options={officerOptions}
        placeholder={isLoadingOfficers ? "Loading officers..." : "Select SSO Officer..."}
        disabled={isLoadingOfficers}
        required
      />

      <ImageUpload
        onFileSelect={handleImageUpload}
        isUploading={isUploading}
        previewUrl={imageUrl}
        label="Upload Found Item Image"
        required={true}
      />

      <div className="flex gap-2">
        <Button
          type="submit"
          variant="glass-green"
          isLoading={isLoading || isUploading}
          disabled={!turnInBy.trim() || !foundBy || !imageUrl}
          className="flex-1"
        >
          Confirm Found
        </Button>
        {onCancel && (
          <Button type="button" variant="glass-grey" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};