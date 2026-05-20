import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Box, ExternalLink } from 'lucide-react';
import { ProductFormModal } from '../components/ui/modals/ProductFormModal';
import type { Product } from '../lib/types';

export const Products: React.FC = () => {
  const { products } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>(undefined);

  const handleAddProduct = () => {
    setEditProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Box size={20} className="text-accent" /> Products
        </h2>
        <button className="btn-primary text-sm" onClick={handleAddProduct}>Add Product</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <Card key={p.id} className="p-5 cursor-pointer" onClick={() => handleEditProduct(p)}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-sm bg-accent/10 flex items-center justify-center">
                <Box size={20} className="text-accent" />
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${p.status === 'active' ? 'bg-status-pass/10 text-status-pass' : 'bg-surface-elevated text-content-muted'}`}>
                {p.status}
              </span>
            </div>
            <h3 className="text-base font-semibold text-content-primary">{p.name} <span className="text-content-muted font-normal">{p.version}</span></h3>
            <p className="text-xs text-content-secondary mt-2 line-clamp-3">{p.description}</p>
            <div className="mt-4 space-y-2 text-xs">
              <a href={p.repositoryUrl} className="flex items-center gap-1 text-content-link hover:underline" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                <ExternalLink size={12} /> Repository
              </a>
              <a href={p.liveUrl} className="flex items-center gap-1 text-content-link hover:underline" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                <ExternalLink size={12} /> Live URL
              </a>
            </div>
          </Card>
        ))}
      </div>

      <ProductFormModal open={showForm} onClose={() => setShowForm(false)} product={editProduct} />
    </div>
  );
};
