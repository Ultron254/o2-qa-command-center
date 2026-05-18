import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { formatDate } from '../lib/formatters';
import { Bug, Search, Plus, X } from 'lucide-react';
import type { DefectStatus, SeverityLevel, Defect } from '../lib/types';

const defectStatusColors: Record<DefectStatus, string> = {
  new: 'bg-status-running/10 text-status-running',
  in_progress: 'bg-status-blocked/10 text-status-blocked',
  resolved: 'bg-status-pass/10 text-status-pass',
  verified: 'bg-azure-blue/10 text-azure-blue',
  closed: 'bg-bg-elevated text-text-muted',
};

const workflowSteps: DefectStatus[] = ['new', 'in_progress', 'resolved', 'verified', 'closed'];

export const Defects: React.FC = () => {
  const { getFilteredDefects, defectFilters, setDefectFilter } = useStore();
  const filtered = getFilteredDefects();
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="p-6 h-full flex gap-6 animate-fade-in">
      <div className={`${selectedDefect ? 'w-1/2' : 'flex-1'} flex flex-col transition-all`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bug size={20} className="text-status-fail" /> Defects
            <span className="text-sm font-normal text-text-muted ml-2">{filtered.length} total</span>
          </h2>
          <button className="btn-primary text-sm flex items-center gap-1" onClick={() => setShowCreate(!showCreate)}>
            <Plus size={14} /> Log Defect
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input className="input pl-8 w-full" placeholder="Search defects..." value={defectFilters.search} onChange={e => setDefectFilter('search', e.target.value)} />
          </div>
          <select className="input" value={defectFilters.severity || ''} onChange={e => setDefectFilter('severity', (e.target.value || null) as SeverityLevel | null)}>
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className="input" value={defectFilters.status || ''} onChange={e => setDefectFilter('status', (e.target.value || null) as DefectStatus | null)}>
            <option value="">All Statuses</option>
            {workflowSteps.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border border-border-default">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="table-header text-left w-24">ID</th>
                <th className="table-header text-left">Title</th>
                <th className="table-header text-center w-24">Severity</th>
                <th className="table-header text-center w-24">Priority</th>
                <th className="table-header text-center w-28">Status</th>
                <th className="table-header text-left w-28">Assignee</th>
                <th className="table-header text-left w-28">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className={`table-row ${selectedDefect?.id === d.id ? 'bg-bg-hover' : ''}`} onClick={() => setSelectedDefect(d)}>
                  <td className="table-cell mono-id">{d.id}</td>
                  <td className="table-cell">{d.title}</td>
                  <td className="table-cell text-center"><SeverityBadge severity={d.severity} /></td>
                  <td className="table-cell text-center"><PriorityBadge priority={d.priority} /></td>
                  <td className="table-cell text-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${defectStatusColors[d.status]}`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="table-cell text-text-secondary text-xs">{d.assignee}</td>
                  <td className="table-cell text-text-muted text-xs">{formatDate(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedDefect && (
        <div className="w-1/2 overflow-y-auto">
          <Card hoverable={false} className="p-5 h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="mono-id text-sm">{selectedDefect.id}</span>
                <h3 className="text-base font-semibold text-text-primary mt-1">{selectedDefect.title}</h3>
              </div>
              <button onClick={() => setSelectedDefect(null)} className="btn-ghost p-1"><X size={16} /></button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <SeverityBadge severity={selectedDefect.severity} />
              <PriorityBadge priority={selectedDefect.priority} />
              <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${defectStatusColors[selectedDefect.status]}`}>
                {selectedDefect.status.replace('_', ' ')}
              </span>
            </div>

            {/* Workflow */}
            <div className="flex items-center gap-1 mb-6">
              {workflowSteps.map((step, i) => {
                const isActive = step === selectedDefect.status;
                const isPast = workflowSteps.indexOf(selectedDefect.status) > i;
                return (
                  <React.Fragment key={step}>
                    <div className={`text-[10px] px-2 py-1 rounded capitalize font-medium ${isActive ? defectStatusColors[step] : isPast ? 'bg-status-pass/5 text-status-pass' : 'bg-bg-elevated text-text-muted'}`}>
                      {step.replace('_', ' ')}
                    </div>
                    {i < workflowSteps.length - 1 && <div className={`w-4 h-px ${isPast ? 'bg-status-pass' : 'bg-border-default'}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Description</div>
                <p className="text-text-secondary">{selectedDefect.description}</p>
              </div>
              <div>
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Steps to Reproduce</div>
                <pre className="text-text-secondary font-mono text-xs whitespace-pre-wrap bg-bg-inset p-3 rounded">{selectedDefect.stepsToReproduce}</pre>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Expected</div>
                  <p className="text-status-pass text-xs">{selectedDefect.expectedBehavior}</p>
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Actual</div>
                  <p className="text-status-fail text-xs">{selectedDefect.actualBehavior}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><span className="text-text-muted">Environment:</span> <span className="text-text-secondary">{selectedDefect.environment}</span></div>
                <div><span className="text-text-muted">Browser:</span> <span className="text-text-secondary">{selectedDefect.browser}</span></div>
                <div><span className="text-text-muted">Assignee:</span> <span className="text-text-secondary">{selectedDefect.assignee}</span></div>
                <div><span className="text-text-muted">Created by:</span> <span className="text-text-secondary">{selectedDefect.createdBy}</span></div>
              </div>
              {selectedDefect.linkedTestCases.length > 0 && (
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Linked Test Cases</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedDefect.linkedTestCases.map(id => (
                      <span key={id} className="mono-id text-xs px-2 py-0.5 bg-bg-elevated rounded">{id}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
