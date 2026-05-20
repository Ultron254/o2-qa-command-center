import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { formatDate } from '../lib/formatters';
import { ArrowLeft, Tag, Clock, User, Link, FileText, Pencil } from 'lucide-react';
import { TestCaseFormModal } from '../components/ui/modals/TestCaseFormModal';

export const TestCaseDetail: React.FC = () => {
  const { selectedTestCaseId, testCases, testSuites, defects, setPage, navigate } = useStore();
  const tc = testCases.find(c => c.id === selectedTestCaseId);
  const [showEditForm, setShowEditForm] = useState(false);

  if (!tc) return <div className="p-6 text-content-muted">Test case not found.</div>;

  const suite = testSuites.find(s => s.id === tc.suiteId);
  const linkedDefects = defects.filter(d => tc.linkedDefects.includes(d.id));

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-in">
      <button onClick={() => setPage('test-cases')} className="btn-ghost mb-4 flex items-center gap-1 text-xs">
        <ArrowLeft size={14} /> Back to Test Cases
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="mono-id text-base mb-1">{tc.id}</div>
          <h2 className="text-xl font-semibold text-content-primary mb-2">{tc.title}</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={tc.status} />
            <PriorityBadge priority={tc.priority} />
            <span className={`text-xs px-2 py-0.5 rounded ${tc.type === 'automated' ? 'bg-accent/10 text-accent' : 'bg-surface-elevated text-content-secondary'}`}>
              {tc.type === 'automated' ? 'Automated' : 'Manual'}
            </span>
            <span className="text-xs text-content-muted">Suite: {suite?.name}</span>
          </div>
        </div>
        <button onClick={() => setShowEditForm(true)} className="btn-secondary flex items-center gap-1 text-sm">
          <Pencil size={14} /> Edit
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-6">
          {/* Preconditions */}
          <Card hoverable={false} className="p-4">
            <h3 className="text-sm font-semibold text-content-primary mb-2 flex items-center gap-2">
              <FileText size={14} className="text-content-link" /> Preconditions
            </h3>
            <p className="text-sm text-content-secondary">{tc.preconditions}</p>
          </Card>

          {/* Steps */}
          <Card hoverable={false} className="p-4">
            <h3 className="text-sm font-semibold text-content-primary mb-3">Test Steps</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header text-center w-12">#</th>
                  <th className="table-header text-left">Action</th>
                  <th className="table-header text-left">Expected Result</th>
                </tr>
              </thead>
              <tbody>
                {tc.steps.map(step => (
                  <tr key={step.stepNumber} className="border-b border-line-subtle">
                    <td className="px-4 py-3 text-center font-mono text-xs text-content-muted">{step.stepNumber}</td>
                    <td className="px-4 py-3 text-sm text-content-primary">{step.action}</td>
                    <td className="px-4 py-3 text-sm text-content-secondary">{step.expectedResult}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* History */}
          {tc.history.length > 0 && (
            <Card hoverable={false} className="p-4">
              <h3 className="text-sm font-semibold text-content-primary mb-3 flex items-center gap-2">
                <Clock size={14} className="text-accent" /> Execution History
              </h3>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header text-left">Run</th>
                    <th className="table-header text-left">Date</th>
                    <th className="table-header text-center">Status</th>
                    <th className="table-header text-left">Tester</th>
                    <th className="table-header text-right">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {tc.history.map((h, i) => (
                    <tr
                      key={i}
                      className="border-b border-line-subtle cursor-pointer hover:bg-surface-hover transition-colors"
                      onClick={() => navigate('test-run-execution', h.runId)}
                    >
                      <td className="px-4 py-2 mono-id text-xs text-content-link">{h.runId}</td>
                      <td className="px-4 py-2 text-sm text-content-secondary">{formatDate(h.date)}</td>
                      <td className="px-4 py-2 text-center"><StatusBadge status={h.status} size="sm" /></td>
                      <td className="px-4 py-2 text-sm text-content-secondary">{h.tester}</td>
                      <td className="px-4 py-2 text-sm text-content-muted text-right font-mono">{h.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card hoverable={false} className="p-4">
            <h4 className="text-xs text-content-muted uppercase tracking-wider mb-3">Details</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User size={14} className="text-content-muted" />
                <span className="text-content-muted">Assigned:</span>
                <span className="text-content-primary">{tc.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-content-muted" />
                <span className="text-content-muted">Last Run:</span>
                <span className="text-content-primary">{formatDate(tc.lastRunDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-content-muted text-xs">Automation:</span>
                <span className="text-content-primary text-xs capitalize">{tc.automationStatus}</span>
              </div>
            </div>
          </Card>

          {/* Tags */}
          <Card hoverable={false} className="p-4">
            <h4 className="text-xs text-content-muted uppercase tracking-wider mb-3 flex items-center gap-1">
              <Tag size={12} /> Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {tc.tags.map(tag => (
                <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-surface-elevated text-content-secondary border border-line-subtle">
                  {tag}
                </span>
              ))}
            </div>
          </Card>

          {/* Linked Defects */}
          {linkedDefects.length > 0 && (
            <Card hoverable={false} className="p-4">
              <h4 className="text-xs text-content-muted uppercase tracking-wider mb-3 flex items-center gap-1">
                <Link size={12} /> Linked Defects
              </h4>
              {linkedDefects.map(d => (
                <div
                  key={d.id}
                  className="py-1.5 text-xs cursor-pointer hover:text-content-link transition-colors"
                  onClick={() => navigate('defects')}
                >
                  <span className="mono-id text-content-link">{d.id}</span>
                  <span className="text-content-secondary ml-1">{d.title}</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>

      <TestCaseFormModal open={showEditForm} onClose={() => setShowEditForm(false)} testCase={tc} suiteId={tc.suiteId} />
    </div>
  );
};
