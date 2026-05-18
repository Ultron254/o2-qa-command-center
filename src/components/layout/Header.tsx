import React from 'react';
import { useStore } from '../../lib/store';
import { Search, Bell, Settings, HelpCircle, ChevronRight } from 'lucide-react';
import type { PageId } from '../../lib/types';

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
};

export const Header: React.FC = () => {
  const { currentPage } = useStore();

  return (
    <header className="flex items-center shrink-0" style={{
      height: '40px',
      backgroundColor: '#000000',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Left: Azure DevOps logo + breadcrumb */}
      <div className="flex items-center gap-2 px-3 h-full">
        {/* Azure DevOps icon */}
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M15 3.622v8.512L11.5 15l-5.425-1.975v1.958L3.004 10.97l8.951.7V4.005L15 3.622zm-2.984.428L6.994 1v1.97L1.597 4.727 1 6.095v4.212l2.004.963V5.394l9.012-1.344z" fill="#0078d4"/>
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Azure DevOps</span>
        </div>

        {/* Breadcrumb separator */}
        <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.35)' }} />
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Oxygene</span>
        <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.35)' }} />
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>O2 QA</span>
        <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.35)' }} />
        <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: '13px', fontWeight: 600 }}>
          {pageTitles[currentPage]}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: Search + icons */}
      <div className="flex items-center gap-1 px-2 h-full">
        {/* Search */}
        <div className="relative mr-1">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.4)' }} />
          <input
            type="text"
            placeholder="Search"
            className="pl-7 pr-2 py-1 text-xs rounded-sm outline-none"
            style={{
              width: '180px',
              backgroundColor: '#1b1b1b',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)',
            }}
            readOnly
          />
        </div>

        {/* Action icons */}
        {[HelpCircle, Bell, Settings].map((Icon, i) => (
          <button
            key={i}
            className="w-8 h-8 flex items-center justify-center rounded-sm transition-colors hover:bg-[#1a1a1a]"
          >
            <Icon size={15} style={{ color: 'rgba(255,255,255,0.55)' }} />
          </button>
        ))}

        {/* User avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ml-1"
          style={{ backgroundColor: '#0078d4', color: 'white' }}
        >
          AM
        </div>
      </div>
    </header>
  );
};
