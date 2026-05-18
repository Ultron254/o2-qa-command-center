// ============================================================
// O2 QA Command Center — Type Definitions
// ============================================================

// ----- Enums -----

export type TestStatus = 'pass' | 'fail' | 'blocked' | 'skip' | 'not_run' | 'running';
export type TestType = 'manual' | 'automated';
export type AutomationStatus = 'automated' | 'manual' | 'planned';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export type PlanStatus = 'draft' | 'active' | 'completed' | 'archived';
export type RunStatus = 'running' | 'completed' | 'aborted';

export type DefectStatus = 'new' | 'in_progress' | 'resolved' | 'verified' | 'closed';

export type SuiteType =
  | 'smoke'
  | 'unit'
  | 'state'
  | 'ui_rendering'
  | 'ui_interactions'
  | 'api'
  | 'integration'
  | 'performance'
  | 'security'
  | 'data_pipeline'
  | 'cross_browser';

export type PageId =
  | 'dashboard'
  | 'test-plans'
  | 'test-plan-detail'
  | 'test-suites'
  | 'test-cases'
  | 'test-case-detail'
  | 'test-runs'
  | 'test-run-execution'
  | 'defects'
  | 'coverage-matrix'
  | 'trend-reports'
  | 'products'
  | 'environments'
  | 'team';

// ----- Core Entities -----

export interface Product {
  id: string;
  name: string;
  version: string;
  repositoryUrl: string;
  liveUrl: string;
  description: string;
  status: 'active' | 'archived';
  icon: string;
}

export interface Environment {
  id: string;
  name: string;
  url: string;
  type: 'local' | 'cloud';
  status: 'active' | 'inactive';
  notes: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'lead' | 'tester' | 'developer';
  email: string;
  productsAssigned: string[];
  active: boolean;
  avatar?: string;
}

// ----- Test Entities -----

export interface TestStep {
  stepNumber: number;
  action: string;
  expectedResult: string;
  actualResult?: string;
  status?: TestStatus;
}

export interface TestCaseHistory {
  runId: string;
  date: string;
  status: TestStatus;
  tester: string;
  duration: string;
}

export interface TestCase {
  id: string;
  title: string;
  type: TestType;
  priority: PriorityLevel;
  status: TestStatus;
  suiteId: string;
  automationStatus: AutomationStatus;
  preconditions: string;
  tags: string[];
  steps: TestStep[];
  history: TestCaseHistory[];
  assignedTo: string;
  lastRunDate: string | null;
  linkedDefects: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  suiteType: SuiteType;
  parentId: string | null;
  priority: PriorityLevel;
  environment: string;
  order: number;
}

export interface TestPlan {
  id: string;
  name: string;
  description: string;
  productId: string;
  environmentId: string;
  status: PlanStatus;
  assignedTesters: string[];
  suiteIds: string[];
  startDate: string;
  endDate: string;
  createdBy: string;
  lastRunDate: string | null;
  createdAt: string;
}

// ----- Test Run -----

export interface TestCaseExecution {
  testCaseId: string;
  status: TestStatus;
  steps: TestStep[];
  actualResults: string;
  startedAt: string | null;
  completedAt: string | null;
  notes: string;
}

export interface TestRun {
  id: string;
  name: string;
  planId: string | null;
  suiteId: string | null;
  testerId: string;
  date: string;
  duration: string;
  status: RunStatus;
  executions: TestCaseExecution[];
}

// ----- Defects -----

export interface Defect {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  priority: PriorityLevel;
  status: DefectStatus;
  linkedTestCases: string[];
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  environment: string;
  browser: string;
  assignee: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ----- Analytics -----

export interface TrendDataPoint {
  date: string;
  passRate: number;
  totalCases: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  notRun: number;
  openDefects: number;
  newDefects: number;
  resolvedDefects: number;
  casesExecuted: number;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'test_run' | 'defect_logged' | 'case_updated' | 'case_created' | 'plan_created' | 'run_completed' | 'defect_resolved';
  description: string;
  itemId: string;
  itemType: 'test_case' | 'test_run' | 'defect' | 'test_plan' | 'test_suite';
}

export interface CoverageMapping {
  feature: string;
  featureId: string;
  testTypes: Record<string, string[]>; // test type -> array of test case IDs
}

// ----- Filters -----

export interface TestCaseFilters {
  search: string;
  suiteId: string | null;
  type: TestType | null;
  priority: PriorityLevel | null;
  status: TestStatus | null;
}

export interface DefectFilters {
  search: string;
  severity: SeverityLevel | null;
  priority: PriorityLevel | null;
  status: DefectStatus | null;
}
