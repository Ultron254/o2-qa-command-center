import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { formatDate } from '../lib/formatters';
import { Bug, Search, Plus, X } from 'lucide-react';
import { DefectFormModal } from '../components/ui/modals/DefectFormModal';
import type { DefectStatus, SeverityLevel, Defect } from '../lib/types';

const defectStatusColors: Record<DefectStatus, string> = {
  new: 'bg-status-running/10 text-status-running',
  in_progress: 'bg-status-blocked/10 text-status-blocked',
  resolved: 'bg-status-pass/10 text-status-pass',
  verified: 'bg-accent/10 text-accent',
  closed: 'bg-surface-elevated text-content-muted',
};

const workflowSteps: DefectStatus[] = ['new', 'in_progress', 'resolved', 'verified', 'closed'];

export const Defects: React.FC = () => {
  const { getFilteredDefects, defectFilters, setDefectFilter, updateDefect, navigate } = useStore();
  const filtered = getFilteredDefects();
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editDefect, setEditDefect] = useState<Defect | undefined>(undefined);

  const handleOpenCreate = () => {
    setEditDefect(undefined);
    setShowForm(true);
  };

  const handleOpenEdit = (defect: Defect) => {
    setEditDefect(defect);
    setShowForm(true);
  };

  const handleAdvanceStatus = (defect: Defect, targetStatus: DefectStatus) => {
    updateDefect(defect.id, { status: targetStatus, updatedAt: new Date().toISOString() });
    setSelectedDefect({ ...defect, status: targetStatus });
  };

  return (
    <div className="p-6 h-full flex gap-6 animate-fade-in">
      <div className={`${selectedDefect ? 'w-1/2' : 'flex-1'} flex flex-col transition-all`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bug size={20} className="text-status-fail" /> Defects
            <span className="text-sm font-normal text-content-muted ml-2">{filtered.length} total</span>
          </h2>
          <button className="btn-primary text-sm flex items-center gap-1" onClick={handleOpenCreate}>
            <Plus size={14} /> Log Defect
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
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
        <div className="flex-1 overflow-auto border border-line">
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
                <tr key={d.id} className={`table-row ${selectedDefect?.id === d.id ? 'bg-surface-hover' : ''}`} onClick={() => setSelectedDefect(d)}>
                  <td className="table-cell mono-id">{d.id}</td>
                  <td className="table-cell">{d.title}</td>
                  <td className="table-cell text-center"><SeverityBadge severity={d.severity} /></td>
                  <td className="table-cell text-center"><PriorityBadge priority={d.priority} /></td>
                  <td className="table-cell text-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${defectStatusColors[d.status]}`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="table-cell text-content-secondary text-xs">{d.assignee}</td>
                  <td className="table-cell text-content-muted text-xs">{formatDate(d.createdAt)}</td>
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
                <h3 className="text-base font-semibold text-content-primary mt-1">{selectedDefect.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEdit(selectedDefect)} className="btn-ghost text-xs">Edit</button>
                <button onClick={() => setSelectedDefect(null)} className="btn-ghost p-1"><X size={16} /></button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <SeverityBadge severity={selectedDefect.severity} />
              <PriorityBadge priority={selectedDefect.priority} />
              <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${defectStatusColors[selectedDefect.status]}`}>
                {selectedDefect.status.replace('_', ' ')}
              </span>
            </div>

            {/* Workflow — clickable to advance status */}
            <div className="flex items-center gap-1 mb-6">
              {workflowSteps.map((step, i) => {
                const isActive = step === selectedDefect.status;
                const isPast = workflowSteps.indexOf(selectedDefect.status) > i;
                return (
                  <React.Fragment key={step}>
                    <button
                      onClick={() => handleAdvanceStatus(selectedDefect, step)}
                      className={`text-[10px] px-2 py-1 rounded capitalize font-medium cursor-pointer transition-colors hover:ring-1 hover:ring-accent ${isActive ? defectStatusColors[step] : isPast ? 'bg-status-pass/5 text-status-pass' : 'bg-surface-elevated text-content-muted'}`}
                    >
                      {step.replace('_', ' ')}
                    </button>
                    {i < workflowSteps.length - 1 && <div className={`w-4 h-px ${isPast ? 'bg-status-pass' : 'bg-line'}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <div className="text-xs text-content-muted uppercase tracking-wider mb-1">Description</div>
                <p className="text-content-secondary">{selectedDefect.description}</p>
              </div>
              <div>
                <div className="text-xs text-content-muted uppercase tracking-wider mb-1">Steps to Reproduce</div>
                <pre className="text-content-secondary font-mono text-xs whitespace-pre-wrap bg-surface-inset p-3 rounded">{selectedDefect.stepsToReproduce}</pre>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-content-muted uppercase tracking-wider mb-1">Expected</div>
                  <p className="text-status-pass text-xs">{selectedDefect.expectedBehavior}</p>
                </div>
                <div>
                  <div className="text-xs text-content-muted uppercase tracking-wider mb-1">Actual</div>
                  <p className="text-status-fail text-xs">{selectedDefect.actualBehavior}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><span className="text-content-muted">Environment:</span> <span className="text-content-secondary">{selectedDefect.environment}</span></div>
                <div><span className="text-content-muted">Browser:</span> <span className="text-content-secondary">{selectedDefect.browser}</span></div>
                <div><span className="text-content-muted">Assignee:</span> <span className="text-content-secondary">{selectedDefect.assignee}</span></div>
                <div><span className="text-content-muted">Created by:</span> <span className="text-content-secondary">{selectedDefect.createdBy}</span></div>
              </div>
              {selectedDefect.linkedTestCases.length > 0 && (
                <div>
                  <div className="text-xs text-content-muted uppercase tracking-wider mb-1">Linked Test Cases</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedDefect.linkedTestCases.map(id => (
                      <button
                        key={id}
                        onClick={() => navigate('test-case-detail', id)}
                        className="mono-id text-xs px-2 py-0.5 bg-surface-elevated rounded hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      <DefectFormModal open={showForm} onClose={() => setShowForm(false)} defect={editDefect} />
    </div>
  );
};
