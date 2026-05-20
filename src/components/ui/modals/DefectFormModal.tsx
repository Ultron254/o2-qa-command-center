import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { FormField, TextInput, TextArea, SelectInput } from '../FormField';
import { useToast } from '../Toast';
import { useStore } from '../../../lib/store';
import type { Defect, SeverityLevel, PriorityLevel, DefectStatus } from '../../../lib/types';

interface DefectFormModalProps {
  open: boolean;
  onClose: () => void;
  defect?: Defect;
}

const emptyForm = {
  title: '',
  description: '',
  severity: 'medium' as SeverityLevel,
  priority: 'medium' as PriorityLevel,
  status: 'new' as DefectStatus,
  stepsToReproduce: '',
  expectedBehavior: '',
  actualBehavior: '',
  environment: '',
  browser: '',
  assignee: '',
};

export const DefectFormModal: React.FC<DefectFormModalProps> = ({ open, onClose, defect }) => {
  const { teamMembers, defects, addDefect, updateDefect } = useStore();
  const { toast } = useToast();
  const isEdit = !!defect;

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (defect) {
        setForm({
          title: defect.title,
          description: defect.description,
          severity: defect.severity,
          priority: defect.priority,
          status: defect.status,
          stepsToReproduce: defect.stepsToReproduce,
          expectedBehavior: defect.expectedBehavior,
          actualBehavior: defect.actualBehavior,
          environment: defect.environment,
          browser: defect.browser,
          assignee: defect.assignee,
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [open, defect]);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateId = () => {
    const maxNum = defects.reduce((max, d) => {
      const n = parseInt(d.id.replace('DEF-', ''), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    return `DEF-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const now = new Date().toISOString();

    if (isEdit && defect) {
      updateDefect(defect.id, {
        ...form,
        updatedAt: now,
      });
      toast({ type: 'success', title: 'Defect updated', description: `${defect.id} has been updated.` });
    } else {
      const newDefect: Defect = {
        id: generateId(),
        ...form,
        linkedTestCases: [],
        createdBy: 'current-user',
        createdAt: now,
        updatedAt: now,
      };
      addDefect(newDefect);
      toast({ type: 'success', title: 'Defect created', description: `${newDefect.id} has been logged.` });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Defect — ${defect!.id}` : 'Log New Defect'}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">{isEdit ? 'Update' : 'Create'} Defect</button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Title" required error={errors.title}>
          <TextInput value={form.title} onChange={e => set('title', e.target.value)} placeholder="Brief defect summary" error={!!errors.title} />
        </FormField>

        <FormField label="Description">
          <TextArea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Detailed description of the defect" />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Severity">
            <SelectInput value={form.severity} onChange={e => set('severity', e.target.value)}>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </SelectInput>
          </FormField>
          <FormField label="Priority">
            <SelectInput value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </SelectInput>
          </FormField>
        </div>

        {isEdit && (
          <FormField label="Status">
            <SelectInput value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="verified">Verified</option>
              <option value="closed">Closed</option>
            </SelectInput>
          </FormField>
        )}

        <FormField label="Steps to Reproduce">
          <TextArea value={form.stepsToReproduce} onChange={e => set('stepsToReproduce', e.target.value)} rows={3} placeholder="1. Go to ...&#10;2. Click on ...&#10;3. Observe ..." />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Expected Behavior">
            <TextArea value={form.expectedBehavior} onChange={e => set('expectedBehavior', e.target.value)} rows={2} placeholder="What should happen" />
          </FormField>
          <FormField label="Actual Behavior">
            <TextArea value={form.actualBehavior} onChange={e => set('actualBehavior', e.target.value)} rows={2} placeholder="What actually happens" />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Environment">
            <TextInput value={form.environment} onChange={e => set('environment', e.target.value)} placeholder="e.g. Production, Staging" />
          </FormField>
          <FormField label="Browser">
            <TextInput value={form.browser} onChange={e => set('browser', e.target.value)} placeholder="e.g. Chrome 120, Firefox" />
          </FormField>
        </div>

        <FormField label="Assignee">
          <SelectInput value={form.assignee} onChange={e => set('assignee', e.target.value)}>
            <option value="">Unassigned</option>
            {teamMembers.filter(m => m.active).map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </SelectInput>
        </FormField>
      </div>
    </Modal>
  );
};
