import React from 'react';
import { useStore } from '../../lib/store';
import type { PageId } from '../../lib/types';
import {
  LayoutDashboard, Play, TrendingUp, ChevronDown, Beaker, Settings, ShieldAlert
} from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
}

interface NavGroup {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    items: [
      { id: 'dashboard', label: 'Summary' },
    ],
  },
  {
    title: 'Test Plans',
    icon: Beaker,
    items: [
      { id: 'test-plans', label: 'Test Plans' },
      { id: 'test-suites', label: 'Test Suites' },
      { id: 'test-cases', label: 'Test Cases' },
    ],
  },
  {
    title: 'Execution',
    icon: Play,
    items: [
      { id: 'test-runs', label: 'Runs' },
      { id: 'defects', label: 'Bugs' },
    ],
  },
  {
    title: 'Analytics',
    icon: TrendingUp,
    items: [
      { id: 'coverage-matrix', label: 'Coverage' },
      { id: 'trend-reports', label: 'Progress Report' },
    ],
  },
  {
    title: 'QA Audit',
    icon: ShieldAlert,
    items: [
      { id: 'qa-findings', label: 'QA Findings' },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      { id: 'products', label: 'Products' },
      { id: 'environments', label: 'Environments' },
      { id: 'team', label: 'Team' },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { currentPage, setPage, sidebarCollapsed, toggleSidebar } = useStore();
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(navGroups.map(g => g.title))
  );

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const activeGroup = navGroups.find(g => g.items.some(i => i.id === currentPage));

  return (
    <div className="flex h-screen shrink-0">
      {/* Vertical Icon Rail */}
      <div className="w-[46px] h-full flex flex-col items-center py-2 shrink-0 bg-surface-primary border-r border-line">
        {navGroups.map((group) => {
          const GroupIcon = group.icon;
          const isActive = activeGroup?.title === group.title;
          return (
            <button
              key={group.title}
              onClick={() => {
                if (sidebarCollapsed) toggleSidebar();
                setPage(group.items[0].id);
              }}
              className={`w-full flex items-center justify-center py-2.5 relative transition-colors group ${
                isActive ? 'text-accent' : 'text-content-secondary hover:text-content-primary'
              }`}
              title={group.title}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-sm bg-accent" />
              )}
              <GroupIcon
                size={18}
                strokeWidth={isActive ? 2 : 1.5}
                className="transition-colors group-hover:text-content-primary"
              />
            </button>
          );
        })}

        <div className="flex-1" />

        {/* Bottom project indicator */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center mb-2 bg-accent text-content-inverse">
          <span className="text-[9px] font-bold">O2</span>
        </div>
      </div>

      {/* Expanded Navigation Panel */}
      {!sidebarCollapsed && (
        <aside className="w-52 h-full flex flex-col overflow-hidden transition-all duration-150 bg-surface-secondary border-r border-line">
          {/* Panel Header */}
          <div className="flex items-center px-3 h-9 shrink-0 border-b border-line">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-content-secondary">
              O2 QA Center
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-1">
            {navGroups.map((group) => {
              const isGroupExpanded = expandedGroups.has(group.title);
              const isGroupActive = activeGroup?.title === group.title;

              return (
                <div key={group.title} className="mb-0.5">
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className={`w-full flex items-center gap-2 px-3 py-[6px] text-left transition-colors hover:bg-surface-hover ${
                      isGroupActive ? 'text-content-primary' : 'text-content-secondary'
                    }`}
                  >
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-150 text-content-muted ${isGroupExpanded ? '' : '-rotate-90'}`}
                    />
                    <span className="text-[12px] flex-1 font-medium">{group.title}</span>
                  </button>

                  {isGroupExpanded && (
                    <div className="ml-2">
                      {group.items.map((item) => {
                        const isActive = currentPage === item.id;
                        return (
                          <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            onClick={() => setPage(item.id)}
                            className={`w-full flex items-center py-[5px] pl-3.5 text-left transition-colors duration-75 text-[12px] border-l-2 ${
                              isActive
                                ? 'bg-surface-elevated text-content-primary border-accent'
                                : 'text-content-secondary border-transparent hover:bg-surface-hover'
                            }`}
                          >
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom: Environment Info */}
          <div className="px-3 py-2 shrink-0 border-t border-line">
            <div className="flex items-center gap-1.5 text-[11px] text-content-muted">
              <span className="w-[6px] h-[6px] rounded-full bg-green-500" />
              <span>MSIT v1 · Production</span>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
