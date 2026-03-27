import React from 'react';
import { cn } from '../lib/utils';

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-md p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
