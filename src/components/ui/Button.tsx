import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled,
    className,
    children,
    ...props 
  }, ref) => {
    const baseStyles = "font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-[#FF007F] hover:bg-[#E6006F] active:bg-[#CC0066] text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#FF007F] focus:ring-offset-2",
      secondary: "bg-[#00CFFF] hover:bg-[#00B8E6] active:bg-[#00A1CC] text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#00CFFF] focus:ring-offset-2",
      outline: "border-2 border-[#FF007F] text-[#FF007F] hover:bg-[#FF007F] hover:text-white bg-white focus:ring-2 focus:ring-[#FF007F] focus:ring-offset-2",
      ghost: "text-gray-700 hover:text-[#FF007F] hover:bg-[#FF007F]/10",
      danger: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const hoverAnimation = !disabled && !loading ? {
      scale: 1.02,
      y: -2,
    } : {};

    const tapAnimation = !disabled && !loading ? {
      scale: 0.98,
    } : {};

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
