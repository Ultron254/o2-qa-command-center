import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { FormField, TextInput, SelectInput } from '../FormField';
import { useToast } from '../Toast';
import { useStore } from '../../../lib/store';
import type { TeamMember } from '../../../lib/types';

interface TeamMemberFormModalProps {
  open: boolean;
  onClose: () => void;
  member?: TeamMember;
}

const emptyForm = {
  name: '',
  email: '',
  role: 'tester' as TeamMember['role'],
};

export const TeamMemberFormModal: React.FC<TeamMemberFormModalProps> = ({ open, onClose, member }) => {
  const { products, teamMembers, addTeamMember, updateTeamMember } = useStore();
  const { toast } = useToast();
  const isEdit = !!member;

  const [form, setForm] = useState(emptyForm);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (member) {
        setForm({
          name: member.name,
          email: member.email,
          role: member.role,
        });
        setSelectedProducts([...member.productsAssigned]);
      } else {
        setForm(emptyForm);
        setSelectedProducts([]);
      }
      setErrors({});
    }
  }, [open, member]);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateId = () => {
    const maxNum = teamMembers.reduce((max, m) => {
      const n = parseInt(m.id.replace('TM-', ''), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    return `TM-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && member) {
      updateTeamMember(member.id, {
        name: form.name,
        email: form.email,
        role: form.role,
        productsAssigned: selectedProducts,
      });
      toast({ type: 'success', title: 'Team member updated', description: `${form.name} has been updated.` });
    } else {
      const newMember: TeamMember = {
        id: generateId(),
        name: form.name,
        email: form.email,
        role: form.role,
        productsAssigned: selectedProducts,
        active: true,
      };
      addTeamMember(newMember);
      toast({ type: 'success', title: 'Team member added', description: `${newMember.name} has joined the team.` });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Team Member — ${member!.name}` : 'New Team Member'}
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">{isEdit ? 'Update' : 'Add'} Member</button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Name" required error={errors.name}>
          <TextInput value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" error={!!errors.name} />
        </FormField>

        <FormField label="Email" required error={errors.email}>
          <TextInput type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" error={!!errors.email} />
        </FormField>

        <FormField label="Role">
          <SelectInput value={form.role} onChange={e => set('role', e.target.value)}>
            <option value="lead">Lead</option>
            <option value="tester">Tester</option>
            <option value="developer">Developer</option>
          </SelectInput>
        </FormField>

        <FormField label="Assigned Products">
          <div className="max-h-40 overflow-y-auto border border-line rounded-lg p-2 space-y-1 bg-surface-secondary/30">
            {products.length === 0 && <p className="text-xs text-content-muted p-2">No products available</p>}
            {products.map(p => (
              <label key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-hover cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                  className="accent-accent"
                />
                <span className="text-sm text-content-primary">{p.name}</span>
                <span className="text-xs text-content-muted ml-auto">{p.version}</span>
              </label>
            ))}
          </div>
        </FormField>
      </div>
    </Modal>
  );
};
