import React from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { CoverageCell } from '../components/ui/CoverageCell';
import { Grid3X3 } from 'lucide-react';

const testTypeLabels: Record<string, string> = {
  unit: 'Unit', integration: 'Integration', api: 'API', e2e: 'E2E', performance: 'Perf', security: 'Security',
};

export const CoverageMatrix: React.FC = () => {
  const { coverageMatrix } = useStore();
  const testTypes = Object.keys(testTypeLabels);

  const totalCoverage = coverageMatrix.reduce((acc, row) => {
    testTypes.forEach(t => { acc += (row.testTypes[t]?.length || 0) > 0 ? 1 : 0; });
    return acc;
  }, 0);
  const totalCells = coverageMatrix.length * testTypes.length;
  const coveragePct = ((totalCoverage / totalCells) * 100).toFixed(1);

  return (
    <div className="p-5 h-full overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Grid3X3 size={18} className="text-accent" />
          <h2 className="text-base font-semibold text-content-primary">Coverage Matrix</h2>
          <span className="text-sm ml-4 text-content-muted">Requirements vs Test Types</span>
        </div>
        <div className="text-sm">
          <span className="text-content-muted">Overall Coverage: </span>
          <span className={`text-lg font-semibold ${parseFloat(coveragePct) > 70 ? 'text-status-pass' : 'text-status-blocked'}`}>
            {coveragePct}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-4 text-xs text-content-secondary">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3" style={{ backgroundColor: 'rgba(51,153,51,0.25)', border: '1px solid rgba(51,153,51,0.4)' }} /> 3+ cases (covered)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3" style={{ backgroundColor: 'rgba(242,200,17,0.2)', border: '1px solid rgba(242,200,17,0.35)' }} /> 1-2 cases (partial)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3" style={{ backgroundColor: 'rgba(232,17,35,0.15)', border: '1px solid rgba(232,17,35,0.3)' }} /> 0 cases (gap)</div>
      </div>

      <Card hoverable={false} className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header text-left w-48">Feature / Requirement</th>
              {testTypes.map(t => (
                <th key={t} className="table-header text-center w-24">{testTypeLabels[t]}</th>
              ))}
              <th className="table-header text-center w-20">Total</th>
            </tr>
          </thead>
          <tbody>
            {coverageMatrix.map(row => {
              const rowTotal = testTypes.reduce((sum, t) => sum + (row.testTypes[t]?.length || 0), 0);
              return (
                <tr key={row.featureId} className="border-b border-line-subtle">
                  <td className="px-3 py-2.5 text-sm font-medium text-content-secondary">{row.feature}</td>
                  {testTypes.map(t => (
                    <CoverageCell key={t} count={row.testTypes[t]?.length || 0} />
                  ))}
                  <td className="px-3 py-2 text-center text-sm font-mono text-content-secondary">{rowTotal}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-surface-elevated">
              <td className="px-3 py-2.5 text-sm font-semibold text-content-secondary">Column Total</td>
              {testTypes.map(t => {
                const colTotal = coverageMatrix.reduce((sum, row) => sum + (row.testTypes[t]?.length || 0), 0);
                return <td key={t} className="px-3 py-2.5 text-center text-sm font-mono font-semibold text-content-secondary">{colTotal}</td>;
              })}
              <td className="px-3 py-2.5 text-center text-sm font-mono font-bold text-accent">
                {coverageMatrix.reduce((sum, row) => sum + testTypes.reduce((s, t) => s + (row.testTypes[t]?.length || 0), 0), 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  );
};
