import React, { Suspense, lazy } from 'react';
import { useStore } from './lib/store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/ui/CommandPalette';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import type { PageId } from './lib/types';

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const TestPlans = lazy(() => import('./pages/TestPlans').then(m => ({ default: m.TestPlans })));
const TestSuites = lazy(() => import('./pages/TestSuites').then(m => ({ default: m.TestSuites })));
const TestCases = lazy(() => import('./pages/TestCases').then(m => ({ default: m.TestCases })));
const TestCaseDetail = lazy(() => import('./pages/TestCaseDetail').then(m => ({ default: m.TestCaseDetail })));
const TestRuns = lazy(() => import('./pages/TestRuns').then(m => ({ default: m.TestRuns })));
const TestRunExecution = lazy(() => import('./pages/TestRunExecution').then(m => ({ default: m.TestRunExecution })));
const Defects = lazy(() => import('./pages/Defects').then(m => ({ default: m.Defects })));
const CoverageMatrix = lazy(() => import('./pages/CoverageMatrix').then(m => ({ default: m.CoverageMatrix })));
const TrendReports = lazy(() => import('./pages/TrendReports').then(m => ({ default: m.TrendReports })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const Environments = lazy(() => import('./pages/Environments').then(m => ({ default: m.Environments })));
const Team = lazy(() => import('./pages/Team').then(m => ({ default: m.Team })));
const QAFindings = lazy(() => import('./pages/QAFindings').then(m => ({ default: m.QAFindings })));

const pageComponents: Record<PageId, React.LazyExoticComponent<React.FC>> = {
  'dashboard': Dashboard,
  'test-plans': TestPlans,
  'test-plan-detail': TestPlans,
  'test-suites': TestSuites,
  'test-cases': TestCases,
  'test-case-detail': TestCaseDetail,
  'test-runs': TestRuns,
  'test-run-execution': TestRunExecution,
  'defects': Defects,
  'coverage-matrix': CoverageMatrix,
  'trend-reports': TrendReports,
  'products': Products,
  'environments': Environments,
  'team': Team,
  'qa-findings': QAFindings,
};

const PageSkeleton: React.FC = () => (
  <div className="p-6 space-y-4 animate-fade-in">
    <div className="skeleton h-8 w-48" />
    <div className="skeleton h-4 w-96" />
    <div className="grid grid-cols-4 gap-4 mt-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-24 rounded-lg" />)}
    </div>
    <div className="skeleton h-64 rounded-lg mt-6" />
  </div>
);

function App() {
  const currentPage = useStore(s => s.currentPage);
  const PageComponent = pageComponents[currentPage] || Dashboard;

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-surface-primary overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-hidden">
            <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <PageComponent />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
        <CommandPalette />
      </div>
    </ErrorBoundary>
  );
}

export default App;
