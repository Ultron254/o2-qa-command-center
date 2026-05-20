import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Server, ExternalLink } from 'lucide-react';
import { EnvironmentFormModal } from '../components/ui/modals/EnvironmentFormModal';

export const Environments: React.FC = () => {
  const { environments } = useStore();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Server size={20} className="text-content-link" /> Environments
        </h2>
        <button className="btn-primary text-sm" onClick={() => setShowForm(true)}>Add Environment</button>
      </div>
      <div className="border border-line overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header text-left">Name</th>
              <th className="table-header text-left">URL</th>
              <th className="table-header text-center">Type</th>
              <th className="table-header text-center">Status</th>
              <th className="table-header text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {environments.map(env => (
              <tr key={env.id} className="table-row">
                <td className="table-cell font-medium">{env.name}</td>
                <td className="table-cell">
                  <a href={env.url} target="_blank" rel="noreferrer" className="text-content-link hover:underline text-xs flex items-center gap-1">
                    {env.url} <ExternalLink size={10} />
                  </a>
                </td>
                <td className="table-cell text-center">
                  <span className="text-xs px-2 py-0.5 rounded bg-surface-elevated text-content-secondary capitalize">{env.type}</span>
                </td>
                <td className="table-cell text-center">
                  <span className={`inline-flex items-center gap-1 text-xs ${env.status === 'active' ? 'text-status-pass' : 'text-content-muted'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${env.status === 'active' ? 'bg-status-pass' : 'bg-content-muted'}`} />
                    {env.status}
                  </span>
                </td>
                <td className="table-cell text-content-muted text-xs">{env.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EnvironmentFormModal open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
};
