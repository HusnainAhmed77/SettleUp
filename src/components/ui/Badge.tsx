import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'default', 
    size = 'md', 
    rounded = false,
    className, 
    children, 
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors";
    
    const variants = {
      default: "bg-gray-100 text-gray-700 border border-gray-300",
      primary: "bg-[#FF007F] text-white border border-[#FF007F]",
      secondary: "bg-[#00CFFF] text-white border border-[#00CFFF]",
      success: "bg-green-100 text-green-700 border border-green-300",
      error: "bg-red-100 text-red-700 border border-red-300",
      warning: "bg-yellow-100 text-yellow-700 border border-yellow-300",
      info: "bg-[#00CFFF]/10 text-[#00CFFF] border border-[#00CFFF]",
    };
    
    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
      lg: "px-4 py-1.5 text-base",
    };

    const roundedClass = rounded ? "rounded-full" : "rounded-md";

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          roundedClass,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
