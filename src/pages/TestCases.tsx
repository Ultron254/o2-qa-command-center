import React from 'react';
import { useStore } from '../lib/store';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import type { TestStatus, TestType, PriorityLevel } from '../lib/types';

export const TestCases: React.FC = () => {
  const { getFilteredTestCases, testSuites, testCaseFilters, setTestCaseFilter, clearTestCaseFilters, navigate } = useStore();
  const cases = getFilteredTestCases();

  const getSuiteName = (id: string) => testSuites.find(s => s.id === id)?.name || id;

  return (
    <div className="p-6 h-full flex flex-col animate-fade-in">
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="input pl-8 w-full"
            placeholder="Search by ID or title..."
            value={testCaseFilters.search}
            onChange={e => setTestCaseFilter('search', e.target.value)}
          />
        </div>
        <select className="input" value={testCaseFilters.suiteId || ''} onChange={e => setTestCaseFilter('suiteId', e.target.value || null)}>
          <option value="">All Suites</option>
          {testSuites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className="input" value={testCaseFilters.type || ''} onChange={e => setTestCaseFilter('type', (e.target.value || null) as TestType | null)}>
          <option value="">All Types</option>
          <option value="manual">Manual</option>
          <option value="automated">Automated</option>
        </select>
        <select className="input" value={testCaseFilters.priority || ''} onChange={e => setTestCaseFilter('priority', (e.target.value || null) as PriorityLevel | null)}>
          <option value="">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className="input" value={testCaseFilters.status || ''} onChange={e => setTestCaseFilter('status', (e.target.value || null) as TestStatus | null)}>
          <option value="">All Statuses</option>
          <option value="pass">Passed</option>
          <option value="fail">Failed</option>
          <option value="blocked">Blocked</option>
          <option value="not_run">Not Run</option>
        </select>
        <button onClick={clearTestCaseFilters} className="btn-ghost text-xs flex items-center gap-1">
          <SlidersHorizontal size={12} /> Clear
        </button>
        <div className="ml-auto text-xs text-text-muted flex items-center gap-1">
          <Filter size={12} /> {cases.length} of {useStore.getState().testCases.length} cases
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border border-border-default">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="table-header text-left w-32">ID</th>
              <th className="table-header text-left">Title</th>
              <th className="table-header text-left w-44">Suite</th>
              <th className="table-header text-center w-24">Type</th>
              <th className="table-header text-center w-24">Priority</th>
              <th className="table-header text-center w-28">Status</th>
              <th className="table-header text-left w-32">Assigned</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(tc => (
              <tr key={tc.id} className="table-row" onClick={() => navigate('test-case-detail', tc.id)}>
                <td className="table-cell mono-id">{tc.id}</td>
                <td className="table-cell text-text-primary">{tc.title}</td>
                <td className="table-cell text-text-secondary text-xs truncate">{getSuiteName(tc.suiteId)}</td>
                <td className="table-cell text-center">
                  <span className={`text-xs px-2 py-0.5 rounded ${tc.type === 'automated' ? 'bg-azure-blue/10 text-azure-blue' : 'bg-bg-elevated text-text-secondary'}`}>
                    {tc.type === 'automated' ? 'Auto' : 'Manual'}
                  </span>
                </td>
                <td className="table-cell text-center"><PriorityBadge priority={tc.priority} /></td>
                <td className="table-cell text-center"><StatusBadge status={tc.status} size="sm" /></td>
                <td className="table-cell text-text-secondary text-xs">{tc.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
