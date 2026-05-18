import { create } from 'zustand';
import type { PageId, TestCase, TestSuite, TestPlan, TestRun, Defect, Product, Environment, TeamMember, TestCaseFilters, DefectFilters, TestStatus, ActivityEntry, TrendDataPoint, CoverageMapping, TestStep } from './types';
import { allTestCases, testRuns as seedRuns, defects as seedDefects, testSuites as seedSuites, testPlans as seedPlans, products as seedProducts, environments as seedEnvs, teamMembers as seedTeam, activityFeed as seedActivity, trendData as seedTrend, coverageMatrix as seedCoverage } from './data';

interface AppState {
  // Navigation
  currentPage: PageId;
  selectedTestCaseId: string | null;
  selectedTestPlanId: string | null;
  selectedTestRunId: string | null;
  selectedSuiteId: string | null;
  sidebarCollapsed: boolean;

  // Data
  testCases: TestCase[];
  testSuites: TestSuite[];
  testPlans: TestPlan[];
  testRuns: TestRun[];
  defects: Defect[];
  products: Product[];
  environments: Environment[];
  teamMembers: TeamMember[];
  activityFeed: ActivityEntry[];
  trendData: TrendDataPoint[];
  coverageMatrix: CoverageMapping[];

  // Filters
  testCaseFilters: TestCaseFilters;
  defectFilters: DefectFilters;

  // Test Execution
  activeRunId: string | null;
  activeRunCaseIndex: number;

  // Actions
  setPage: (page: PageId) => void;
  navigate: (page: PageId, id?: string) => void;
  toggleSidebar: () => void;
  setSelectedTestCase: (id: string | null) => void;
  setSelectedTestPlan: (id: string | null) => void;
  setSelectedTestRun: (id: string | null) => void;
  setSelectedSuite: (id: string | null) => void;

  // Filter actions
  setTestCaseFilter: <K extends keyof TestCaseFilters>(key: K, value: TestCaseFilters[K]) => void;
  clearTestCaseFilters: () => void;
  setDefectFilter: <K extends keyof DefectFilters>(key: K, value: DefectFilters[K]) => void;
  clearDefectFilters: () => void;

  // CRUD
  addDefect: (defect: Defect) => void;
  updateDefect: (id: string, updates: Partial<Defect>) => void;
  updateTestCaseStatus: (id: string, status: TestStatus) => void;

  // Test execution
  startTestRun: (run: TestRun) => void;
  setActiveRunCaseIndex: (index: number) => void;
  updateExecutionStep: (caseId: string, stepNumber: number, updates: Partial<TestStep>) => void;
  completeTestRun: (runId: string) => void;

  // Computed
  getFilteredTestCases: () => TestCase[];
  getFilteredDefects: () => Defect[];
  getSuiteTestCases: (suiteId: string) => TestCase[];
  getPassRate: () => number;
  getStatusCounts: () => Record<TestStatus, number>;
  getSuiteStats: (suiteId: string) => { total: number; pass: number; fail: number; blocked: number; skip: number; notRun: number };
}

const defaultTestCaseFilters: TestCaseFilters = { search: '', suiteId: null, type: null, priority: null, status: null };
const defaultDefectFilters: DefectFilters = { search: '', severity: null, priority: null, status: null };

export const useStore = create<AppState>((set, get) => ({
  // Navigation
  currentPage: 'dashboard',
  selectedTestCaseId: null,
  selectedTestPlanId: null,
  selectedTestRunId: null,
  selectedSuiteId: null,
  sidebarCollapsed: false,

  // Data
  testCases: allTestCases,
  testSuites: seedSuites,
  testPlans: seedPlans,
  testRuns: seedRuns,
  defects: seedDefects,
  products: seedProducts,
  environments: seedEnvs,
  teamMembers: seedTeam,
  activityFeed: seedActivity,
  trendData: seedTrend,
  coverageMatrix: seedCoverage,

  // Filters
  testCaseFilters: { ...defaultTestCaseFilters },
  defectFilters: { ...defaultDefectFilters },

  // Test Execution
  activeRunId: null,
  activeRunCaseIndex: 0,

  // Actions
  setPage: (page) => set({ currentPage: page, selectedTestCaseId: null, selectedTestPlanId: null, selectedTestRunId: null }),
  navigate: (page, id) => {
    const updates: Partial<AppState> = { currentPage: page };
    if (page === 'test-case-detail' && id) updates.selectedTestCaseId = id;
    if (page === 'test-plan-detail' && id) updates.selectedTestPlanId = id;
    if (page === 'test-run-execution' && id) { updates.selectedTestRunId = id; updates.activeRunId = id; updates.activeRunCaseIndex = 0; }
    set(updates);
  },
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSelectedTestCase: (id) => set({ selectedTestCaseId: id }),
  setSelectedTestPlan: (id) => set({ selectedTestPlanId: id }),
  setSelectedTestRun: (id) => set({ selectedTestRunId: id }),
  setSelectedSuite: (id) => set({ selectedSuiteId: id }),

  // Filter actions
  setTestCaseFilter: (key, value) => set(s => ({ testCaseFilters: { ...s.testCaseFilters, [key]: value } })),
  clearTestCaseFilters: () => set({ testCaseFilters: { ...defaultTestCaseFilters } }),
  setDefectFilter: (key, value) => set(s => ({ defectFilters: { ...s.defectFilters, [key]: value } })),
  clearDefectFilters: () => set({ defectFilters: { ...defaultDefectFilters } }),

  // CRUD
  addDefect: (defect) => set(s => ({ defects: [...s.defects, defect] })),
  updateDefect: (id, updates) => set(s => ({
    defects: s.defects.map(d => d.id === id ? { ...d, ...updates } : d),
  })),
  updateTestCaseStatus: (id, status) => set(s => ({
    testCases: s.testCases.map(tc => tc.id === id ? { ...tc, status } : tc),
  })),

  // Test execution
  startTestRun: (run) => set(s => ({
    testRuns: [...s.testRuns, run],
    activeRunId: run.id,
    activeRunCaseIndex: 0,
    currentPage: 'test-run-execution',
    selectedTestRunId: run.id,
  })),
  setActiveRunCaseIndex: (index) => set({ activeRunCaseIndex: index }),
  updateExecutionStep: (caseId, stepNumber, updates) => set(s => ({
    testRuns: s.testRuns.map(run => {
      if (run.id !== s.activeRunId) return run;
      return {
        ...run,
        executions: run.executions.map(exec => {
          if (exec.testCaseId !== caseId) return exec;
          return {
            ...exec,
            steps: exec.steps.map(step =>
              step.stepNumber === stepNumber ? { ...step, ...updates } : step
            ),
          };
        }),
      };
    }),
  })),
  completeTestRun: (runId) => set(s => ({
    testRuns: s.testRuns.map(r => r.id === runId ? { ...r, status: 'completed' } : r),
    activeRunId: null,
  })),

  // Computed
  getFilteredTestCases: () => {
    const { testCases, testCaseFilters: f } = get();
    return testCases.filter(tc => {
      if (f.search && !tc.title.toLowerCase().includes(f.search.toLowerCase()) && !tc.id.toLowerCase().includes(f.search.toLowerCase())) return false;
      if (f.suiteId && tc.suiteId !== f.suiteId) return false;
      if (f.type && tc.type !== f.type) return false;
      if (f.priority && tc.priority !== f.priority) return false;
      if (f.status && tc.status !== f.status) return false;
      return true;
    });
  },
  getFilteredDefects: () => {
    const { defects, defectFilters: f } = get();
    return defects.filter(d => {
      if (f.search && !d.title.toLowerCase().includes(f.search.toLowerCase()) && !d.id.toLowerCase().includes(f.search.toLowerCase())) return false;
      if (f.severity && d.severity !== f.severity) return false;
      if (f.priority && d.priority !== f.priority) return false;
      if (f.status && d.status !== f.status) return false;
      return true;
    });
  },
  getSuiteTestCases: (suiteId) => get().testCases.filter(tc => tc.suiteId === suiteId),
  getPassRate: () => {
    const cases = get().testCases;
    const executed = cases.filter(c => c.status !== 'not_run');
    if (executed.length === 0) return 0;
    const passed = executed.filter(c => c.status === 'pass').length;
    return (passed / executed.length) * 100;
  },
  getStatusCounts: () => {
    const cases = get().testCases;
    const counts: Record<TestStatus, number> = { pass: 0, fail: 0, blocked: 0, skip: 0, not_run: 0, running: 0 };
    cases.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return counts;
  },
  getSuiteStats: (suiteId) => {
    const cases = get().testCases.filter(c => c.suiteId === suiteId);
    return {
      total: cases.length,
      pass: cases.filter(c => c.status === 'pass').length,
      fail: cases.filter(c => c.status === 'fail').length,
      blocked: cases.filter(c => c.status === 'blocked').length,
      skip: cases.filter(c => c.status === 'skip').length,
      notRun: cases.filter(c => c.status === 'not_run').length,
    };
  },
}));
