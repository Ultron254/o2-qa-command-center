import React from 'react';
import { useStore } from '../lib/store';

import { Server, ExternalLink } from 'lucide-react';

export const Environments: React.FC = () => {
  const { environments } = useStore();

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Server size={20} className="text-azure-blue-text" /> Environments
        </h2>
        <button className="btn-primary text-sm">Add Environment</button>
      </div>
      <div className="border border-border-default overflow-hidden">
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
                  <a href={env.url} target="_blank" rel="noreferrer" className="text-azure-blue-text hover:underline text-xs flex items-center gap-1">
                    {env.url} <ExternalLink size={10} />
                  </a>
                </td>
                <td className="table-cell text-center">
                  <span className="text-xs px-2 py-0.5 rounded bg-bg-elevated text-text-secondary capitalize">{env.type}</span>
                </td>
                <td className="table-cell text-center">
                  <span className={`inline-flex items-center gap-1 text-xs ${env.status === 'active' ? 'text-status-pass' : 'text-text-muted'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${env.status === 'active' ? 'bg-status-pass' : 'bg-text-muted'}`} />
                    {env.status}
                  </span>
                </td>
                <td className="table-cell text-text-muted text-xs">{env.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
