import React from 'react';

interface CoverageCellProps {
  count: number;
}

export const CoverageCell: React.FC<CoverageCellProps> = ({ count }) => {
  const bg = count >= 3
    ? 'rgba(51,153,51,0.2)'
    : count >= 1
    ? 'rgba(242,200,17,0.15)'
    : 'rgba(232,17,35,0.1)';
  const color = count >= 3 ? '#339933' : count >= 1 ? '#f2c811' : 'rgba(255,255,255,0.25)';

  return (
    <td className="px-3 py-2 text-center">
      <span
        className="inline-block w-full py-1 text-xs font-mono font-semibold"
        style={{ backgroundColor: bg, color }}
      >
        {count}
      </span>
    </td>
  );
};
