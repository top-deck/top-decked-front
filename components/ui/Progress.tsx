import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
      <div
        className="bg-purple-700 h-3 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default Progress;