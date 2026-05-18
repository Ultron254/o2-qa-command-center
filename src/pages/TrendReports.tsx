import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';

export const TrendReports: React.FC = () => {
  const { trendData, testSuites, getSuiteStats } = useStore();
  const [range, setRange] = useState<30 | 60 | 90>(30);

  const data = trendData.slice(-range);

  const suiteHeatmap = testSuites.map(suite => {
    const stats = getSuiteStats(suite.id);
    const rate = stats.total > 0 ? ((stats.pass / stats.total) * 100) : 0;
    return { id: suite.id, name: suite.name, rate: Math.round(rate), total: stats.total, pass: stats.pass };
  });

  return (
    <div className="p-5 h-full overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
          <TrendingUp size={18} style={{ color: '#0078d4' }} /> Progress Report
        </h2>
        <div className="flex items-center gap-0.5 p-0.5 rounded-sm" style={{ backgroundColor: '#2d2d2d' }}>
          {([30, 60, 90] as const).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="px-3 py-1 text-xs rounded-sm transition-colors"
              style={{
                backgroundColor: range === r ? '#0078d4' : 'transparent',
                color: range === r ? 'white' : 'rgba(255,255,255,0.65)',
              }}>
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <Card hoverable={false} className="p-4">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>Pass Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={v => v.slice(5)} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#252526', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2, fontSize: 12 }} />
              <ReferenceLine y={95} stroke="#339933" strokeDasharray="6 3" />
              <defs>
                <linearGradient id="passGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#339933" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#339933" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="passRate" stroke="#339933" fill="url(#passGrad2)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card hoverable={false} className="p-4">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>Bugs: Created vs Resolved</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
              <Tooltip contentStyle={{ background: '#252526', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2, fontSize: 12 }} />
              <Bar dataKey="newDefects" fill="#e81123" opacity={0.6} barSize={6} name="Created" />
              <Bar dataKey="resolvedDefects" fill="#339933" opacity={0.6} barSize={6} name="Resolved" />
              <Line type="monotone" dataKey="openDefects" stroke="#f2c811" strokeWidth={2} dot={false} name="Open" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card hoverable={false} className="p-4">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>Execution Velocity (Cases/Day)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
              <Tooltip contentStyle={{ background: '#252526', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2, fontSize: 12 }} />
              <Bar dataKey="casesExecuted" fill="#0078d4" opacity={0.7} barSize={8} name="Cases Executed" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card hoverable={false} className="p-4">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>Suite Pass Rate</h3>
          <div className="space-y-1.5">
            {suiteHeatmap.map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-xs w-40 truncate text-right" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.name}</span>
                <div className="flex-1 h-5 overflow-hidden relative" style={{ backgroundColor: '#1b1b1b' }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.max(s.rate, 2)}%`,
                      backgroundColor: s.rate >= 90 ? 'rgba(51,153,51,0.5)' : s.rate >= 70 ? 'rgba(242,200,17,0.4)' : 'rgba(232,17,35,0.4)',
                    }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {s.rate}% ({s.pass}/{s.total})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
