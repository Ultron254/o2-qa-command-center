import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { FormField, TextInput, TextArea, SelectInput } from '../FormField';
import { useToast } from '../Toast';
import { useStore } from '../../../lib/store';
import type { Product } from '../../../lib/types';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
}

const emptyForm = {
  name: '',
  version: '',
  repositoryUrl: '',
  liveUrl: '',
  description: '',
  status: 'active' as Product['status'],
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ open, onClose, product }) => {
  const { products, addProduct, updateProduct } = useStore();
  const { toast } = useToast();
  const isEdit = !!product;

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (product) {
        setForm({
          name: product.name,
          version: product.version,
          repositoryUrl: product.repositoryUrl,
          liveUrl: product.liveUrl,
          description: product.description,
          status: product.status,
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [open, product]);

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
    const maxNum = products.reduce((max, p) => {
      const n = parseInt(p.id.replace('PROD-', ''), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    return `PROD-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && product) {
      updateProduct(product.id, { ...form });
      toast({ type: 'success', title: 'Product updated', description: `${product.name} has been updated.` });
    } else {
      const newProduct: Product = {
        id: generateId(),
        ...form,
        icon: '📦',
      };
      addProduct(newProduct);
      toast({ type: 'success', title: 'Product created', description: `${newProduct.name} has been added.` });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Product — ${product!.name}` : 'New Product'}
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">{isEdit ? 'Update' : 'Create'} Product</button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Name" required error={errors.name}>
          <TextInput value={form.name} onChange={e => set('name', e.target.value)} placeholder="Product name" error={!!errors.name} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Version">
            <TextInput value={form.version} onChange={e => set('version', e.target.value)} placeholder="e.g. 2.1.0" />
          </FormField>
          <FormField label="Status">
            <SelectInput value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </SelectInput>
          </FormField>
        </div>

        <FormField label="Repository URL">
          <TextInput value={form.repositoryUrl} onChange={e => set('repositoryUrl', e.target.value)} placeholder="https://github.com/..." />
        </FormField>

        <FormField label="Live URL">
          <TextInput value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://app.example.com" />
        </FormField>

        <FormField label="Description">
          <TextArea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Brief product description" />
        </FormField>
      </div>
    </Modal>
  );
};
