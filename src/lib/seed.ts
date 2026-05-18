import type { TestSuite, Product, Environment, TeamMember, TestPlan, ActivityEntry, TrendDataPoint, CoverageMapping } from './types';

// ---- Products ----
export const products: Product[] = [
  { id: 'prod-msit', name: 'MSIT', version: 'v1', repositoryUrl: 'https://github.com/oxygene/msit', liveUrl: 'https://msit-intel.vercel.app', description: 'Momentum Stakeholder Intelligence Tool -- stakeholder scoring, quadrant classification, and engagement tracking for political and corporate intelligence operations.', status: 'active', icon: 'Target' }
];

// ---- Environments ----
export const environments: Environment[] = [
  { id: 'env-dev', name: 'Development', url: 'http://localhost:5173', type: 'local', status: 'active', notes: 'Local development server' },
  { id: 'env-staging', name: 'Staging', url: 'https://msit-staging.vercel.app', type: 'cloud', status: 'active', notes: 'Vercel preview deployments' },
  { id: 'env-prod', name: 'Production', url: 'https://msit-intel.vercel.app', type: 'cloud', status: 'active', notes: 'Live production environment' },
];

// ---- Team ----
export const teamMembers: TeamMember[] = [
  { id: 'tm-001', name: 'Ultron', role: 'lead', email: 'ultron@oxygene.co.ke', productsAssigned: ['prod-msit'], active: true },
  { id: 'tm-002', name: 'Sarah Wanjiku', role: 'tester', email: 'sarah.w@oxygene.co.ke', productsAssigned: ['prod-msit'], active: true },
  { id: 'tm-003', name: 'James Ochieng', role: 'tester', email: 'james.o@oxygene.co.ke', productsAssigned: ['prod-msit'], active: true },
];

// ---- Test Suites ----
export const testSuites: TestSuite[] = [
  { id: 'suite-smoke', name: 'Smoke Tests', description: 'Quick health checks that verify the app loads and core paths work.', suiteType: 'smoke', parentId: null, priority: 'critical', environment: 'env-prod', order: 1 },
  { id: 'suite-unit', name: 'Scoring Engine -- Unit Tests', description: 'Pure function tests for the TypeScript scoring engine.', suiteType: 'unit', parentId: null, priority: 'critical', environment: 'env-dev', order: 2 },
  { id: 'suite-store', name: 'Zustand Store -- State Management Tests', description: 'State management tests for all Zustand store actions and selectors.', suiteType: 'state', parentId: null, priority: 'high', environment: 'env-dev', order: 3 },
  { id: 'suite-ui-render', name: 'UI -- Page Rendering', description: 'Manual walkthrough tests verifying each page renders correctly.', suiteType: 'ui_rendering', parentId: null, priority: 'high', environment: 'env-staging', order: 4 },
  { id: 'suite-ui-flow', name: 'UI -- Interactions and Workflows', description: 'End-to-end user workflow tests covering modals, forms, and navigation.', suiteType: 'ui_interactions', parentId: null, priority: 'critical', environment: 'env-staging', order: 5 },
  { id: 'suite-api', name: 'API Tests', description: 'REST and GraphQL endpoint validation for the v2 production backend.', suiteType: 'api', parentId: null, priority: 'critical', environment: 'env-staging', order: 6 },
  { id: 'suite-integration', name: 'Integration Tests', description: 'Cross-component integration tests covering data flow between subsystems.', suiteType: 'integration', parentId: null, priority: 'critical', environment: 'env-staging', order: 7 },
  { id: 'suite-perf', name: 'Performance Tests', description: 'Load, stress, and performance benchmark tests.', suiteType: 'performance', parentId: null, priority: 'high', environment: 'env-prod', order: 8 },
  { id: 'suite-security', name: 'Security Tests', description: 'Vulnerability, authentication, and authorization tests.', suiteType: 'security', parentId: null, priority: 'critical', environment: 'env-staging', order: 9 },
  { id: 'suite-pipeline', name: 'Data Pipeline Tests', description: 'Airflow, Kafka, Spark pipeline validation tests.', suiteType: 'data_pipeline', parentId: null, priority: 'high', environment: 'env-dev', order: 10 },
  { id: 'suite-compat', name: 'Cross-Browser and Responsive', description: 'Browser compatibility and responsive layout tests.', suiteType: 'cross_browser', parentId: null, priority: 'high', environment: 'env-prod', order: 11 },
];

// ---- Test Plan ----
export const testPlans: TestPlan[] = [
  {
    id: 'plan-001',
    name: 'MSIT v1 Production Readiness',
    description: 'Comprehensive test plan covering all functional, integration, performance, and security tests for the MSIT v1 release. Validates the full Momentum Infrastructure stack including scoring engine, stakeholder management, data pipelines, and observability.',
    productId: 'prod-msit',
    environmentId: 'env-prod',
    status: 'active',
    assignedTesters: ['tm-001', 'tm-002', 'tm-003'],
    suiteIds: testSuites.map(s => s.id),
    startDate: '2026-04-01',
    endDate: '2026-06-01',
    createdBy: 'tm-001',
    lastRunDate: '2026-05-15',
    createdAt: '2026-04-01',
  }
];

// ---- Activity Feed ----
export const activityFeed: ActivityEntry[] = [
  { id: 'act-01', timestamp: '2026-05-18T14:30:00Z', user: 'Sarah Wanjiku', action: 'run_completed', description: 'Completed Smoke Tests run -- 7/8 passed', itemId: 'run-001', itemType: 'test_run' },
  { id: 'act-02', timestamp: '2026-05-18T13:15:00Z', user: 'James Ochieng', action: 'defect_logged', description: 'Logged DEF-003: Quadrant map dots overlap at boundary values', itemId: 'DEF-003', itemType: 'defect' },
  { id: 'act-03', timestamp: '2026-05-18T11:00:00Z', user: 'Ultron', action: 'case_updated', description: 'Updated TC-UNIT-006 expected result to 74.00', itemId: 'TC-UNIT-006', itemType: 'test_case' },
  { id: 'act-04', timestamp: '2026-05-17T16:45:00Z', user: 'Sarah Wanjiku', action: 'run_completed', description: 'Completed Scoring Engine unit tests -- 22/22 passed', itemId: 'run-002', itemType: 'test_run' },
  { id: 'act-05', timestamp: '2026-05-17T14:20:00Z', user: 'James Ochieng', action: 'defect_resolved', description: 'Resolved DEF-001: SIS calculation rounding error', itemId: 'DEF-001', itemType: 'defect' },
  { id: 'act-06', timestamp: '2026-05-17T10:30:00Z', user: 'Ultron', action: 'plan_created', description: 'Created MSIT v1 Production Readiness plan', itemId: 'plan-001', itemType: 'test_plan' },
  { id: 'act-07', timestamp: '2026-05-16T15:00:00Z', user: 'Sarah Wanjiku', action: 'case_created', description: 'Created 8 new security test cases', itemId: 'TC-SEC-001', itemType: 'test_case' },
  { id: 'act-08', timestamp: '2026-05-16T11:30:00Z', user: 'James Ochieng', action: 'run_completed', description: 'Completed API tests run -- 10/12 passed', itemId: 'run-003', itemType: 'test_run' },
  { id: 'act-09', timestamp: '2026-05-15T16:00:00Z', user: 'Ultron', action: 'defect_logged', description: 'Logged DEF-005: Redis cache not invalidating on config change', itemId: 'DEF-005', itemType: 'defect' },
  { id: 'act-10', timestamp: '2026-05-15T13:00:00Z', user: 'Sarah Wanjiku', action: 'test_run', description: 'Started UI Page Rendering test run', itemId: 'run-004', itemType: 'test_run' },
  { id: 'act-11', timestamp: '2026-05-14T17:30:00Z', user: 'James Ochieng', action: 'case_updated', description: 'Updated TC-FLOW-001 steps with new modal fields', itemId: 'TC-FLOW-001', itemType: 'test_case' },
  { id: 'act-12', timestamp: '2026-05-14T10:00:00Z', user: 'Ultron', action: 'run_completed', description: 'Completed Integration tests -- 6/8 passed', itemId: 'run-005', itemType: 'test_run' },
  { id: 'act-13', timestamp: '2026-05-13T14:00:00Z', user: 'Sarah Wanjiku', action: 'defect_logged', description: 'Logged DEF-007: Watchlist signal pulsing animation missing', itemId: 'DEF-007', itemType: 'defect' },
  { id: 'act-14', timestamp: '2026-05-13T09:00:00Z', user: 'James Ochieng', action: 'case_created', description: 'Created 6 cross-browser compatibility cases', itemId: 'TC-COMPAT-001', itemType: 'test_case' },
  { id: 'act-15', timestamp: '2026-05-12T16:00:00Z', user: 'Ultron', action: 'test_run', description: 'Started Performance test suite run', itemId: 'run-006', itemType: 'test_run' },
];

// ---- Trend Data (30 days) ----
function generateTrendData(): TrendDataPoint[] {
  const data: TrendDataPoint[] = [];
  const baseDate = new Date('2026-04-18');
  for (let i = 0; i < 30; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const progress = i / 29;
    const passRate = 65 + progress * 25 + (Math.random() * 6 - 3);
    const clamped = Math.min(98, Math.max(55, passRate));
    const totalCases = 122;
    const passed = Math.round((clamped / 100) * totalCases);
    const failed = Math.round(totalCases * (0.03 + (1 - progress) * 0.12) + (Math.random() * 3 - 1));
    const blocked = Math.round(totalCases * 0.03 + Math.random() * 3);
    const skipped = Math.round(Math.random() * 4);
    const notRun = Math.max(0, totalCases - passed - Math.abs(failed) - blocked - skipped);
    const openDefects = Math.max(1, Math.round(12 - progress * 7 + Math.random() * 3));
    const newDefects = Math.round(Math.random() * 3);
    const resolvedDefects = Math.round(Math.random() * 2 + progress * 2);
    data.push({
      date: d.toISOString().split('T')[0],
      passRate: Math.round(clamped * 10) / 10,
      totalCases, passed, failed: Math.abs(failed), blocked, skipped, notRun,
      openDefects, newDefects, resolvedDefects,
      casesExecuted: Math.round(20 + Math.random() * 40),
    });
  }
  return data;
}

export const trendData: TrendDataPoint[] = generateTrendData();

// ---- Coverage Matrix ----
export const coverageMatrix: CoverageMapping[] = [
  { feature: 'Scoring Engine', featureId: 'feat-scoring', testTypes: { unit: ['TC-UNIT-001','TC-UNIT-002','TC-UNIT-003','TC-UNIT-004','TC-UNIT-005','TC-UNIT-006','TC-UNIT-007','TC-UNIT-008','TC-UNIT-009','TC-UNIT-010','TC-UNIT-011','TC-UNIT-012','TC-UNIT-013','TC-UNIT-014','TC-UNIT-015','TC-UNIT-016','TC-UNIT-017','TC-UNIT-018','TC-UNIT-019','TC-UNIT-020','TC-UNIT-021','TC-UNIT-022'], integration: ['TC-INT-001'], api: ['TC-API-005','TC-API-006'], e2e: ['TC-FLOW-002'], performance: ['TC-PERF-003'], security: [] }},
  { feature: 'Dashboard', featureId: 'feat-dashboard', testTypes: { unit: [], integration: [], api: [], e2e: ['TC-UI-001','TC-UI-002','TC-FLOW-012'], performance: ['TC-PERF-001'], security: [] }},
  { feature: 'Stakeholder CRUD', featureId: 'feat-stakeholder', testTypes: { unit: [], integration: ['TC-INT-002','TC-INT-005'], api: ['TC-API-001','TC-API-002','TC-API-003','TC-API-004'], e2e: ['TC-UI-003','TC-UI-004','TC-UI-005','TC-FLOW-006'], performance: ['TC-PERF-002','TC-PERF-004'], security: ['TC-SEC-001','TC-SEC-002','TC-SEC-007'] }},
  { feature: 'Engagements', featureId: 'feat-engagements', testTypes: { unit: [], integration: ['TC-INT-003'], api: ['TC-API-007'], e2e: ['TC-UI-008','TC-UI-009','TC-FLOW-001'], performance: [], security: [] }},
  { feature: 'Watchlist', featureId: 'feat-watchlist', testTypes: { unit: [], integration: ['TC-INT-001'], api: ['TC-API-008','TC-API-009'], e2e: ['TC-UI-010','TC-FLOW-004','TC-FLOW-005'], performance: [], security: [] }},
  { feature: 'Quadrant Map', featureId: 'feat-quadrant', testTypes: { unit: ['TC-UNIT-013','TC-UNIT-014','TC-UNIT-015','TC-UNIT-016','TC-UNIT-017','TC-UNIT-018'], integration: ['TC-INT-002'], api: [], e2e: ['TC-UI-007','TC-FLOW-012'], performance: [], security: [] }},
  { feature: 'State Management', featureId: 'feat-store', testTypes: { unit: ['TC-STORE-001','TC-STORE-002','TC-STORE-003','TC-STORE-004','TC-STORE-005','TC-STORE-006','TC-STORE-007','TC-STORE-008','TC-STORE-009','TC-STORE-010','TC-STORE-011','TC-STORE-012','TC-STORE-013','TC-STORE-014','TC-STORE-015','TC-STORE-016','TC-STORE-017','TC-STORE-018'], integration: [], api: [], e2e: [], performance: [], security: [] }},
  { feature: 'Authentication & RBAC', featureId: 'feat-auth', testTypes: { unit: [], integration: [], api: ['TC-API-011','TC-API-012'], e2e: ['TC-FLOW-010'], performance: [], security: ['TC-SEC-003','TC-SEC-004','TC-SEC-005','TC-SEC-006'] }},
  { feature: 'Data Pipelines', featureId: 'feat-pipeline', testTypes: { unit: [], integration: ['TC-INT-006','TC-INT-007','TC-INT-008'], api: [], e2e: ['TC-PIPE-005'], performance: ['TC-PERF-005'], security: [] }},
  { feature: 'File Upload & Evidence', featureId: 'feat-upload', testTypes: { unit: [], integration: [], api: ['TC-API-010'], e2e: ['TC-FLOW-003','TC-UI-012'], performance: [], security: ['TC-SEC-008'] }},
  { feature: 'Cross-Browser Compat', featureId: 'feat-compat', testTypes: { unit: [], integration: [], api: [], e2e: ['TC-COMPAT-001','TC-COMPAT-002','TC-COMPAT-003','TC-COMPAT-004','TC-COMPAT-005','TC-COMPAT-006'], performance: [], security: [] }},
];
