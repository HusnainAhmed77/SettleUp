'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

/**
 * ProfilePictureDisplay Component
 * Reusable component for displaying profile pictures with fallback
 * Implements Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

interface ProfilePictureDisplayProps {
  userId?: string;
  pictureUrl?: string | null;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  showBorder?: boolean;
}

const sizeClasses = {
  small: 'w-8 h-8 text-sm',
  medium: 'w-12 h-12 text-base',
  large: 'w-16 h-16 text-lg',
  xlarge: 'w-24 h-24 text-2xl',
};

const iconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32,
};

export default function ProfilePictureDisplay({
  userId,
  pictureUrl,
  name,
  size = 'medium',
  className = '',
  showBorder = false,
}: ProfilePictureDisplayProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state when pictureUrl changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
  }, [pictureUrl]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  // Get initials from name for fallback
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a consistent color based on userId or name
  const getBackgroundColor = (id?: string, name?: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    
    const seed = id || name || 'default';
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];
  const borderClass = showBorder ? 'ring-2 ring-white ring-offset-2' : '';
  const bgColor = getBackgroundColor(userId, name);

  // Show image if available and no error
  if (pictureUrl && !imageError) {
    return (
      <div className={`relative ${sizeClass} ${borderClass} ${className}`}>
        <img
          src={pictureUrl}
          alt={name || 'Profile picture'}
          className={`${sizeClass} rounded-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {isLoading && (
          <div className={`absolute inset-0 ${sizeClass} rounded-full ${bgColor} flex items-center justify-center text-white font-semibold animate-pulse`}>
            {getInitials(name)}
          </div>
        )}
      </div>
    );
  }

  // Fallback: Show initials or icon
  return (
    <div
      className={`${sizeClass} ${borderClass} ${className} rounded-full ${bgColor} flex items-center justify-center text-white font-semibold`}
      title={name || 'User'}
    >
      {name ? (
        getInitials(name)
      ) : (
        <User size={iconSize} />
      )}
    </div>
  );
}
