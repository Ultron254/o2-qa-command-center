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

export const ProgressBar: React.FC<ProgressBarProps> = ({
  pass, fail, blocked, skip, notRun, height = 'h-1.5', showLabels = false,
}) => {
  const total = pass + fail + blocked + skip + notRun;
  if (total === 0) return <div className={`${height} w-full bg-surface-elevated`} />;

  const pct = (v: number) => ((v / total) * 100).toFixed(1);

  return (
    <div className="w-full">
      <div className={`${height} overflow-hidden flex bg-surface-elevated`}>
        {pass > 0 && <div className="transition-all duration-300 bg-status-pass" style={{ width: `${pct(pass)}%` }} />}
        {fail > 0 && <div className="transition-all duration-300 bg-status-fail" style={{ width: `${pct(fail)}%` }} />}
        {blocked > 0 && <div className="transition-all duration-300 bg-status-blocked" style={{ width: `${pct(blocked)}%` }} />}
        {skip > 0 && <div className="transition-all duration-300 bg-status-skip" style={{ width: `${pct(skip)}%` }} />}
        {notRun > 0 && <div className="transition-all duration-300 bg-line" style={{ width: `${pct(notRun)}%` }} />}
      </div>
      {showLabels && (
        <div className="flex gap-4 mt-2 text-xs text-content-secondary">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-status-pass" />{pass} passed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-status-fail" />{fail} failed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-status-blocked" />{blocked} blocked</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-status-skip" />{skip} skipped</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-line" />{notRun} not run</span>
        </div>
      )}
    </div>
  );
};
