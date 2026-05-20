import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { formatDateTime, formatRelativeTime, getPassRateColor } from '../lib/formatters';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Bar, ComposedChart, ReferenceLine } from 'recharts';
import { Activity, Bug, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import type { PageId } from '../lib/types';

const activityColors: Record<string, string> = {
  test_run: 'bg-accent',
  defect_logged: 'bg-wit-bug',
  case_updated: 'bg-azure-blue-text',
  case_created: 'bg-status-pass',
  plan_created: 'bg-wit-story',
  run_completed: 'bg-status-pass',
  defect_resolved: 'bg-wit-feature',
};

const activityItemTypeToPage: Record<string, PageId> = {
  test_case: 'test-cases',
  test_run: 'test-runs',
  defect: 'defects',
  test_plan: 'test-plans',
  test_suite: 'test-suites',
};

export const Dashboard: React.FC = () => {
  const { testCases, testSuites, defects, activityFeed, trendData, getStatusCounts, getPassRate, getSuiteStats, navigate } = useStore();
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set());
  const statusCounts = getStatusCounts();
  const passRate = getPassRate();
  const total = testCases.length;
  const openDefects = defects.filter(d => d.status !== 'closed' && d.status !== 'verified');

  const toggleSuite = (id: string) => {
    setExpandedSuites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleActivityClick = (itemType: string, itemId: string) => {
    const page = activityItemTypeToPage[itemType];
    if (!page) return;

    if (itemType === 'test_case') {
      navigate('test-case-detail', itemId);
    } else if (itemType === 'test_run') {
      navigate('test-run-execution', itemId);
    } else {
      navigate(page);
    }
  };

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full animate-fade-in">
      {/* Row 1: Health Bar */}
      <Card hoverable={false} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-8">
            <div>
              <div className="text-xs uppercase tracking-wider mb-1 text-content-muted">Total Test Cases</div>
              <div className="text-4xl font-semibold text-content-primary">{total}</div>
            </div>
            <div className="w-px h-12 bg-line" />
            <div>
              <div className="text-xs uppercase tracking-wider mb-1 text-content-muted">Pass Rate</div>
              <div className={`text-4xl font-semibold ${getPassRateColor(passRate)}`}>
                {passRate.toFixed(1)}%
              </div>
            </div>
            <div className="w-px h-12 bg-line" />
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-lg text-[#22C55E]">{statusCounts.pass}</div>
                <div className="text-xs text-content-muted">Passed</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-[#EF4444]">{statusCounts.fail}</div>
                <div className="text-xs text-content-muted">Failed</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-[#EAB308]">{statusCounts.blocked}</div>
                <div className="text-xs text-content-muted">Blocked</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-content-muted">{statusCounts.not_run}</div>
                <div className="text-xs text-content-muted">Not Run</div>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-content-muted">
            <div>MSIT v1</div>
            <div>Last run: {formatDateTime('2026-05-18T14:30:00Z')}</div>
          </div>
        </div>
        <ProgressBar pass={statusCounts.pass} fail={statusCounts.fail} blocked={statusCounts.blocked} skip={statusCounts.skip} notRun={statusCounts.not_run} showLabels height="h-2" />
      </Card>

      {/* Row 2: 3-column */}
      <div className="grid grid-cols-12 gap-5">
        {/* Column A: Execution by Suite */}
        <div className="col-span-5">
          <Card hoverable={false} className="p-4 h-full">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-content-primary">
              <Activity size={16} className="text-accent" />
              Execution by Suite
            </h3>
            <div className="space-y-0.5 max-h-[340px] overflow-y-auto">
              {testSuites.map(suite => {
                const stats = getSuiteStats(suite.id);
                const expanded = expandedSuites.has(suite.id);
                const suiteCases = testCases.filter(tc => tc.suiteId === suite.id);
                return (
                  <div key={suite.id}>
                    <button onClick={() => toggleSuite(suite.id)} className="w-full flex items-center gap-2 py-2 px-2 rounded-sm hover:bg-surface-hover transition-colors group">
                      {expanded ? <ChevronDown size={14} className="text-content-muted" /> : <ChevronRight size={14} className="text-content-muted" />}
                      <span className="text-sm flex-1 text-left truncate text-content-secondary">{suite.name}</span>
                      <span className="text-xs font-mono text-content-muted">{stats.pass}/{stats.total}</span>
                      <div className="w-24">
                        <ProgressBar pass={stats.pass} fail={stats.fail} blocked={stats.blocked} skip={stats.skip} notRun={stats.notRun} height="h-1.5" />
                      </div>
                    </button>
                    {expanded && (
                      <div className="ml-7 mb-2 space-y-0.5">
                        {suiteCases.map(tc => (
                          <div key={tc.id} className="flex items-center gap-2 py-1 px-2 text-xs rounded-sm hover:bg-surface-hover cursor-pointer" onClick={() => navigate('test-case-detail', tc.id)}>
                            <StatusBadge status={tc.status} size="sm" />
                            <span className="mono-id">{tc.id}</span>
                            <span className="truncate flex-1 text-content-secondary">{tc.title}</span>
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

        {/* Column B: Defect Summary */}
        <div className="col-span-3">
          <Card hoverable={false} className="p-4 h-full">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-content-primary">
              <Bug size={16} className="text-[#EF4444]" />
              Bug Summary
            </h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-semibold text-[#EF4444]">{openDefects.length}</div>
              <div className="text-xs text-content-muted">Open Bugs</div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-xs uppercase tracking-wider text-content-muted">By Severity</div>
              {(['critical','high','medium','low'] as const).map(sev => {
                const count = openDefects.filter(d => d.severity === sev).length;
                return (
                  <div key={sev} className="flex items-center justify-between text-sm">
                    <SeverityBadge severity={sev} />
                    <span className="font-mono text-content-secondary">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-xs uppercase tracking-wider text-content-muted">By Status</div>
              {(['new','in_progress','resolved'] as const).map(st => {
                const count = defects.filter(d => d.status === st).length;
                return (
                  <div key={st} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-content-secondary">{st.replace('_', ' ')}</span>
                    <span className="font-mono text-content-secondary">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 border-t border-line">
              <div className="text-xs uppercase tracking-wider mb-2 flex items-center gap-1 text-content-muted">
                <AlertTriangle size={12} /> Critical Open
              </div>
              {openDefects.filter(d => d.severity === 'critical' || d.severity === 'high').slice(0, 3).map(d => (
                <div
                  key={d.id}
                  className="py-1.5 text-xs cursor-pointer transition-colors text-content-secondary hover:text-content-link"
                  onClick={() => navigate('defects')}
                >
                  <span className="mono-id">{d.id}</span> <span>{d.title}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Column C: Recent Activity */}
        <div className="col-span-4">
          <Card hoverable={false} className="p-4 h-full">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-content-primary">
              <Activity size={16} className="text-accent" />
              Recent Activity
            </h3>
            <div className="space-y-0 max-h-[340px] overflow-y-auto">
              {activityFeed.map((entry, i) => (
                <div
                  key={entry.id}
                  className="flex gap-3 py-2 group cursor-pointer hover:bg-surface-hover/50 rounded px-1 transition-colors"
                  onClick={() => handleActivityClick(entry.itemType, entry.itemId)}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${activityColors[entry.action] || 'bg-[#8a8886]'}`} />
                    {i < activityFeed.length - 1 && <div className="w-px flex-1 mt-1 bg-line" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-content-secondary group-hover:text-content-link transition-colors">{entry.description}</div>
                    <div className="text-[11px] mt-0.5 text-content-muted">
                      {entry.user} · {formatRelativeTime(entry.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Row 3: Trend Charts */}
      <div className="grid grid-cols-2 gap-5">
        <Card hoverable={false} className="p-4">
          <h3 className="text-sm font-semibold mb-4 text-content-primary">Pass Rate Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line-subtle))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgb(var(--content-muted))' }} tickFormatter={v => v.slice(5)} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'rgb(var(--content-muted))' }} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: 'rgb(var(--surface-secondary))', border: '1px solid rgb(var(--line-default))', borderRadius: 2, fontSize: 12 }} labelStyle={{ color: 'rgb(var(--content-secondary))' }} />
              <ReferenceLine y={95} stroke="#22C55E" strokeDasharray="6 3" label={{ value: '95% target', fill: '#22C55E', fontSize: 10, position: 'right' }} />
              <defs>
                <linearGradient id="passGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="passRate" stroke="#22C55E" fill="url(#passGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card hoverable={false} className="p-4">
          <h3 className="text-sm font-semibold mb-4 text-content-primary">Bug Burndown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line-subtle))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgb(var(--content-muted))' }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: 'rgb(var(--content-muted))' }} />
              <Tooltip contentStyle={{ background: 'rgb(var(--surface-secondary))', border: '1px solid rgb(var(--line-default))', borderRadius: 2, fontSize: 12 }} labelStyle={{ color: 'rgb(var(--content-secondary))' }} />
              <Bar dataKey="newDefects" fill="#EF4444" opacity={0.5} barSize={6} name="New Bugs" />
              <Line type="monotone" dataKey="openDefects" stroke="#EAB308" strokeWidth={2} dot={false} name="Open Bugs" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
