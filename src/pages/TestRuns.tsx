import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { ProgressBar } from '../components/ui/ProgressBar';
import { formatDateTime } from '../lib/formatters';
import { Play } from 'lucide-react';
import { TestRunFormModal } from '../components/ui/modals/TestRunFormModal';
import type { RunStatus } from '../lib/types';

const runStatusColors: Record<RunStatus, string> = {
  running: 'bg-status-running/10 text-status-running',
  completed: 'bg-status-pass/10 text-status-pass',
  aborted: 'bg-status-fail/10 text-status-fail',
};

export const TestRuns: React.FC = () => {
  const { testRuns, teamMembers, navigate } = useStore();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Play size={20} className="text-accent" /> Test Runs
        </h2>
        <button className="btn-primary text-sm" onClick={() => setShowForm(true)}>New Test Run</button>
      </div>

      <div className="border border-line overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header text-left w-28">Run ID</th>
              <th className="table-header text-left">Name</th>
              <th className="table-header text-left w-32">Tester</th>
              <th className="table-header text-left w-40">Date</th>
              <th className="table-header text-right w-20">Duration</th>
              <th className="table-header text-center w-40">Progress</th>
              <th className="table-header text-center w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {testRuns.map(run => {
              const tester = teamMembers.find(m => m.id === run.testerId);
              const passed = run.executions.filter(e => e.status === 'pass').length;
              const failed = run.executions.filter(e => e.status === 'fail').length;
              const blocked = run.executions.filter(e => e.status === 'blocked').length;
              const skipped = run.executions.filter(e => e.status === 'skip').length;
              const notRun = run.executions.filter(e => e.status === 'not_run').length;
              return (
                <tr key={run.id} className="table-row" onClick={() => navigate('test-run-execution', run.id)}>
                  <td className="table-cell mono-id">{run.id}</td>
                  <td className="table-cell font-medium">{run.name}</td>
                  <td className="table-cell text-content-secondary text-sm">{tester?.name}</td>
                  <td className="table-cell text-content-secondary text-sm">{formatDateTime(run.date)}</td>
                  <td className="table-cell text-right font-mono text-sm text-content-muted">{run.duration}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <ProgressBar pass={passed} fail={failed} blocked={blocked} skip={skipped} notRun={notRun} height="h-1.5" />
                      <span className="text-xs text-content-muted font-mono whitespace-nowrap">{passed}/{run.executions.length}</span>
                    </div>
                  </td>
                  <td className="table-cell text-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${runStatusColors[run.status]}`}>
                      {run.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <TestRunFormModal open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
};
