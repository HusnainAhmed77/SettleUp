import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    success, 
    helperText, 
    icon,
    className, 
    type = 'text',
    ...props 
  }, ref) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none",
              "focus:ring-4",
              icon && "pl-10",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-100",
              hasSuccess && "border-green-500 focus:border-green-500 focus:ring-green-100",
              !hasError && !hasSuccess && "border-gray-300 focus:border-[#FF007F] focus:ring-[#FF007F]/20",
              "disabled:bg-gray-100 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          
          {(hasError || hasSuccess) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {hasError && <AlertCircle className="w-5 h-5 text-red-500" />}
              {hasSuccess && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </motion.div>
          )}
        </div>
        
        {(error || success || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-2 text-sm",
              hasError && "text-red-500",
              hasSuccess && "text-green-500",
              !hasError && !hasSuccess && "text-gray-500"
            )}
          >
            {error || success || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface CurrencyInputProps extends Omit<InputProps, 'type'> {
  currency?: string;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ currency = 'USD', className, ...props }, ref) => {
    return (
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">
          $
        </span>
        <Input
          ref={ref}
          type="number"
          step="0.01"
          min="0"
          className={cn("pl-8 font-mono text-lg", className)}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export default Input;
