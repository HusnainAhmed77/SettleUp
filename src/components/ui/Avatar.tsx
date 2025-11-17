import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  children?: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    src, 
    alt = 'Avatar', 
    initials, 
    size = 'md', 
    online,
    className,
    children,
    ...props 
  }, ref) => {
    const sizes = {
      xs: "w-6 h-6 text-xs",
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base",
      lg: "w-12 h-12 text-lg",
      xl: "w-16 h-16 text-xl",
    };

    const onlineSizes = {
      xs: "w-1.5 h-1.5",
      sm: "w-2 h-2",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
      xl: "w-4 h-4",
    };

    const getInitials = (name?: string) => {
      if (!name) return '';
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    const displayInitials = initials || getInitials(alt);

    // Generate a consistent color based on the initials
    const getColorFromInitials = (text: string) => {
      const colors = [
        'bg-gradient-to-br from-[#FF007F] to-[#E6006F]',
        'bg-gradient-to-br from-[#00CFFF] to-[#00B8E6]',
        'bg-gradient-to-br from-[#FF007F] to-[#00CFFF]',
        'bg-gradient-to-br from-purple-400 to-purple-600',
        'bg-gradient-to-br from-pink-400 to-pink-600',
        'bg-gradient-to-br from-blue-400 to-blue-600',
      ];
      const index = text.charCodeAt(0) % colors.length;
      return colors[index];
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0",
          sizes[size],
          !src && getColorFromInitials(displayInitials),
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : displayInitials ? (
          <span className="font-semibold text-white">
            {displayInitials}
          </span>
        ) : (
          <User className="w-1/2 h-1/2 text-white" />
        )}
        
        {children}
        
        {online !== undefined && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-2 border-white ring-2 ring-[#FF007F]",
              onlineSizes[size],
              online ? "bg-green-500" : "bg-gray-400"
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 5, size = 'md', className, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const displayChildren = max ? childrenArray.slice(0, max) : childrenArray;
    const remainingCount = childrenArray.length - displayChildren.length;

    return (
      <div
        ref={ref}
        className={cn("flex items-center -space-x-2", className)}
        {...props}
      >
        {displayChildren.map((child, index) => (
          <div
            key={index}
            className="ring-2 ring-white rounded-full"
            style={{ zIndex: displayChildren.length - index }}
          >
            {React.isValidElement(child) 
              ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
              : child
            }
          </div>
        ))}
        
        {remainingCount > 0 && (
          <Avatar
            size={size}
            initials={`+${remainingCount}`}
            className="ring-2 ring-white bg-gray-300 text-gray-700"
          />
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export default Avatar;
