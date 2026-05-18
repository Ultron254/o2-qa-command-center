import React from 'react';
import type { PriorityLevel } from '../../lib/types';

/* Azure DevOps work-item priority bars */
const priorityConfig: Record<PriorityLevel, { label: string; color: string; icon: string }> = {
  critical: { label: '1', color: '#e81123', icon: '🔴' },
  high: { label: '2', color: '#ff8c00', icon: '🟠' },
  medium: { label: '3', color: '#f2c811', icon: '🟡' },
  low: { label: '4', color: '#8a8886', icon: '⚪' },
};

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const cfg = priorityConfig[priority];
  return (
    <span className="inline-flex items-center gap-1 text-xs" style={{ color: cfg.color }}>
      <span
        className="inline-block w-1 rounded-full"
        style={{ height: '14px', backgroundColor: cfg.color }}
      />
      <span className="font-semibold uppercase text-[11px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
        {priority}
      </span>
    </span>
  );
};
