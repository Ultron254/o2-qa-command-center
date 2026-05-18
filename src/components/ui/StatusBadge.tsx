import React from 'react';
import type { TestStatus } from '../../lib/types';

/* Azure DevOps status styling */
const statusConfig: Record<TestStatus, { label: string; color: string; bg: string; border: string }> = {
  pass: { label: 'Passed', color: '#339933', bg: 'rgba(51,153,51,0.12)', border: '#339933' },
  fail: { label: 'Failed', color: '#e81123', bg: 'rgba(232,17,35,0.12)', border: '#e81123' },
  blocked: { label: 'Blocked', color: '#f2c811', bg: 'rgba(242,200,17,0.12)', border: '#f2c811' },
  skip: { label: 'Skipped', color: '#8a8886', bg: 'rgba(138,136,134,0.12)', border: '#8a8886' },
  not_run: { label: 'Not Run', color: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)' },
  running: { label: 'Running', color: '#0078d4', bg: 'rgba(0,120,212,0.12)', border: '#0078d4' },
};

interface StatusBadgeProps {
  status: TestStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const cfg = statusConfig[status];
  const isSmall = size === 'sm';

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm font-normal"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        padding: isSmall ? '1px 6px' : '2px 8px',
        fontSize: isSmall ? '11px' : '12px',
        border: `1px solid ${cfg.bg}`,
      }}
    >
      <span
        className={`inline-block rounded-full ${status === 'running' ? 'pulse-dot' : ''}`}
        style={{ width: isSmall ? '5px' : '6px', height: isSmall ? '5px' : '6px', backgroundColor: cfg.color }}
      />
      {cfg.label}
    </span>
  );
};
