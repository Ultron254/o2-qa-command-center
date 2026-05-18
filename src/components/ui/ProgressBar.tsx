import React from 'react';

interface ProgressBarProps {
  pass: number;
  fail: number;
  blocked: number;
  skip: number;
  notRun: number;
  height?: string;
  showLabels?: boolean;
}

/* Azure DevOps stacked bar (flat, no border-radius) */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  pass, fail, blocked, skip, notRun, height = 'h-1.5', showLabels = false,
}) => {
  const total = pass + fail + blocked + skip + notRun;
  if (total === 0) return <div className={`${height} w-full`} style={{ backgroundColor: '#2d2d2d' }} />;

  const pct = (v: number) => ((v / total) * 100).toFixed(1);

  return (
    <div className="w-full">
      <div className={`${height} overflow-hidden flex`} style={{ backgroundColor: '#2d2d2d' }}>
        {pass > 0 && <div className="transition-all duration-300" style={{ width: `${pct(pass)}%`, backgroundColor: '#339933' }} />}
        {fail > 0 && <div className="transition-all duration-300" style={{ width: `${pct(fail)}%`, backgroundColor: '#e81123' }} />}
        {blocked > 0 && <div className="transition-all duration-300" style={{ width: `${pct(blocked)}%`, backgroundColor: '#f2c811' }} />}
        {skip > 0 && <div className="transition-all duration-300" style={{ width: `${pct(skip)}%`, backgroundColor: '#8a8886' }} />}
        {notRun > 0 && <div className="transition-all duration-300" style={{ width: `${pct(notRun)}%`, backgroundColor: 'rgba(255,255,255,0.08)' }} />}
      </div>
      {showLabels && (
        <div className="flex gap-4 mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: '#339933' }} />{pass} passed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: '#e81123' }} />{fail} failed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: '#f2c811' }} />{blocked} blocked</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: '#8a8886' }} />{skip} skipped</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />{notRun} not run</span>
        </div>
      )}
    </div>
  );
};
