import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../../lib/store';
import { Search, FileText, Bug, ClipboardList, FlaskConical, Box, Server, Users, BarChart3, Grid3X3 } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  category: string;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { navigate, testCases, defects, testPlans, products, testRuns } = useStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const pageItems: CommandItem[] = useMemo(() => [
    { id: 'nav-dashboard', label: 'Dashboard', icon: BarChart3, category: 'Pages', action: () => navigate('dashboard') },
    { id: 'nav-plans', label: 'Test Plans', icon: ClipboardList, category: 'Pages', action: () => navigate('test-plans') },
    { id: 'nav-suites', label: 'Test Suites', icon: ClipboardList, category: 'Pages', action: () => navigate('test-suites') },
    { id: 'nav-cases', label: 'Test Cases', icon: FileText, category: 'Pages', action: () => navigate('test-cases') },
    { id: 'nav-runs', label: 'Test Runs', icon: FlaskConical, category: 'Pages', action: () => navigate('test-runs') },
    { id: 'nav-defects', label: 'Defects', icon: Bug, category: 'Pages', action: () => navigate('defects') },
    { id: 'nav-coverage', label: 'Coverage Matrix', icon: Grid3X3, category: 'Pages', action: () => navigate('coverage-matrix') },
    { id: 'nav-trends', label: 'Trend Reports', icon: BarChart3, category: 'Pages', action: () => navigate('trend-reports') },
    { id: 'nav-products', label: 'Products', icon: Box, category: 'Pages', action: () => navigate('products') },
    { id: 'nav-environments', label: 'Environments', icon: Server, category: 'Pages', action: () => navigate('environments') },
    { id: 'nav-team', label: 'Team', icon: Users, category: 'Pages', action: () => navigate('team') },
  ], [navigate]);

  const entityItems: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [];
    testCases.slice(0, 50).forEach(tc => {
      items.push({
        id: `tc-${tc.id}`,
        label: tc.title,
        description: tc.id,
        icon: FileText,
        category: 'Test Cases',
        action: () => navigate('test-case-detail', tc.id),
      });
    });
    defects.forEach(d => {
      items.push({
        id: `def-${d.id}`,
        label: d.title,
        description: d.id,
        icon: Bug,
        category: 'Defects',
        action: () => navigate('defects'),
      });
    });
    testPlans.forEach(p => {
      items.push({
        id: `plan-${p.id}`,
        label: p.name,
        description: p.id,
        icon: ClipboardList,
        category: 'Test Plans',
        action: () => navigate('test-plan-detail', p.id),
      });
    });
    testRuns.forEach(r => {
      items.push({
        id: `run-${r.id}`,
        label: r.name,
        description: r.id,
        icon: FlaskConical,
        category: 'Test Runs',
        action: () => navigate('test-run-execution', r.id),
      });
    });
    products.forEach(p => {
      items.push({
        id: `prod-${p.id}`,
        label: p.name,
        description: `v${p.version}`,
        icon: Box,
        category: 'Products',
        action: () => navigate('products'),
      });
    });
    return items;
  }, [testCases, defects, testPlans, testRuns, products, navigate]);

  const allItems = useMemo(() => [...pageItems, ...entityItems], [pageItems, entityItems]);

  const filtered = useMemo(() => {
    if (!query.trim()) return pageItems;
    const q = query.toLowerCase();
    return allItems.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [query, allItems, pageItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(filtered.length - 1, i + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(0, i - 1)); }
    if (e.key === 'Enter' && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
      setOpen(false);
    }
  };

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!open) return null;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-surface-overlay/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-surface-primary border border-line rounded-xl shadow-float overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <Search size={16} className="text-content-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, test cases, defects..."
            className="flex-1 py-3 text-sm bg-transparent text-content-primary placeholder:text-content-muted outline-none"
          />
          <kbd className="text-[10px] text-content-muted bg-surface-elevated px-1.5 py-0.5 rounded font-mono">ESC</kbd>
        </div>
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-content-muted">No results found</div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-content-muted px-2 py-1.5">{category}</div>
                {items.map(item => {
                  const idx = filtered.indexOf(item);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm ${
                        idx === selectedIndex ? 'bg-accent text-content-inverse' : 'text-content-primary hover:bg-surface-hover'
                      }`}
                      onClick={() => { item.action(); setOpen(false); }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <Icon size={14} className="shrink-0 opacity-60" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.description && (
                        <span className={`text-xs font-mono ${idx === selectedIndex ? 'opacity-70' : 'text-content-muted'}`}>
                          {item.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-line bg-surface-secondary/50 text-[10px] text-content-muted">
          <span>Type to search across all entities</span>
          <div className="flex gap-2">
            <span><kbd className="font-mono bg-surface-elevated px-1 rounded">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono bg-surface-elevated px-1 rounded">↵</kbd> select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
