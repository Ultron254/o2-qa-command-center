import React from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { formatDate } from '../lib/formatters';
import { ClipboardList, Play } from 'lucide-react';
import type { PlanStatus } from '../lib/types';

const statusColors: Record<PlanStatus, string> = {
  draft: 'bg-text-muted/10 text-text-muted',
  active: 'bg-status-pass/10 text-status-pass',
  completed: 'bg-azure-blue/10 text-azure-blue',
  archived: 'bg-bg-elevated text-text-muted',
};

export const TestPlans: React.FC = () => {
  const { testPlans, testSuites, testCases, teamMembers, navigate, selectedTestPlanId } = useStore();
  const selectedPlan = testPlans.find(p => p.id === selectedTestPlanId);

  if (selectedPlan) {
    const planSuites = testSuites.filter(s => selectedPlan.suiteIds.includes(s.id));
    const planCases = testCases.filter(tc => planSuites.some(s => s.id === tc.suiteId));
    const passed = planCases.filter(c => c.status === 'pass').length;
    const failed = planCases.filter(c => c.status === 'fail').length;
    const blocked = planCases.filter(c => c.status === 'blocked').length;
    const skipped = planCases.filter(c => c.status === 'skip').length;
    const notRun = planCases.filter(c => c.status === 'not_run').length;
    const testers = teamMembers.filter(m => selectedPlan.assignedTesters.includes(m.id));

    return (
      <div className="p-6 h-full overflow-y-auto animate-fade-in">
        <button onClick={() => useStore.getState().setSelectedTestPlan(null)} className="btn-ghost text-xs mb-4">Back to Plans</button>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-1">{selectedPlan.name}</h2>
            <p className="text-sm text-text-secondary max-w-2xl">{selectedPlan.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${statusColors[selectedPlan.status]}`}>{selectedPlan.status}</span>
              <span className="text-xs text-text-muted">{formatDate(selectedPlan.startDate)} - {formatDate(selectedPlan.endDate)}</span>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2"><Play size={14} /> Run All</button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card hoverable={false} className="p-4 text-center">
            <div className="font-semibold text-2xl text-text-primary">{planCases.length}</div>
            <div className="text-xs text-text-muted">Total Cases</div>
          </Card>
          <Card hoverable={false} className="p-4 text-center">
            <div className="font-semibold text-2xl text-status-pass">{passed}</div>
            <div className="text-xs text-text-muted">Passed</div>
          </Card>
          <Card hoverable={false} className="p-4 text-center">
            <div className="font-semibold text-2xl text-status-fail">{failed}</div>
            <div className="text-xs text-text-muted">Failed</div>
          </Card>
          <Card hoverable={false} className="p-4 text-center">
            <div className="font-semibold text-2xl text-text-muted">{notRun}</div>
            <div className="text-xs text-text-muted">Not Run</div>
          </Card>
        </div>

        <ProgressBar pass={passed} fail={failed} blocked={blocked} skip={skipped} notRun={notRun} showLabels height="h-3" />

        <div className="mt-6 grid grid-cols-2 gap-6">
          <Card hoverable={false} className="p-4">
            <h3 className="text-sm font-semibold mb-3">Linked Suites ({planSuites.length})</h3>
            <div className="space-y-2">
              {planSuites.map(suite => {
                const sc = testCases.filter(c => c.suiteId === suite.id);
                const sp = sc.filter(c => c.status === 'pass').length;
                return (
                  <div key={suite.id} className="flex items-center justify-between py-2 px-3 rounded bg-bg-elevated hover:bg-bg-hover transition-colors cursor-pointer" onClick={() => navigate('test-suites')}>
                    <span className="text-sm text-text-primary">{suite.name}</span>
                    <span className="text-xs text-text-muted font-mono">{sp}/{sc.length}</span>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card hoverable={false} className="p-4">
            <h3 className="text-sm font-semibold mb-3">Assigned Testers</h3>
            <div className="space-y-2">
              {testers.map(t => (
                <div key={t.id} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-azure-blue/20 flex items-center justify-center text-azure-blue text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm text-text-primary">{t.name}</div>
                    <div className="text-xs text-text-muted capitalize">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList size={20} className="text-azure-blue" />
          <h2 className="text-lg font-semibold">Test Plans</h2>
        </div>
        <button className="btn-primary text-sm">New Test Plan</button>
      </div>
      <div className="border border-border-default overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header text-left">Plan Name</th>
              <th className="table-header text-left">Product</th>
              <th className="table-header text-center">Status</th>
              <th className="table-header text-center">Suites</th>
              <th className="table-header text-center">Cases</th>
              <th className="table-header text-left">Created By</th>
              <th className="table-header text-left">Last Run</th>
            </tr>
          </thead>
          <tbody>
            {testPlans.map(plan => {
              const planSuites = testSuites.filter(s => plan.suiteIds.includes(s.id));
              const planCases = testCases.filter(tc => planSuites.some(s => s.id === tc.suiteId));
              const creator = teamMembers.find(m => m.id === plan.createdBy);
              return (
                <tr key={plan.id} className="table-row" onClick={() => useStore.getState().setSelectedTestPlan(plan.id)}>
                  <td className="table-cell font-medium">{plan.name}</td>
                  <td className="table-cell text-text-secondary">MSIT v1</td>
                  <td className="table-cell text-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${statusColors[plan.status]}`}>{plan.status}</span>
                  </td>
                  <td className="table-cell text-center font-mono text-sm">{planSuites.length}</td>
                  <td className="table-cell text-center font-mono text-sm">{planCases.length}</td>
                  <td className="table-cell text-text-secondary">{creator?.name}</td>
                  <td className="table-cell text-text-muted text-sm">{formatDate(plan.lastRunDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
