import React, { useMemo, useState } from 'react';
import {
  Globe, Search, ChevronDown, ChevronRight, ExternalLink,
  MapPin, Tag, AlertTriangle, XCircle, CheckCircle2, MonitorSmartphone,
} from 'lucide-react';
import {
  websiteFindings, websiteSummaries, websiteAuditMeta,
  type WebsiteFinding, type WebSeverity, type WebSite, type WebCategory,
} from '../lib/website-findings';

const severityOrder: WebSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];

const severityStyles: Record<WebSeverity, string> = {
  critical: 'bg-status-fail/10 text-status-fail border-status-fail/30',
  high: 'bg-oxygene/10 text-oxygene border-oxygene/30',
  medium: 'bg-status-blocked/10 text-status-blocked border-status-blocked/30',
  low: 'bg-accent/10 text-accent border-accent/30',
  info: 'bg-surface-elevated text-content-muted border-line',
};

const severityDot: Record<WebSeverity, string> = {
  critical: 'bg-status-fail',
  high: 'bg-oxygene',
  medium: 'bg-status-blocked',
  low: 'bg-accent',
  info: 'bg-content-muted',
};

const siteBadge: Record<WebSite, string> = {
  NBK: 'bg-accent/10 text-accent',
  NDSI: 'bg-status-pass/10 text-status-pass',
};

const SeverityPill: React.FC<{ severity: WebSeverity }> = ({ severity }) => (
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

export const WebsiteFindings: React.FC = () => {
  const [search, setSearch] = useState('');
  const [site, setSite] = useState<WebSite | ''>('');
  const [severity, setSeverity] = useState<WebSeverity | ''>('');
  const [category, setCategory] = useState<WebCategory | ''>('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showEnvPanel, setShowEnvPanel] = useState(true);

  const categories = useMemo(
    () => Array.from(new Set(websiteFindings.map(f => f.category))).sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return websiteFindings
      .filter(f => (site ? f.site === site : true))
      .filter(f => (severity ? f.severity === severity : true))
      .filter(f => (category ? f.category === category : true))
      .filter(f =>
        q
          ? [f.title, f.issue, f.actual, f.expected, f.location, f.page, f.id]
              .join(' ')
              .toLowerCase()
              .includes(q)
          : true
      )
      .sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity));
  }, [search, site, severity, category]);

  const counts = useMemo(() => {
    const bySeverity: Record<WebSeverity, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    websiteFindings.forEach(f => { bySeverity[f.severity]++; });
    const nbk = websiteFindings.filter(f => f.site === 'NBK').length;
    const ndsi = websiteFindings.filter(f => f.site === 'NDSI').length;
    return { bySeverity, nbk, ndsi };
  }, []);

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allExpanded = filtered.length > 0 && filtered.every(f => expanded.has(f.id));
  const toggleAll = () => setExpanded(allExpanded ? new Set() : new Set(filtered.map(f => f.id)));

  return (
    <div className="h-full overflow-y-auto animate-fade-in">
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 text-content-primary">
              <Globe size={22} className="text-accent" /> Website Findings
            </h2>
            <p className="text-sm text-content-secondary mt-1 max-w-3xl">
              End-to-end QA of two live Oxygene-hosted websites — full page-by-page, button-by-button
              walkthroughs at desktop and mobile. {websiteAuditMeta.method}
            </p>
            <p className="text-[11px] text-content-muted mt-1">
              Audited {websiteAuditMeta.auditedOn} · {websiteAuditMeta.sitesTested} sites · {websiteAuditMeta.pagesCrawled} pages crawled · {websiteFindings.length} findings
            </p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard label="Total" value={websiteFindings.length} sub={`${counts.nbk} NBK · ${counts.ndsi} NDSI`} />
          <StatCard label="Critical" value={counts.bySeverity.critical} accent="text-status-fail" />
          <StatCard label="High" value={counts.bySeverity.high} accent="text-oxygene" />
          <StatCard label="Medium" value={counts.bySeverity.medium} accent="text-status-blocked" />
          <StatCard label="Low" value={counts.bySeverity.low} accent="text-accent" />
          <StatCard label="NBK" value={counts.nbk} sub="Joomla" />
          <StatCard label="NDSI" value={counts.ndsi} sub="WordPress" />
        </div>

        {/* Site summary */}
        <div className="card">
          <button
            onClick={() => setShowEnvPanel(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold flex items-center gap-2 text-content-primary">
              <MonitorSmartphone size={16} className="text-accent" /> Sites tested & crawl summary
            </span>
            {showEnvPanel ? <ChevronDown size={16} className="text-content-muted" /> : <ChevronRight size={16} className="text-content-muted" />}
          </button>
          {showEnvPanel && (
            <div className="border-t border-line overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="table-header text-left w-20">Site</th>
                    <th className="table-header text-left">URL</th>
                    <th className="table-header text-left">Stack</th>
                    <th className="table-header text-left w-24">Pages</th>
                    <th className="table-header text-left">Crawl result</th>
                  </tr>
                </thead>
                <tbody>
                  {websiteSummaries.map(s => (
                    <tr key={s.site} className="border-t border-line">
                      <td className="table-cell">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${siteBadge[s.site]}`}>{s.site}</span>
                      </td>
                      <td className="table-cell">
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline inline-flex items-center gap-1 text-xs">
                          {s.url} <ExternalLink size={11} />
                        </a>
                      </td>
                      <td className="table-cell text-content-secondary text-xs">{s.stack}</td>
                      <td className="table-cell text-content-secondary text-xs">{s.pagesCrawled}</td>
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
              placeholder="Search findings, pages, locations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input" value={site} onChange={e => setSite(e.target.value as WebSite | '')}>
            <option value="">All Sites</option>
            <option value="NBK">NBK</option>
            <option value="NDSI">NDSI</option>
          </select>
          <select className="input" value={severity} onChange={e => setSeverity(e.target.value as WebSeverity | '')}>
            <option value="">All Severities</option>
            {severityOrder.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <select className="input max-w-[200px]" value={category} onChange={e => setCategory(e.target.value as WebCategory | '')}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
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

const FindingRow: React.FC<{ finding: WebsiteFinding; open: boolean; onToggle: () => void }> = ({ finding: f, open, onToggle }) => (
  <div className="card overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-hover transition-colors">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${severityDot[f.severity]}`} />
      {open ? <ChevronDown size={15} className="text-content-muted shrink-0" /> : <ChevronRight size={15} className="text-content-muted shrink-0" />}
      <span className="mono-id text-xs shrink-0 w-32">{f.id}</span>
      <SeverityPill severity={f.severity} />
      <span className="text-sm text-content-primary flex-1 min-w-0 truncate">{f.title}</span>
      <span className={`hidden md:inline text-[10px] px-2 py-0.5 rounded font-semibold shrink-0 ${siteBadge[f.site]}`}>
        {f.site}
      </span>
      <span className="hidden lg:flex items-center gap-1 text-[11px] text-content-muted shrink-0">
        <Tag size={11} /> {f.category}
      </span>
    </button>

    {open && (
      <div className="border-t border-line px-4 py-4 space-y-4 bg-surface-inset/40">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-content-muted">
          <span className="flex items-center gap-1"><Globe size={11} /> {f.page}</span>
          <span className="flex items-center gap-1"><MapPin size={11} /> {f.location}</span>
          <span className="flex items-center gap-1"><Tag size={11} /> {f.category}</span>
        </div>

        <Section icon={<AlertTriangle size={13} className="text-status-blocked" />} title="1. Identified issue / how to reproduce" text={f.issue} />
        <Section icon={<XCircle size={13} className="text-status-fail" />} title="2. Actual result" text={f.actual} tone="fail" />
        <Section icon={<CheckCircle2 size={13} className="text-status-pass" />} title="3. Expected result" text={f.expected} tone="pass" />

        {/* Screenshot evidence */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-content-secondary mb-2">
            <MonitorSmartphone size={13} className="text-accent" /> Screenshot evidence
          </div>
          <a href={`${import.meta.env.BASE_URL}${f.screenshot}`} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={`${import.meta.env.BASE_URL}${f.screenshot}`}
              alt={`Evidence for ${f.id}: ${f.title}`}
              loading="lazy"
              className="rounded-md border border-line max-h-[420px] w-auto hover:opacity-90 transition-opacity"
            />
          </a>
          <p className="text-[10px] text-content-muted mt-1">Click to open full-size · captured with Playwright ({f.site === 'NDSI' && f.id === 'WEB-NDSI-05' ? '390px mobile viewport' : '1440px desktop viewport'})</p>
        </div>
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
