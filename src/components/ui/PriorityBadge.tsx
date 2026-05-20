import React from 'react';
import type { PriorityLevel } from '../../lib/types';

const priorityConfig: Record<PriorityLevel, { label: string; barClass: string }> = {
  critical: { label: 'critical', barClass: 'bg-status-fail' },
  high: { label: 'high', barClass: 'bg-[#ff8c00]' },
  medium: { label: 'medium', barClass: 'bg-status-blocked' },
  low: { label: 'low', barClass: 'bg-status-skip' },
};

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const cfg = priorityConfig[priority];
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span
        className={`inline-block w-1 h-3.5 rounded-full ${cfg.barClass}`}
      />
      <span className="font-semibold uppercase text-[11px] text-content-primary/80">
        {cfg.label}
      </span>
    </span>
  );
};
