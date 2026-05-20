import React from 'react';
import type { SeverityLevel } from '../../lib/types';

const severityConfig: Record<SeverityLevel, { label: string; barClass: string }> = {
  critical: { label: '1 - Critical', barClass: 'bg-status-fail' },
  high: { label: '2 - High', barClass: 'bg-[#ff8c00]' },
  medium: { label: '3 - Medium', barClass: 'bg-status-blocked' },
  low: { label: '4 - Low', barClass: 'bg-status-skip' },
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const cfg = severityConfig[severity];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className={`inline-block w-1 h-3.5 rounded-full ${cfg.barClass}`}
      />
      <span className="text-content-primary/80">{cfg.label}</span>
    </span>
  );
};
