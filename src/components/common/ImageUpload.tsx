// src/components/common/ImageUpload.tsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Spinner } from './Spinner';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  previewUrl?: string | null;
  onRemove?: () => void;
  label?: string;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  isUploading = false,
  previewUrl,
  onRemove,
  label = 'Upload Image',
  required = false,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required ? (
          <span className="text-red-400 text-xs ml-1">*</span>
        ) : (
          <span className="text-gray-500 text-xs ml-1">(Optional)</span>
        )}
      </label>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-green-500 bg-green-500/10' : 'border-gray-700 hover:border-green-500/50 hover:bg-gray-800/30'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        {isUploading ? (
          <div className="flex flex-col items-center py-4">
            <Spinner size="md" />
            <p className="mt-2 text-sm text-gray-400">Uploading...</p>
          </div>
        ) : previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 object-contain rounded-lg mx-auto"
            />
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
            <p className="mt-2 text-sm text-gray-500">Click to change image</p>
          </div>
        ) : (
          <div className="py-6">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-600" />
            <p className="mt-2 text-sm text-gray-400">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max 5MB • JPG, PNG, GIF, WEBP
            </p>
            {required && (
              <p className="text-xs text-gray-400 mt-2">* Required</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};