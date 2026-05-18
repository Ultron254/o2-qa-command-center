import React from 'react';
import { useStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Users, Mail, Shield } from 'lucide-react';

export const Team: React.FC = () => {
  const { teamMembers, products } = useStore();

  const roleColors: Record<string, string> = {
    lead: 'bg-azure-blue/10 text-azure-blue',
    tester: 'bg-azure-blue-text/10 text-azure-blue-text',
    developer: 'bg-status-blocked/10 text-status-blocked',
  };

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users size={20} className="text-azure-blue" /> Team
        </h2>
        <button className="btn-primary text-sm">Add Member</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map(member => (
          <Card key={member.id} className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-azure-blue/20 flex items-center justify-center text-azure-blue font-bold text-lg shrink-0">
                {member.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-text-primary">{member.name}</h3>
                  {member.active ? (
                    <span className="w-2 h-2 rounded-full bg-status-pass" title="Active" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-text-muted" title="Inactive" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${roleColors[member.role]}`}>
                    {member.role}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-text-muted">
                  <Mail size={12} /> {member.email}
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted">
                  <Shield size={12} /> Products:
                  {member.productsAssigned.map(pid => {
                    const prod = products.find(p => p.id === pid);
                    return (
                      <span key={pid} className="px-1.5 py-0.5 bg-bg-elevated rounded text-text-secondary ml-1">
                        {prod?.name || pid}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
