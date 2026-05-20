import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { FormField, TextInput, TextArea, SelectInput } from '../FormField';
import { useToast } from '../Toast';
import { useStore } from '../../../lib/store';
import type { TestPlan, PlanStatus } from '../../../lib/types';

interface TestPlanFormModalProps {
  open: boolean;
  onClose: () => void;
  plan?: TestPlan;
}

const emptyForm = {
  name: '',
  description: '',
  productId: '',
  environmentId: '',
  status: 'draft' as PlanStatus,
  startDate: '',
  endDate: '',
};

export const TestPlanFormModal: React.FC<TestPlanFormModalProps> = ({ open, onClose, plan }) => {
  const { products, environments, testSuites, teamMembers, testPlans, addTestPlan, updateTestPlan } = useStore();
  const { toast } = useToast();
  const isEdit = !!plan;

  const [form, setForm] = useState(emptyForm);
  const [selectedSuites, setSelectedSuites] = useState<string[]>([]);
  const [selectedTesters, setSelectedTesters] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (plan) {
        setForm({
          name: plan.name,
          description: plan.description,
          productId: plan.productId,
          environmentId: plan.environmentId,
          status: plan.status,
          startDate: plan.startDate,
          endDate: plan.endDate,
        });
        setSelectedSuites([...plan.suiteIds]);
        setSelectedTesters([...plan.assignedTesters]);
      } else {
        setForm(emptyForm);
        setSelectedSuites([]);
        setSelectedTesters([]);
      }
      setErrors({});
    }
  }, [open, plan]);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleSuite = (id: string) => {
    setSelectedSuites(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleTester = (id: string) => {
    setSelectedTesters(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateId = () => {
    const maxNum = testPlans.reduce((max, p) => {
      const n = parseInt(p.id.replace('TP-', ''), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    return `TP-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const now = new Date().toISOString();

    if (isEdit && plan) {
      updateTestPlan(plan.id, {
        name: form.name,
        description: form.description,
        productId: form.productId,
        environmentId: form.environmentId,
        status: form.status,
        startDate: form.startDate,
        endDate: form.endDate,
        suiteIds: selectedSuites,
        assignedTesters: selectedTesters,
      });
      toast({ type: 'success', title: 'Test plan updated', description: `${plan.id} has been updated.` });
    } else {
      const newPlan: TestPlan = {
        id: generateId(),
        name: form.name,
        description: form.description,
        productId: form.productId,
        environmentId: form.environmentId,
        status: form.status,
        startDate: form.startDate,
        endDate: form.endDate,
        suiteIds: selectedSuites,
        assignedTesters: selectedTesters,
        createdBy: 'current-user',
        lastRunDate: null,
        createdAt: now,
      };
      addTestPlan(newPlan);
      toast({ type: 'success', title: 'Test plan created', description: `${newPlan.id} has been added.` });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Test Plan — ${plan!.id}` : 'New Test Plan'}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">{isEdit ? 'Update' : 'Create'} Plan</button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Name" required error={errors.name}>
          <TextInput value={form.name} onChange={e => set('name', e.target.value)} placeholder="Test plan name" error={!!errors.name} />
        </FormField>

        <FormField label="Description">
          <TextArea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Plan objectives and scope" />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Product">
            <SelectInput value={form.productId} onChange={e => set('productId', e.target.value)}>
              <option value="">Select product…</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </SelectInput>
          </FormField>
          <FormField label="Environment">
            <SelectInput value={form.environmentId} onChange={e => set('environmentId', e.target.value)}>
              <option value="">Select environment…</option>
              {environments.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </SelectInput>
          </FormField>
        </div>

        <FormField label="Status">
          <SelectInput value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </SelectInput>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date">
            <TextInput type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
          </FormField>
          <FormField label="End Date">
            <TextInput type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
          </FormField>
        </div>

        {/* Multi-select suites */}
        <FormField label="Test Suites">
          <div className="max-h-40 overflow-y-auto border border-line rounded-lg p-2 space-y-1 bg-surface-secondary/30">
            {testSuites.length === 0 && <p className="text-xs text-content-muted p-2">No suites available</p>}
            {testSuites.map(s => (
              <label key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-hover cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedSuites.includes(s.id)}
                  onChange={() => toggleSuite(s.id)}
                  className="accent-accent"
                />
                <span className="text-sm text-content-primary">{s.name}</span>
                <span className="text-xs text-content-muted ml-auto">{s.id}</span>
              </label>
            ))}
          </div>
        </FormField>

        {/* Multi-select testers */}
        <FormField label="Assigned Testers">
          <div className="max-h-40 overflow-y-auto border border-line rounded-lg p-2 space-y-1 bg-surface-secondary/30">
            {teamMembers.filter(m => m.active).length === 0 && <p className="text-xs text-content-muted p-2">No team members available</p>}
            {teamMembers.filter(m => m.active).map(m => (
              <label key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-hover cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedTesters.includes(m.id)}
                  onChange={() => toggleTester(m.id)}
                  className="accent-accent"
                />
                <span className="text-sm text-content-primary">{m.name}</span>
                <span className="text-xs text-content-muted ml-auto capitalize">{m.role}</span>
              </label>
            ))}
          </div>
        </FormField>
      </div>
    </Modal>
  );
};
