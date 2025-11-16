
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`}>
      {title && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3 text-primary">{icon}</div>}
          <h3 className="text-lg font-semibold text-secondary">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
