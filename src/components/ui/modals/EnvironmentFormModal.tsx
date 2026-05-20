import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { FormField, TextInput, TextArea, SelectInput } from '../FormField';
import { useToast } from '../Toast';
import { useStore } from '../../../lib/store';
import type { Environment } from '../../../lib/types';

interface EnvironmentFormModalProps {
  open: boolean;
  onClose: () => void;
  environment?: Environment;
}

const emptyForm = {
  name: '',
  url: '',
  type: 'cloud' as Environment['type'],
  status: 'active' as Environment['status'],
  notes: '',
};

export const EnvironmentFormModal: React.FC<EnvironmentFormModalProps> = ({ open, onClose, environment }) => {
  const { environments, addEnvironment, updateEnvironment } = useStore();
  const { toast } = useToast();
  const isEdit = !!environment;

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (environment) {
        setForm({
          name: environment.name,
          url: environment.url,
          type: environment.type,
          status: environment.status,
          notes: environment.notes,
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [open, environment]);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateId = () => {
    const maxNum = environments.reduce((max, e) => {
      const n = parseInt(e.id.replace('ENV-', ''), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    return `ENV-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && environment) {
      updateEnvironment(environment.id, { ...form });
      toast({ type: 'success', title: 'Environment updated', description: `${environment.name} has been updated.` });
    } else {
      const newEnv: Environment = {
        id: generateId(),
        ...form,
      };
      addEnvironment(newEnv);
      toast({ type: 'success', title: 'Environment created', description: `${newEnv.name} has been added.` });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Environment — ${environment!.name}` : 'New Environment'}
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">{isEdit ? 'Update' : 'Create'} Environment</button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Name" required error={errors.name}>
          <TextInput value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Production, Staging" error={!!errors.name} />
        </FormField>

        <FormField label="URL">
          <TextInput value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://staging.example.com" />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Type">
            <SelectInput value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="local">Local</option>
              <option value="cloud">Cloud</option>
            </SelectInput>
          </FormField>
          <FormField label="Status">
            <SelectInput value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </SelectInput>
          </FormField>
        </div>

        <FormField label="Notes">
          <TextArea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Additional notes about this environment" />
        </FormField>
      </div>
    </Modal>
  );
};
