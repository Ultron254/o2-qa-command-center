import React, { useMemo, useState } from 'react';
import {
  ShieldAlert, Search, ChevronDown, ChevronRight, GitBranch,
  MapPin, User, AlertTriangle, XCircle, CheckCircle2, FolderGit2,
} from 'lucide-react';
import {
  qaFindings, qaServiceSummaries, qaAuditMeta,
  type QAFinding, type QASeverity, type QAProduct,
} from '../lib/qa-findings';

const severityOrder: QASeverity[] = ['critical', 'high', 'medium', 'low', 'info'];

const severityStyles: Record<QASeverity, string> = {
  critical: 'bg-status-fail/10 text-status-fail border-status-fail/30',
  high: 'bg-oxygene/10 text-oxygene border-oxygene/30',
  medium: 'bg-status-blocked/10 text-status-blocked border-status-blocked/30',
  low: 'bg-accent/10 text-accent border-accent/30',
  info: 'bg-surface-elevated text-content-muted border-line',
};

const severityDot: Record<QASeverity, string> = {
  critical: 'bg-status-fail',
  high: 'bg-oxygene',
  medium: 'bg-status-blocked',
  low: 'bg-accent',
  info: 'bg-content-muted',
};

const SeverityPill: React.FC<{ severity: QASeverity }> = ({ severity }) => (
  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide border ${severityStyles[severity]}`}>
    {severity}
  </span>
);

const StatCard: React.FC<{ label: string; value: React.ReactNode; accent?: string; sub?: string }> = ({ label, value, accent, sub }) => (
  <div className="card p-4 flex flex-col gap-1">
    <span className="text-[11px] uppercase tracking-wider text-content-muted">{label}</span>
    <span className={`text-2xl font-semibold ${accent ?? 'text-content-primary'}`}>{value}</span>
    {sub && <span className="text-[11px] text-content-muted">{sub}</span>}
  </div>
);

export const QAFindings: React.FC = () => {
  const [search, setSearch] = useState('');
  const [product, setProduct] = useState<QAProduct | ''>('');
  const [severity, setSeverity] = useState<QASeverity | ''>('');
  const [repo, setRepo] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showEnvPanel, setShowEnvPanel] = useState(true);

  const repos = useMemo(
    () => Array.from(new Set(qaFindings.map(f => f.repo))).sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return qaFindings
      .filter(f => (product ? f.product === product : true))
      .filter(f => (severity ? f.severity === severity : true))
      .filter(f => (repo ? f.repo === repo : true))
      .filter(f =>
        q
          ? [f.title, f.issue, f.actual, f.expected, f.location, f.author, f.id]
              .join(' ')
              .toLowerCase()
              .includes(q)
          : true
      )
      .sort(
        (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
      );
  }, [search, product, severity, repo]);

  const counts = useMemo(() => {
    const bySeverity: Record<QASeverity, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    qaFindings.forEach(f => { bySeverity[f.severity]++; });
    const msit = qaFindings.filter(f => f.product === 'MSIT').length;
    const imt = qaFindings.filter(f => f.product === 'IMT').length;
    return { bySeverity, msit, imt };
  }, []);

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allExpanded = filtered.length > 0 && filtered.every(f => expanded.has(f.id));
  const toggleAll = () =>
    setExpanded(allExpanded ? new Set() : new Set(filtered.map(f => f.id)));

  return (
    <div className="h-full overflow-y-auto animate-fade-in">
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 text-content-primary">
              <ShieldAlert size={22} className="text-oxygene" /> QA Findings
            </h2>
            <p className="text-sm text-content-secondary mt-1 max-w-2xl">
              External QA audit of the MSIT and IMT repositories in the{' '}
              <span className="font-medium text-content-primary">{qaAuditMeta.org}</span> organization.
              {' '}{qaAuditMeta.method}
            </p>
            <p className="text-[11px] text-content-muted mt-1">
              Audited {qaAuditMeta.auditedOn} · {qaAuditMeta.totalRepos} repositories · {qaFindings.length} findings
            </p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard label="Total" value={qaFindings.length} sub={`${counts.msit} MSIT · ${counts.imt} IMT`} />
          <StatCard label="Critical" value={counts.bySeverity.critical} accent="text-status-fail" />
          <StatCard label="High" value={counts.bySeverity.high} accent="text-oxygene" />
          <StatCard label="Medium" value={counts.bySeverity.medium} accent="text-status-blocked" />
          <StatCard label="Low" value={counts.bySeverity.low} accent="text-accent" />
          <StatCard label="MSIT" value={counts.msit} sub="4 services" />
          <StatCard label="IMT" value={counts.imt} sub="2 services" />
        </div>

        {/* Service / environment summary */}
        <div className="card">
          <button
            onClick={() => setShowEnvPanel(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold flex items-center gap-2 text-content-primary">
              <FolderGit2 size={16} className="text-accent" /> Repositories & test-run summary
            </span>
            {showEnvPanel ? <ChevronDown size={16} className="text-content-muted" /> : <ChevronRight size={16} className="text-content-muted" />}
          </button>
          {showEnvPanel && (
            <div className="border-t border-line overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="table-header text-left">Repository</th>
                    <th className="table-header text-left w-20">Product</th>
                    <th className="table-header text-left">Stack</th>
                    <th className="table-header text-left">Branches audited</th>
                    <th className="table-header text-left">Local test run</th>
                  </tr>
                </thead>
                <tbody>
                  {qaServiceSummaries.map(s => (
                    <tr key={s.repo} className="border-t border-line">
                      <td className="table-cell mono-id whitespace-nowrap">{s.repo}</td>
                      <td className="table-cell">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${s.product === 'MSIT' ? 'bg-accent/10 text-accent' : 'bg-oxygene/10 text-oxygene'}`}>
                          {s.product}
                        </span>
                      </td>
                      <td className="table-cell text-content-secondary text-xs">{s.stack}</td>
                      <td className="table-cell text-content-secondary text-xs">{s.branchesAudited}</td>
                      <td className="table-cell text-content-muted text-xs">{s.testRun}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              className="input pl-8 w-full"
              placeholder="Search findings, files, authors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input" value={product} onChange={e => setProduct(e.target.value as QAProduct | '')}>
            <option value="">All Products</option>
            <option value="MSIT">MSIT</option>
            <option value="IMT">IMT</option>
          </select>
          <select className="input" value={severity} onChange={e => setSeverity(e.target.value as QASeverity | '')}>
            <option value="">All Severities</option>
            {severityOrder.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <select className="input max-w-[220px]" value={repo} onChange={e => setRepo(e.target.value)}>
            <option value="">All Repositories</option>
            {repos.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="flex-1" />
          <span className="text-xs text-content-muted">{filtered.length} shown</span>
          <button onClick={toggleAll} className="btn-ghost text-xs">
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        </div>

        {/* Findings list */}
        <div className="space-y-2 pb-8">
          {filtered.length === 0 && (
            <div className="card p-10 text-center text-content-muted text-sm">
              No findings match the current filters.
            </div>
          )}
          {filtered.map(f => (
            <FindingRow key={f.id} finding={f} open={expanded.has(f.id)} onToggle={() => toggle(f.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FindingRow: React.FC<{ finding: QAFinding; open: boolean; onToggle: () => void }> = ({ finding: f, open, onToggle }) => (
  <div className="card overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-hover transition-colors">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${severityDot[f.severity]}`} />
      {open ? <ChevronDown size={15} className="text-content-muted shrink-0" /> : <ChevronRight size={15} className="text-content-muted shrink-0" />}
      <span className="mono-id text-xs shrink-0 w-28">{f.id}</span>
      <SeverityPill severity={f.severity} />
      <span className="text-sm text-content-primary flex-1 min-w-0 truncate">{f.title}</span>
      <span className={`hidden md:inline text-[10px] px-2 py-0.5 rounded font-semibold shrink-0 ${f.product === 'MSIT' ? 'bg-accent/10 text-accent' : 'bg-oxygene/10 text-oxygene'}`}>
        {f.product}
      </span>
      <span className="hidden lg:flex items-center gap-1 text-[11px] text-content-muted shrink-0">
        <GitBranch size={11} /> {f.branch}
      </span>
    </button>

    {open && (
      <div className="border-t border-line px-4 py-4 space-y-4 bg-surface-inset/40">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-content-muted">
          <span className="mono-id text-content-secondary">{f.repo}</span>
          <span className="flex items-center gap-1"><MapPin size={11} /> {f.location}</span>
          <span className="flex items-center gap-1"><User size={11} /> {f.author}</span>
        </div>

        <Section icon={<AlertTriangle size={13} className="text-status-blocked" />} title="1. Identified issue / how to reproduce" text={f.issue} />
        <Section icon={<XCircle size={13} className="text-status-fail" />} title="2. Actual result" text={f.actual} tone="fail" />
        <Section icon={<CheckCircle2 size={13} className="text-status-pass" />} title="3. Expected result" text={f.expected} tone="pass" />
      </div>
    )}
  </div>
);

const Section: React.FC<{ icon: React.ReactNode; title: string; text: string; tone?: 'fail' | 'pass' }> = ({ icon, title, text, tone }) => (
  <div>
    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-content-secondary mb-1">
      {icon} {title}
    </div>
    <p className={`text-[13px] leading-relaxed ${tone === 'fail' ? 'text-status-fail' : tone === 'pass' ? 'text-status-pass' : 'text-content-secondary'}`}>
      {text}
    </p>
  </div>
);
