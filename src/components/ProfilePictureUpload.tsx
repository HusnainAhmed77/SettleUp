'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Camera } from 'lucide-react';
import { uploadAndSetProfilePicture, validateImageFile, removeProfilePicture } from '@/services/profileService';
import { ProfileError } from '@/types/friends';
import ProfilePictureDisplay from './ProfilePictureDisplay';

interface ProfilePictureUploadProps {
  userId: string;
  currentPictureUrl?: string | null;
  userName?: string;
  onUploadSuccess?: (url: string) => void;
  onRemoveSuccess?: () => void;
}

export default function ProfilePictureUpload({
  userId,
  currentPictureUrl,
  userName,
  onUploadSuccess,
  onRemoveSuccess,
}: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      // Validate file
      validateImageFile(file);

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      setUploading(true);
      const url = await uploadAndSetProfilePicture(userId, file);
      
      if (onUploadSuccess) {
        onUploadSuccess(url);
      }

      setPreview(null);
    } catch (err) {
      if (err instanceof ProfileError) {
        setError(err.message);
      } else {
        setError('Failed to upload image. Please try again.');
      }
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    try {
      setRemoving(true);
      setError(null);
      await removeProfilePicture(userId);
      
      if (onRemoveSuccess) {
        onRemoveSuccess();
      }
    } catch (err) {
      setError('Failed to remove profile picture. Please try again.');
    } finally {
      setRemoving(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Current/Preview Picture */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-teal-500"
            />
          ) : (
            <ProfilePictureDisplay
              userId={userId}
              pictureUrl={currentPictureUrl}
              name={userName}
              size="xlarge"
              showBorder={true}
            />
          )}
          
          {(uploading || removing) && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={32} />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          {/* Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading || removing}
            />
            <button
              onClick={handleClick}
              disabled={uploading || removing}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera size={20} />
                  Upload New Picture
                </>
              )}
            </button>
          </div>

          {/* Remove Button */}
          {currentPictureUrl && (
            <button
              onClick={handleRemove}
              disabled={uploading || removing}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {removing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Removing...
                </>
              ) : (
                <>
                  <X size={20} />
                  Remove Picture
                </>
              )}
            </button>
          )}

          <p className="text-sm text-gray-600">
            JPG, PNG, GIF, or WebP. Max 5MB.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Upload Progress */}
      {preview && uploading && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
          Uploading your profile picture...
        </div>
      )}
    </div>
  );
}
