import type { TestCase, Defect, TestRun } from './types';
import { smokeTests, unitTests, storeTests } from './testcases-part1';
import { uiRenderTests, uiFlowTests, apiTests, integrationTests, perfTests, securityTests, pipelineTests, compatTests } from './testcases-part2';
export { products, environments, teamMembers, testSuites, testPlans, activityFeed, trendData, coverageMatrix } from './seed';

// ---- All 122 Test Cases ----
export const allTestCases: TestCase[] = [
  ...smokeTests,
  ...unitTests,
  ...storeTests,
  ...uiRenderTests,
  ...uiFlowTests,
  ...apiTests,
  ...integrationTests,
  ...perfTests,
  ...securityTests,
  ...pipelineTests,
  ...compatTests,
];

// Link some defects to test cases
allTestCases.find(c => c.id === 'TC-SMOKE-006')!.linkedDefects = ['DEF-003'];
allTestCases.find(c => c.id === 'TC-UI-007')!.linkedDefects = ['DEF-003'];
allTestCases.find(c => c.id === 'TC-API-005')!.linkedDefects = ['DEF-002'];
allTestCases.find(c => c.id === 'TC-INT-006')!.linkedDefects = ['DEF-005'];

// ---- Defects ----
export const defects: Defect[] = [
  {
    id: 'DEF-001', title: 'SIS calculation rounding error for edge case inputs',
    description: 'When all scoring components are at exactly 2.5, the SIS calculation returns 49.99 instead of 50.00 due to floating point rounding in the weighted average formula.',
    severity: 'medium', priority: 'medium', status: 'resolved',
    linkedTestCases: ['TC-UNIT-004','TC-UNIT-005'],
    stepsToReproduce: '1. Call calculateSIS with all components set to 2.5\n2. Observe returned value',
    expectedBehavior: 'Returns 50.00', actualBehavior: 'Returns 49.99',
    environment: 'Development', browser: 'Chrome 120', assignee: 'Sarah Wanjiku',
    createdBy: 'James Ochieng', createdAt: '2026-05-08', updatedAt: '2026-05-17',
  },
  {
    id: 'DEF-002', title: 'POST /api/scores returns 500 when risk component is 0',
    description: 'The scoring API endpoint crashes with a division by zero error when the risk component value is submitted as 0, which is outside the valid 1-5 range but should be handled gracefully.',
    severity: 'high', priority: 'high', status: 'in_progress',
    linkedTestCases: ['TC-API-005'],
    stepsToReproduce: '1. Send POST /api/scores with risk: 0\n2. Observe 500 error',
    expectedBehavior: 'Returns 400 with validation error', actualBehavior: 'Returns 500 Internal Server Error',
    environment: 'Staging', browser: 'N/A (API)', assignee: 'James Ochieng',
    createdBy: 'Sarah Wanjiku', createdAt: '2026-05-12', updatedAt: '2026-05-16',
  },
  {
    id: 'DEF-003', title: 'Quadrant map dots overlap at boundary threshold values',
    description: 'Stakeholders with power/convertibility values at exactly 4.0 (the quadrant boundary) overlap with adjacent quadrant dots, making them unclickable.',
    severity: 'medium', priority: 'high', status: 'new',
    linkedTestCases: ['TC-SMOKE-006','TC-UI-007'],
    stepsToReproduce: '1. Navigate to Quadrant Map\n2. Observe stakeholders at boundary values\n3. Try to click overlapping dots',
    expectedBehavior: 'Dots at boundaries should be offset or show tooltip on hover', actualBehavior: 'Dots stack on top of each other and are unclickable',
    environment: 'Production', browser: 'Chrome 120, Firefox 121', assignee: 'Sarah Wanjiku',
    createdBy: 'James Ochieng', createdAt: '2026-05-18', updatedAt: '2026-05-18',
  },
  {
    id: 'DEF-004', title: 'Toast notifications stack without limit',
    description: 'Rapidly triggering multiple actions creates unlimited toast notifications that overflow the viewport. No maximum stack limit is enforced.',
    severity: 'low', priority: 'low', status: 'new',
    linkedTestCases: ['TC-FLOW-014','TC-STORE-009'],
    stepsToReproduce: '1. Rapidly click save 20+ times\n2. Observe toast stack',
    expectedBehavior: 'Maximum 3-5 toasts visible, oldest dismissed', actualBehavior: 'All 20+ toasts stack and overflow viewport',
    environment: 'Development', browser: 'Chrome 120', assignee: 'James Ochieng',
    createdBy: 'Ultron', createdAt: '2026-05-14', updatedAt: '2026-05-14',
  },
  {
    id: 'DEF-005', title: 'Redis scoring weights cache not invalidating on config change',
    description: 'After updating scoring weights in the configuration panel, the Redis cache still serves stale weight values. Requires manual cache flush.',
    severity: 'high', priority: 'critical', status: 'in_progress',
    linkedTestCases: ['TC-INT-006'],
    stepsToReproduce: '1. Check current cached weights in Redis\n2. Update scoring config via API\n3. Read weights again from cache',
    expectedBehavior: 'Cache returns new weights after config update', actualBehavior: 'Cache returns old weights until TTL expires or manual flush',
    environment: 'Staging', browser: 'N/A', assignee: 'Ultron',
    createdBy: 'Ultron', createdAt: '2026-05-15', updatedAt: '2026-05-17',
  },
  {
    id: 'DEF-006', title: 'Stakeholder portrait upload fails silently for HEIC format',
    description: 'When uploading a .heic image (common from iPhone photos), the upload appears to succeed but no portrait is saved. No error message shown.',
    severity: 'medium', priority: 'medium', status: 'new',
    linkedTestCases: ['TC-UI-012','TC-SEC-008'],
    stepsToReproduce: '1. Open Add Stakeholder form\n2. Upload a .heic portrait image\n3. Submit form',
    expectedBehavior: 'Either accept HEIC or show clear error about unsupported format', actualBehavior: 'Upload appears to succeed but no image is saved',
    environment: 'Production', browser: 'Safari 17', assignee: 'Sarah Wanjiku',
    createdBy: 'Sarah Wanjiku', createdAt: '2026-05-13', updatedAt: '2026-05-13',
  },
  {
    id: 'DEF-007', title: 'Watchlist critical signal pulsing animation missing in Firefox',
    description: 'The CSS pulsing left-border animation for critical watchlist signals does not render in Firefox. Works correctly in Chrome and Safari.',
    severity: 'low', priority: 'medium', status: 'new',
    linkedTestCases: ['TC-UI-010'],
    stepsToReproduce: '1. Open Watchlist in Firefox 121+\n2. View a critical severity signal',
    expectedBehavior: 'Left border pulses with red animation', actualBehavior: 'Static border, no animation',
    environment: 'Production', browser: 'Firefox 121', assignee: 'James Ochieng',
    createdBy: 'Sarah Wanjiku', createdAt: '2026-05-13', updatedAt: '2026-05-13',
  },
  {
    id: 'DEF-008', title: 'E2E pipeline test blocked by Kafka consumer lag',
    description: 'The end-to-end data pipeline test (TC-PIPE-005) consistently times out because Kafka consumer lag exceeds the 30-second test timeout.',
    severity: 'high', priority: 'high', status: 'in_progress',
    linkedTestCases: ['TC-PIPE-005'],
    stepsToReproduce: '1. Run TC-PIPE-005 end-to-end pipeline test\n2. Wait for Kafka consumer processing\n3. Test times out at 30s',
    expectedBehavior: 'Consumer processes within 10 seconds', actualBehavior: 'Consumer lag causes timeout at 30 seconds',
    environment: 'Development', browser: 'N/A', assignee: 'Ultron',
    createdBy: 'James Ochieng', createdAt: '2026-05-16', updatedAt: '2026-05-18',
  },
];

// ---- Test Runs ----
export const testRuns: TestRun[] = [
  {
    id: 'RUN-001', name: 'Smoke Tests - Sprint 12', planId: 'plan-001', suiteId: 'suite-smoke',
    testerId: 'tm-002', date: '2026-05-18T14:00:00Z', duration: '12m 34s', status: 'completed',
    executions: smokeTests.map(tc => ({
      testCaseId: tc.id, status: tc.status,
      steps: tc.steps.map(s => ({ ...s, actualResult: s.expectedResult, status: tc.status })),
      actualResults: '', startedAt: '2026-05-18T14:00:00Z', completedAt: '2026-05-18T14:12:34Z', notes: '',
    })),
  },
  {
    id: 'RUN-002', name: 'Scoring Engine Full Suite', planId: 'plan-001', suiteId: 'suite-unit',
    testerId: 'tm-002', date: '2026-05-17T10:00:00Z', duration: '1m 45s', status: 'completed',
    executions: unitTests.map(tc => ({
      testCaseId: tc.id, status: tc.status,
      steps: tc.steps.map(s => ({ ...s, actualResult: s.expectedResult, status: tc.status })),
      actualResults: '', startedAt: '2026-05-17T10:00:00Z', completedAt: '2026-05-17T10:01:45Z', notes: '',
    })),
  },
  {
    id: 'RUN-003', name: 'API Validation - v2 Backend', planId: 'plan-001', suiteId: 'suite-api',
    testerId: 'tm-003', date: '2026-05-16T09:00:00Z', duration: '8m 20s', status: 'completed',
    executions: apiTests.map(tc => ({
      testCaseId: tc.id, status: tc.status,
      steps: tc.steps.map(s => ({ ...s, actualResult: s.expectedResult, status: tc.status })),
      actualResults: '', startedAt: '2026-05-16T09:00:00Z', completedAt: '2026-05-16T09:08:20Z', notes: '',
    })),
  },
];
