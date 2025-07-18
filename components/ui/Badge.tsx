import React from 'react';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'destructive' | 'secondary' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold';
  const variantStyles = {
    default: 'bg-indigo-600 text-white',
    destructive: 'bg-red-600 text-white',
    secondary: 'bg-gray-200 text-gray-800',
    outline: 'border border-gray-300 text-gray-700',
  };

  return (
    <span
      className={twMerge(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
