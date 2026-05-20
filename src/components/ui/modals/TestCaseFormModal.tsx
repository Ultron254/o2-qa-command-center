import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../Modal';
import { FormField, TextInput, TextArea, SelectInput } from '../FormField';
import { useToast } from '../Toast';
import { useStore } from '../../../lib/store';
import type { TestCase, TestStep, TestType, PriorityLevel, AutomationStatus } from '../../../lib/types';

interface TestCaseFormModalProps {
  open: boolean;
  onClose: () => void;
  testCase?: TestCase;
  suiteId?: string;
}

interface StepForm {
  action: string;
  expectedResult: string;
}

const emptyForm = {
  title: '',
  suiteId: '',
  type: 'manual' as TestType,
  priority: 'medium' as PriorityLevel,
  automationStatus: 'manual' as AutomationStatus,
  preconditions: '',
  tags: '',
  assignedTo: '',
};

export const TestCaseFormModal: React.FC<TestCaseFormModalProps> = ({ open, onClose, testCase, suiteId }) => {
  const { testSuites, testCases, teamMembers, addTestCase, updateTestCase } = useStore();
  const { toast } = useToast();
  const isEdit = !!testCase;

  const [form, setForm] = useState(emptyForm);
  const [steps, setSteps] = useState<StepForm[]>([{ action: '', expectedResult: '' }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (testCase) {
        setForm({
          title: testCase.title,
          suiteId: testCase.suiteId,
          type: testCase.type,
          priority: testCase.priority,
          automationStatus: testCase.automationStatus,
          preconditions: testCase.preconditions,
          tags: testCase.tags.join(', '),
          assignedTo: testCase.assignedTo,
        });
        setSteps(testCase.steps.map(s => ({ action: s.action, expectedResult: s.expectedResult })));
      } else {
        setForm({ ...emptyForm, suiteId: suiteId || '' });
        setSteps([{ action: '', expectedResult: '' }]);
      }
      setErrors({});
    }
  }, [open, testCase, suiteId]);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const updateStep = (idx: number, field: keyof StepForm, value: string) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addStep = () => setSteps(prev => [...prev, { action: '', expectedResult: '' }]);

  const removeStep = (idx: number) => {
    if (steps.length <= 1) return;
    setSteps(prev => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.suiteId) errs.suiteId = 'Suite is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateId = () => {
    const maxNum = testCases.reduce((max, tc) => {
      const n = parseInt(tc.id.replace('TC-', ''), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    return `TC-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const buildSteps = (): TestStep[] =>
    steps.filter(s => s.action.trim()).map((s, i) => ({
      stepNumber: i + 1,
      action: s.action,
      expectedResult: s.expectedResult,
    }));

  const handleSubmit = () => {
    if (!validate()) return;
    const now = new Date().toISOString();
    const parsedTags = form.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (isEdit && testCase) {
      updateTestCase(testCase.id, {
        title: form.title,
        suiteId: form.suiteId,
        type: form.type,
        priority: form.priority,
        automationStatus: form.automationStatus,
        preconditions: form.preconditions,
        tags: parsedTags,
        assignedTo: form.assignedTo,
        steps: buildSteps(),
        updatedAt: now,
      });
      toast({ type: 'success', title: 'Test case updated', description: `${testCase.id} has been updated.` });
    } else {
      const newCase: TestCase = {
        id: generateId(),
        title: form.title,
        suiteId: form.suiteId,
        type: form.type,
        priority: form.priority,
        status: 'not_run',
        automationStatus: form.automationStatus,
        preconditions: form.preconditions,
        tags: parsedTags,
        steps: buildSteps(),
        history: [],
        assignedTo: form.assignedTo,
        lastRunDate: null,
        linkedDefects: [],
        createdAt: now,
        updatedAt: now,
      };
      addTestCase(newCase);
      toast({ type: 'success', title: 'Test case created', description: `${newCase.id} has been added.` });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Test Case — ${testCase!.id}` : 'New Test Case'}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">{isEdit ? 'Update' : 'Create'} Test Case</button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Title" required error={errors.title}>
          <TextInput value={form.title} onChange={e => set('title', e.target.value)} placeholder="Test case title" error={!!errors.title} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Suite" required error={errors.suiteId}>
            <SelectInput value={form.suiteId} onChange={e => set('suiteId', e.target.value)} error={!!errors.suiteId}>
              <option value="">Select suite…</option>
              {testSuites.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </SelectInput>
          </FormField>
          <FormField label="Type">
            <SelectInput value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="manual">Manual</option>
              <option value="automated">Automated</option>
            </SelectInput>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Priority">
            <SelectInput value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </SelectInput>
          </FormField>
          <FormField label="Automation Status">
            <SelectInput value={form.automationStatus} onChange={e => set('automationStatus', e.target.value)}>
              <option value="automated">Automated</option>
              <option value="manual">Manual</option>
              <option value="planned">Planned</option>
            </SelectInput>
          </FormField>
        </div>

        <FormField label="Preconditions">
          <TextArea value={form.preconditions} onChange={e => set('preconditions', e.target.value)} rows={2} placeholder="Any preconditions for this test" />
        </FormField>

        <FormField label="Tags">
          <TextInput value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Comma-separated tags, e.g. login, smoke, regression" />
        </FormField>

        <FormField label="Assigned To">
          <SelectInput value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
            <option value="">Unassigned</option>
            {teamMembers.filter(m => m.active).map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </SelectInput>
        </FormField>

        {/* Dynamic Steps */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-content-primary">Test Steps</label>
            <button type="button" onClick={addStep} className="btn-secondary !py-1 !px-2 !text-xs flex items-center gap-1">
              <Plus size={14} /> Add Step
            </button>
          </div>
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start p-3 bg-surface-secondary/50 rounded-lg border border-line">
                <span className="text-xs font-mono text-content-muted mt-2 w-6 shrink-0 text-center">{idx + 1}</span>
                <div className="flex-1 space-y-2">
                  <TextInput
                    value={step.action}
                    onChange={e => updateStep(idx, 'action', e.target.value)}
                    placeholder="Action / step description"
                  />
                  <TextInput
                    value={step.expectedResult}
                    onChange={e => updateStep(idx, 'expectedResult', e.target.value)}
                    placeholder="Expected result"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  disabled={steps.length <= 1}
                  className="p-1.5 text-content-muted hover:text-status-fail disabled:opacity-30 transition-colors mt-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
