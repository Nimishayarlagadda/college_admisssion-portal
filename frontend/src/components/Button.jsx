import React from 'react';
import { cn } from '../lib/utils';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'bg-[#002FA7] text-white hover:bg-[#002080] rounded-sm transition-colors font-sans font-medium',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-sm transition-colors font-sans font-medium',
    ghost: 'text-[#002FA7] hover:bg-blue-50 rounded-sm transition-colors font-sans font-medium'
  };

  return (
    <button
      className={cn(
        'px-4 py-2 text-base',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
