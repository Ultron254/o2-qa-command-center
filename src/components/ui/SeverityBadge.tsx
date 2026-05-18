import React from 'react';
import type { SeverityLevel } from '../../lib/types';

const severityConfig: Record<SeverityLevel, { label: string; color: string }> = {
  critical: { label: '1 - Critical', color: '#e81123' },
  high: { label: '2 - High', color: '#ff8c00' },
  medium: { label: '3 - Medium', color: '#f2c811' },
  low: { label: '4 - Low', color: '#8a8886' },
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const cfg = severityConfig[severity];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className="inline-block w-1 rounded-full"
        style={{ height: '14px', backgroundColor: cfg.color }}
      />
      <span style={{ color: 'rgba(255,255,255,0.8)' }}>{cfg.label}</span>
    </span>
  );
};
