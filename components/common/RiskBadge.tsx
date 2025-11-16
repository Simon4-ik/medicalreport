
import React from 'react';
import type { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
}

const levelStyles: Record<RiskLevel, string> = {
  High: 'bg-red-100 text-red-800 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-blue-100 text-blue-800 border-blue-200',
  Normal: 'bg-green-100 text-green-800 border-green-200',
  Info: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${levelStyles[level] || levelStyles['Info']}`}>
      {level}
    </span>
  );
};
