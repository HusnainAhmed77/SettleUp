'use client';

import { Shield, Crown } from 'lucide-react';

interface AdminBadgeProps {
  isAdmin: boolean;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  small: 'text-xs px-2 py-0.5',
  medium: 'text-sm px-3 py-1',
  large: 'text-base px-4 py-1.5',
};

const iconSizes = {
  small: 12,
  medium: 14,
  large: 16,
};

export default function AdminBadge({
  isAdmin,
  size = 'medium',
  showText = true,
  className = '',
}: AdminBadgeProps) {
  if (!isAdmin) return null;

  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  return (
    <span
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold ${sizeClass} ${className}`}
      title="Group Admin"
    >
      <Crown size={iconSize} className="fill-current" />
      {showText && <span>Admin</span>}
    </span>
  );
}
