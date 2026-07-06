import React from 'react';
import { useStore } from '../../lib/store';
import { Search, Bell, Settings, HelpCircle, ChevronRight, Sun, Moon, Monitor } from 'lucide-react';
import type { PageId } from '../../lib/types';
import type { ThemeId } from '../../lib/types';

const pageTitles: Record<PageId, string> = {
  'dashboard': 'Summary',
  'test-plans': 'Test Plans',
  'test-plan-detail': 'Test Plan Detail',
  'test-suites': 'Test Suites',
  'test-cases': 'Test Cases',
  'test-case-detail': 'Test Case Detail',
  'test-runs': 'Runs',
  'test-run-execution': 'Run Execution',
  'defects': 'Bugs',
  'coverage-matrix': 'Coverage',
  'trend-reports': 'Progress Report',
  'products': 'Products',
  'environments': 'Environments',
  'team': 'Team',
  'qa-findings': 'QA Findings',
};

const themeOptions: { id: ThemeId; icon: React.ElementType; label: string }[] = [
  { id: 'oxygene', icon: Sun, label: 'Oxygene' },
  { id: 'light', icon: Monitor, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' },
];

export const Header: React.FC = () => {
  const { currentPage, theme, setTheme } = useStore();

  return (
    <header className="flex items-center shrink-0 h-10 bg-surface-header border-b border-line">
      {/* Left: Oxygene branding + breadcrumb */}
      <div className="flex items-center gap-2 px-3 h-full">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white leading-none">O2</span>
          </div>
          <span className="text-[13px] text-content-secondary">Oxygene</span>
        </div>

        <ChevronRight size={12} className="text-content-muted" />
        <span className="text-[13px] text-content-secondary">O2 QA</span>
        <ChevronRight size={12} className="text-content-muted" />
        <span className="text-[13px] font-semibold text-content-primary">
          {pageTitles[currentPage]}
        </span>
      </div>

      <div className="flex-1" />

      {/* Right: Search + theme toggle + icons */}
      <div className="flex items-center gap-1 px-2 h-full">
        {/* Search trigger - opens Cmd+K palette */}
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          className="relative mr-1 flex items-center gap-2 pl-7 pr-2 py-1 text-xs rounded-sm w-[200px] bg-surface-inset border border-line text-content-muted hover:border-line-strong transition-colors text-left"
        >
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2" />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-surface-elevated px-1 rounded">Ctrl+K</kbd>
        </button>

        {/* Theme toggle */}
        <div className="flex items-center rounded-md border border-line overflow-hidden mr-1">
          {themeOptions.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              title={label}
              className={`w-7 h-6 flex items-center justify-center transition-colors ${
                theme === id
                  ? 'bg-accent text-content-inverse'
                  : 'text-content-secondary hover:bg-surface-hover'
              }`}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>

        {/* Action icons */}
        {[HelpCircle, Bell, Settings].map((Icon, i) => (
          <button
            key={i}
            className="w-8 h-8 flex items-center justify-center rounded-sm transition-colors hover:bg-surface-hover text-content-secondary"
          >
            <Icon size={15} />
          </button>
        ))}

        {/* User avatar */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ml-1 bg-accent text-content-inverse" title="Ultron QA">
          UQ
        </div>
      </div>
    </header>
  );
};
