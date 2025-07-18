import React from 'react';

export function Card({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 border-b pb-2 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`text-lg font-semibold ${className}`}>
      {children}
    </h2>
  );
}

export function CardDescription({ children, className = '' }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
