import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle, AlertTriangle, MinusCircle } from 'lucide-react';
import type { TestStatus } from '../lib/types';

export const TestRunExecution: React.FC = () => {
  const { testRuns, testCases, activeRunId, activeRunCaseIndex, setActiveRunCaseIndex, setPage } = useStore();
  const run = testRuns.find(r => r.id === activeRunId);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!run) return <div className="p-6 text-text-muted">No active test run.</div>;

  const currentExec = run.executions[activeRunCaseIndex];
  const currentCase = testCases.find(c => c.id === currentExec?.testCaseId);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  const statusButtons: { status: TestStatus; icon: React.ElementType; label: string; color: string }[] = [
    { status: 'pass', icon: CheckCircle2, label: 'Pass', color: 'hover:bg-status-pass/20 hover:text-status-pass' },
    { status: 'fail', icon: XCircle, label: 'Fail', color: 'hover:bg-status-fail/20 hover:text-status-fail' },
    { status: 'blocked', icon: AlertTriangle, label: 'Blocked', color: 'hover:bg-status-blocked/20 hover:text-status-blocked' },
    { status: 'skip', icon: MinusCircle, label: 'Skip', color: 'hover:bg-status-skip/20 hover:text-status-skip' },
  ];

  return (
    <div className="p-6 h-full flex gap-6 animate-fade-in">
      {/* Left: Case List */}
      <div className="w-72 shrink-0">
        <Card hoverable={false} className="p-3 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-3 px-1">
            <button onClick={() => setPage('test-runs')} className="btn-ghost text-xs flex items-center gap-1">
              <ArrowLeft size={12} /> Runs
            </button>
            <div className="flex items-center gap-1 text-xs text-azure-blue-text font-mono">
              <Clock size={12} /> {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
          </div>
          <div className="text-xs text-text-muted px-1 mb-2">{run.name}</div>
          <div className="space-y-0.5">
            {run.executions.map((exec, i) => {
              const tc = testCases.find(c => c.id === exec.testCaseId);
              const isActive = i === activeRunCaseIndex;
              return (
                <button
                  key={exec.testCaseId}
                  onClick={() => setActiveRunCaseIndex(i)}
                  className={`w-full flex items-center gap-2 py-2 px-2 rounded text-left transition-colors text-xs
                    ${isActive ? 'bg-bg-hover text-text-primary' : 'text-text-secondary hover:bg-bg-hover/50'}`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    exec.status === 'pass' ? 'bg-status-pass' :
                    exec.status === 'fail' ? 'bg-status-fail' :
                    exec.status === 'blocked' ? 'bg-status-blocked' :
                    exec.status === 'skip' ? 'bg-status-skip' : 'bg-text-muted/30'
                  }`} />
                  <span className="font-mono text-[10px] shrink-0">{exec.testCaseId}</span>
                  <span className="truncate">{tc?.title}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Right: Step Runner */}
      <div className="flex-1 overflow-y-auto">
        {currentCase && currentExec && (
          <>
            <div className="mb-4">
              <div className="mono-id text-sm">{currentCase.id}</div>
              <h2 className="text-lg font-semibold text-text-primary mt-1">{currentCase.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={currentExec.status} />
                <span className="text-xs text-text-muted">Case {activeRunCaseIndex + 1} of {run.executions.length}</span>
              </div>
            </div>

            {currentCase.preconditions && (
              <Card hoverable={false} className="p-3 mb-4">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Preconditions</div>
                <div className="text-sm text-text-secondary">{currentCase.preconditions}</div>
              </Card>
            )}

            <div className="space-y-3 mb-6">
              {currentCase.steps.map((step, si) => {
                const execStep = currentExec.steps[si];
                return (
                  <Card key={step.stepNumber} hoverable={false} className={`p-4 border-l-2 ${
                    execStep?.status === 'pass' ? 'border-l-status-pass' :
                    execStep?.status === 'fail' ? 'border-l-status-fail' :
                    execStep?.status === 'blocked' ? 'border-l-status-blocked' :
                    'border-l-border-default'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-xs text-text-muted mb-1">Step {step.stepNumber}</div>
                        <div className="text-sm text-text-primary mb-2">{step.action}</div>
                        <div className="text-xs text-text-muted mb-1">Expected:</div>
                        <div className="text-sm text-text-secondary">{step.expectedResult}</div>
                        <textarea
                          className="input w-full mt-3 text-xs"
                          rows={2}
                          placeholder="Actual result..."
                          defaultValue={execStep?.actualResult || ''}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        {statusButtons.map(({ status, icon: Icon, label, color }) => (
                          <button key={status} className={`p-1.5 rounded text-text-muted transition-colors ${color} ${execStep?.status === status ? 'bg-bg-elevated ring-1 ring-border-strong' : ''}`} title={label}>
                            <Icon size={16} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-border-default pt-4">
              <button
                onClick={() => setActiveRunCaseIndex(Math.max(0, activeRunCaseIndex - 1))}
                disabled={activeRunCaseIndex === 0}
                className="btn-secondary flex items-center gap-1 disabled:opacity-30"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <div className="text-xs text-text-muted">
                {activeRunCaseIndex + 1} / {run.executions.length}
              </div>
              <button
                onClick={() => setActiveRunCaseIndex(Math.min(run.executions.length - 1, activeRunCaseIndex + 1))}
                disabled={activeRunCaseIndex === run.executions.length - 1}
                className="btn-primary flex items-center gap-1 disabled:opacity-30"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
