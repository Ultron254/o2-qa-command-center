import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { formatDateTime, formatRelativeTime, getPassRateColor } from '../lib/formatters';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Bar, ComposedChart, ReferenceLine } from 'recharts';
import { Activity, Bug, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';

const activityColors: Record<string, string> = {
  test_run: 'bg-azure-blue',
  defect_logged: 'bg-wit-bug',
  case_updated: 'bg-azure-blue-text',
  case_created: 'bg-status-pass',
  plan_created: 'bg-wit-story',
  run_completed: 'bg-status-pass',
  defect_resolved: 'bg-wit-feature',
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

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full animate-fade-in">
      {/* Row 1: Health Bar */}
      <Card hoverable={false} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-8">
            <div>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Total Test Cases</div>
              <div className="text-4xl font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>{total}</div>
            </div>
            <div className="w-px h-12" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Pass Rate</div>
              <div className={`text-4xl font-semibold ${getPassRateColor(passRate)}`}>
                {passRate.toFixed(1)}%
              </div>
            </div>
            <div className="w-px h-12" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-lg" style={{ color: '#339933' }}>{statusCounts.pass}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Passed</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg" style={{ color: '#e81123' }}>{statusCounts.fail}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Failed</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg" style={{ color: '#f2c811' }}>{statusCounts.blocked}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Blocked</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>{statusCounts.not_run}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Not Run</div>
              </div>
            </div>
          </div>
          <div className="text-right text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
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
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
              <Activity size={16} style={{ color: '#0078d4' }} />
              Execution by Suite
            </h3>
            <div className="space-y-0.5 max-h-[340px] overflow-y-auto">
              {testSuites.map(suite => {
                const stats = getSuiteStats(suite.id);
                const expanded = expandedSuites.has(suite.id);
                const suiteCases = testCases.filter(tc => tc.suiteId === suite.id);
                return (
                  <div key={suite.id}>
                    <button onClick={() => toggleSuite(suite.id)} className="w-full flex items-center gap-2 py-2 px-2 rounded-sm hover:bg-[#2a2d2e] transition-colors group">
                      {expanded ? <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.45)' }} /> : <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.45)' }} />}
                      <span className="text-sm flex-1 text-left truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{suite.name}</span>
                      <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>{stats.pass}/{stats.total}</span>
                      <div className="w-24">
                        <ProgressBar pass={stats.pass} fail={stats.fail} blocked={stats.blocked} skip={stats.skip} notRun={stats.notRun} height="h-1.5" />
                      </div>
                    </button>
                    {expanded && (
                      <div className="ml-7 mb-2 space-y-0.5">
                        {suiteCases.map(tc => (
                          <div key={tc.id} className="flex items-center gap-2 py-1 px-2 text-xs rounded-sm hover:bg-[#2a2d2e] cursor-pointer" onClick={() => navigate('test-case-detail', tc.id)}>
                            <StatusBadge status={tc.status} size="sm" />
                            <span className="mono-id">{tc.id}</span>
                            <span className="truncate flex-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{tc.title}</span>
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
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
              <Bug size={16} style={{ color: '#e81123' }} />
              Bug Summary
            </h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-semibold" style={{ color: '#e81123' }}>{openDefects.length}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Open Bugs</div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>By Severity</div>
              {(['critical','high','medium','low'] as const).map(sev => {
                const count = openDefects.filter(d => d.severity === sev).length;
                return (
                  <div key={sev} className="flex items-center justify-between text-sm">
                    <SeverityBadge severity={sev} />
                    <span className="font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>By Status</div>
              {(['new','in_progress','resolved'] as const).map(st => {
                const count = defects.filter(d => d.status === st).length;
                return (
                  <div key={st} className="flex items-center justify-between text-sm">
                    <span className="capitalize" style={{ color: 'rgba(255,255,255,0.65)' }}>{st.replace('_', ' ')}</span>
                    <span className="font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xs uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <AlertTriangle size={12} /> Critical Open
              </div>
              {openDefects.filter(d => d.severity === 'critical' || d.severity === 'high').slice(0, 3).map(d => (
                <div key={d.id} className="py-1.5 text-xs cursor-pointer transition-colors" onClick={() => navigate('defects')}
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#4fc3f7')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}>
                  <span className="mono-id">{d.id}</span> <span>{d.title}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Column C: Recent Activity */}
        <div className="col-span-4">
          <Card hoverable={false} className="p-4 h-full">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
              <Activity size={16} style={{ color: '#0078d4' }} />
              Recent Activity
            </h3>
            <div className="space-y-0 max-h-[340px] overflow-y-auto">
              {activityFeed.map((entry, i) => (
                <div key={entry.id} className="flex gap-3 py-2 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${activityColors[entry.action] || 'bg-[#8a8886]'}`} />
                    {i < activityFeed.length - 1 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>{entry.description}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
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
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>Pass Rate Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={v => v.slice(5)} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#252526', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2, fontSize: 12 }} labelStyle={{ color: 'rgba(255,255,255,0.65)' }} />
              <ReferenceLine y={95} stroke="#339933" strokeDasharray="6 3" label={{ value: '95% target', fill: '#339933', fontSize: 10, position: 'right' }} />
              <defs>
                <linearGradient id="passGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#339933" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#339933" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="passRate" stroke="#339933" fill="url(#passGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card hoverable={false} className="p-4">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>Bug Burndown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
              <Tooltip contentStyle={{ background: '#252526', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2, fontSize: 12 }} labelStyle={{ color: 'rgba(255,255,255,0.65)' }} />
              <Bar dataKey="newDefects" fill="#e81123" opacity={0.5} barSize={6} name="New Bugs" />
              <Line type="monotone" dataKey="openDefects" stroke="#f2c811" strokeWidth={2} dot={false} name="Open Bugs" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
