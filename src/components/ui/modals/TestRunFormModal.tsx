import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { FormField, TextInput, SelectInput } from '../FormField';
import { useToast } from '../Toast';
import { useStore } from '../../../lib/store';
import type { TestRun, TestCaseExecution } from '../../../lib/types';

interface TestRunFormModalProps {
  open: boolean;
  onClose: () => void;
}

const emptyForm = {
  name: '',
  planId: '',
  suiteId: '',
  testerId: '',
};

export const TestRunFormModal: React.FC<TestRunFormModalProps> = ({ open, onClose }) => {
  const { testPlans, testSuites, teamMembers, testCases, testRuns, startTestRun } = useStore();
  const { toast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [open]);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.testerId) errs.testerId = 'Tester is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateId = () => {
    const maxNum = testRuns.reduce((max, r) => {
      const n = parseInt(r.id.replace('RUN-', ''), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    return `RUN-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const buildExecutions = (): TestCaseExecution[] => {
    let cases = testCases;

    if (form.suiteId) {
      cases = cases.filter(tc => tc.suiteId === form.suiteId);
    } else if (form.planId) {
      const plan = testPlans.find(p => p.id === form.planId);
      if (plan) {
        cases = cases.filter(tc => plan.suiteIds.includes(tc.suiteId));
      }
    }

    return cases.map(tc => ({
      testCaseId: tc.id,
      status: 'not_run' as const,
      steps: tc.steps.map(s => ({ ...s, actualResult: '', status: 'not_run' as const })),
      actualResults: '',
      startedAt: null,
      completedAt: null,
      notes: '',
    }));
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const executions = buildExecutions();
    if (executions.length === 0) {
      toast({ type: 'warning', title: 'No test cases', description: 'The selected suite/plan has no test cases to run.' });
      return;
    }

    const newRun: TestRun = {
      id: generateId(),
      name: form.name,
      planId: form.planId || null,
      suiteId: form.suiteId || null,
      testerId: form.testerId,
      date: new Date().toISOString().split('T')[0],
      duration: '0m',
      status: 'running',
      executions,
    };

    startTestRun(newRun);
    toast({ type: 'success', title: 'Test run started', description: `${newRun.id} is now running with ${executions.length} case(s).` });
    onClose();
  };

  const previewCount = (() => {
    let cases = testCases;
    if (form.suiteId) {
      cases = cases.filter(tc => tc.suiteId === form.suiteId);
    } else if (form.planId) {
      const plan = testPlans.find(p => p.id === form.planId);
      if (plan) cases = cases.filter(tc => plan.suiteIds.includes(tc.suiteId));
    }
    return cases.length;
  })();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Start New Test Run"
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">Start Run</button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Run Name" required error={errors.name}>
          <TextInput value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Sprint 12 — Smoke Tests" error={!!errors.name} />
        </FormField>

        <FormField label="Test Plan">
          <SelectInput value={form.planId} onChange={e => set('planId', e.target.value)}>
            <option value="">None (select suite instead)</option>
            {testPlans.filter(p => p.status === 'active' || p.status === 'draft').map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Test Suite">
          <SelectInput value={form.suiteId} onChange={e => set('suiteId', e.target.value)}>
            <option value="">All suites{form.planId ? ' in plan' : ''}</option>
            {testSuites.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Tester" required error={errors.testerId}>
          <SelectInput value={form.testerId} onChange={e => set('testerId', e.target.value)} error={!!errors.testerId}>
            <option value="">Select tester…</option>
            {teamMembers.filter(m => m.active).map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </SelectInput>
        </FormField>

        <div className="p-3 bg-surface-secondary/50 rounded-lg border border-line">
          <p className="text-sm text-content-secondary">
            <span className="font-medium text-content-primary">{previewCount}</span> test case{previewCount !== 1 ? 's' : ''} will be included in this run.
          </p>
        </div>
      </div>
    </Modal>
  );
};
