import React from 'react';

interface CoverageCellProps {
  count: number;
}

export const CoverageCell: React.FC<CoverageCellProps> = ({ count }) => {
  const bgClass = count >= 3
    ? 'bg-status-pass/20'
    : count >= 1
    ? 'bg-status-blocked/15'
    : 'bg-status-fail/10';

  const textClass = count >= 3
    ? 'text-status-pass'
    : count >= 1
    ? 'text-status-blocked'
    : 'text-content-muted';

  return (
    <td className="px-3 py-2 text-center">
      <span
        className={`inline-block w-full py-1 text-xs font-mono font-semibold ${bgClass} ${textClass}`}
      >
        {count}
      </span>
    </td>
  );
};
