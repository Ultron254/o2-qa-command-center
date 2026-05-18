import React from 'react';
import { useStore } from '../../lib/store';
import type { PageId } from '../../lib/types';
import {
  LayoutDashboard, Play, TrendingUp, ChevronDown, Beaker, Settings
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
      {/* Azure DevOps Vertical Icon Rail */}
      <div
        className="w-[46px] h-full flex flex-col items-center py-2 shrink-0"
        style={{ backgroundColor: '#1e1e1e', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
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
              className="w-full flex items-center justify-center py-2.5 relative transition-colors group"
              title={group.title}
              style={{
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-sm"
                  style={{ backgroundColor: '#0078d4' }}
                />
              )}
              <GroupIcon
                size={18}
                strokeWidth={isActive ? 2 : 1.5}
                className="transition-colors group-hover:text-white"
              />
            </button>
          );
        })}

        <div className="flex-1" />

        {/* Bottom project indicator */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#0078d4' }}>
          <span className="text-[9px] font-bold text-white">O2</span>
        </div>
      </div>

      {/* Expanded Navigation Panel */}
      {!sidebarCollapsed && (
        <aside
          className="w-52 h-full flex flex-col overflow-hidden transition-all duration-150"
          style={{ backgroundColor: '#252526', borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Panel Header */}
          <div
            className="flex items-center px-3 h-9 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Test Plans
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
                    className="w-full flex items-center gap-2 px-3 py-[6px] text-left transition-colors hover:bg-[#2a2d2e]"
                    style={{ color: isGroupActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)' }}
                  >
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-150 ${isGroupExpanded ? '' : '-rotate-90'}`}
                      style={{ color: 'rgba(255,255,255,0.3)' }}
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
                            className="w-full flex items-center py-[5px] text-left transition-colors duration-75 text-[12px]"
                            style={{
                              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                              backgroundColor: isActive ? '#37373d' : 'transparent',
                              borderLeft: isActive ? '2px solid #0078d4' : '2px solid transparent',
                              paddingLeft: '14px',
                            }}
                            onMouseEnter={e => {
                              if (!isActive) e.currentTarget.style.backgroundColor = '#2a2d2e';
                            }}
                            onMouseLeave={e => {
                              if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
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

          {/* Bottom: Environment Info (ADO-style) */}
          <div className="px-3 py-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: '#339933' }} />
              <span>MSIT v1 · Production</span>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
