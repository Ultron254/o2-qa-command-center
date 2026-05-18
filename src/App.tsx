import React from 'react';
import { useStore } from './lib/store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { TestPlans } from './pages/TestPlans';
import { TestSuites } from './pages/TestSuites';
import { TestCases } from './pages/TestCases';
import { TestCaseDetail } from './pages/TestCaseDetail';
import { TestRuns } from './pages/TestRuns';
import { TestRunExecution } from './pages/TestRunExecution';
import { Defects } from './pages/Defects';
import { CoverageMatrix } from './pages/CoverageMatrix';
import { TrendReports } from './pages/TrendReports';
import { Products } from './pages/Products';
import { Environments } from './pages/Environments';
import { Team } from './pages/Team';
import type { PageId } from './lib/types';

const pageComponents: Record<PageId, React.FC> = {
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
};

function App() {
  const currentPage = useStore(s => s.currentPage);
  const PageComponent = pageComponents[currentPage] || Dashboard;

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}

export default App;
