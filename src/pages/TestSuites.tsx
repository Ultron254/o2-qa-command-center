import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { ChevronRight, ChevronDown, FolderTree, Play, Plus } from 'lucide-react';
import { TestCaseFormModal } from '../components/ui/modals/TestCaseFormModal';
import { TestRunFormModal } from '../components/ui/modals/TestRunFormModal';

export const TestSuites: React.FC = () => {
  const { testSuites, testCases, getSuiteStats, navigate, selectedSuiteId, setSelectedSuite } = useStore();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(testSuites.map(s => s.id)));
  const activeSuite = testSuites.find(s => s.id === selectedSuiteId) || testSuites[0];
  const stats = getSuiteStats(activeSuite.id);
  const suiteCases = testCases.filter(c => c.suiteId === activeSuite.id);

  const [showCaseForm, setShowCaseForm] = useState(false);
  const [showRunForm, setShowRunForm] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const suiteTypeLabels: Record<string, string> = {
    smoke: 'Smoke', unit: 'Unit', state: 'State Mgmt', ui_rendering: 'UI Render',
    ui_interactions: 'UI Flows', api: 'API', integration: 'Integration',
    performance: 'Performance', security: 'Security', data_pipeline: 'Pipeline', cross_browser: 'Compat',
  };

  return (
    <div className="p-6 h-full flex gap-6 animate-fade-in">
      {/* Left Tree Panel */}
      <div className="w-72 shrink-0">
        <Card hoverable={false} className="p-3 h-full overflow-y-auto">
          <div className="flex items-center gap-2 mb-3 px-1">
            <FolderTree size={16} className="text-content-link" />
            <span className="text-sm font-semibold">Suite Tree</span>
          </div>
          <div className="space-y-0.5">
            {testSuites.map(suite => {
              const s = getSuiteStats(suite.id);
              const isActive = activeSuite.id === suite.id;
              const isExpanded = expanded.has(suite.id);
              const cases = testCases.filter(c => c.suiteId === suite.id);
              return (
                <div key={suite.id}>
                  <div
                    className={`w-full flex items-center gap-1.5 py-1.5 px-2 rounded text-left transition-colors cursor-pointer
                      ${isActive ? 'bg-surface-hover text-content-primary' : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover/50'}`}
                    onClick={() => { setSelectedSuite(suite.id); }}
                  >
                    <span onClick={(e) => { e.stopPropagation(); toggleExpand(suite.id); }} className="p-0.5 cursor-pointer">
                      {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </span>
                    <span className="text-xs flex-1 truncate">{suite.name}</span>
                    <span className="text-[10px] font-mono text-content-muted">{s.pass}/{s.total}</span>
                  </div>
                  {isExpanded && (
                    <div className="ml-5 space-y-0.5 mt-0.5">
                      {cases.map(c => (
                        <div key={c.id} className="flex items-center gap-1.5 py-1 px-2 text-[11px] rounded hover:bg-surface-hover cursor-pointer text-content-muted hover:text-content-primary transition-colors"
                          onClick={() => navigate('test-case-detail', c.id)}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'pass' ? 'bg-status-pass' : c.status === 'fail' ? 'bg-status-fail' : c.status === 'blocked' ? 'bg-status-blocked' : 'bg-content-muted'}`} />
                          <span className="truncate">{c.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Right Detail Panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-content-primary">{activeSuite.name}</h2>
            <p className="text-sm text-content-secondary mt-1">{activeSuite.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs px-2 py-0.5 rounded bg-content-link/10 text-content-link uppercase tracking-wider font-semibold">
                {suiteTypeLabels[activeSuite.suiteType] || activeSuite.suiteType}
              </span>
              <PriorityBadge priority={activeSuite.priority} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs flex items-center gap-1" onClick={() => setShowCaseForm(true)}>
              <Plus size={14} /> Add Case
            </button>
            <button className="btn-primary text-xs flex items-center gap-1" onClick={() => setShowRunForm(true)}>
              <Play size={14} /> Run Suite
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-4">
          {[
            ['Total', stats.total, 'text-content-primary'],
            ['Pass', stats.pass, 'text-status-pass'],
            ['Fail', stats.fail, 'text-status-fail'],
            ['Blocked', stats.blocked, 'text-status-blocked'],
            ['Not Run', stats.notRun, 'text-content-muted'],
          ].map(([label, count, color]) => (
            <Card key={label as string} hoverable={false} className="p-3 text-center">
              <div className={`font-semibold text-xl ${color}`}>{count as number}</div>
              <div className="text-[10px] text-content-muted uppercase tracking-wider">{label as string}</div>
            </Card>
          ))}
        </div>

        <ProgressBar pass={stats.pass} fail={stats.fail} blocked={stats.blocked} skip={stats.skip} notRun={stats.notRun} height="h-2" />

        <div className="mt-4 border border-line overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header text-left w-28">ID</th>
                <th className="table-header text-left">Title</th>
                <th className="table-header text-center w-20">Type</th>
                <th className="table-header text-center w-20">Priority</th>
                <th className="table-header text-center w-24">Status</th>
              </tr>
            </thead>
            <tbody>
              {suiteCases.map(tc => (
                <tr key={tc.id} className="table-row" onClick={() => navigate('test-case-detail', tc.id)}>
                  <td className="table-cell mono-id">{tc.id}</td>
                  <td className="table-cell">{tc.title}</td>
                  <td className="table-cell text-center text-xs text-content-muted capitalize">{tc.type}</td>
                  <td className="table-cell text-center"><PriorityBadge priority={tc.priority} /></td>
                  <td className="table-cell text-center"><StatusBadge status={tc.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TestCaseFormModal open={showCaseForm} onClose={() => setShowCaseForm(false)} suiteId={activeSuite.id} />
      <TestRunFormModal open={showRunForm} onClose={() => setShowRunForm(false)} />
    </div>
  );
};
