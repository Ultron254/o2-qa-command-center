import React from 'react';
import type { TestStatus } from '../../lib/types';

const statusConfig: Record<TestStatus, { label: string; dotClass: string; badgeClass: string }> = {
  pass: {
    label: 'Passed',
    dotClass: 'bg-status-pass',
    badgeClass: 'text-status-pass bg-status-pass/12 border-status-pass/12',
  },
  fail: {
    label: 'Failed',
    dotClass: 'bg-status-fail',
    badgeClass: 'text-status-fail bg-status-fail/12 border-status-fail/12',
  },
  blocked: {
    label: 'Blocked',
    dotClass: 'bg-status-blocked',
    badgeClass: 'text-status-blocked bg-status-blocked/12 border-status-blocked/12',
  },
  skip: {
    label: 'Skipped',
    dotClass: 'bg-status-skip',
    badgeClass: 'text-status-skip bg-status-skip/12 border-status-skip/12',
  },
  not_run: {
    label: 'Not Run',
    dotClass: 'bg-content-muted',
    badgeClass: 'text-content-muted bg-surface-elevated border-line-subtle',
  },
  running: {
    label: 'Running',
    dotClass: 'bg-accent',
    badgeClass: 'text-accent bg-accent/12 border-accent/12',
  },
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
      className={`inline-flex items-center gap-1.5 rounded-sm font-normal border ${cfg.badgeClass} ${isSmall ? 'px-1.5 py-px text-[11px]' : 'px-2 py-0.5 text-xs'}`}
    >
      <span
        className={`inline-block rounded-full ${cfg.dotClass} ${status === 'running' ? 'pulse-dot' : ''} ${isSmall ? 'w-[5px] h-[5px]' : 'w-1.5 h-1.5'}`}
      />
      {cfg.label}
    </span>
  );
};
