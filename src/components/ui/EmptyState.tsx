import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox, title, description, action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
      <Icon size={28} className="text-accent" />
    </div>
    <h3 className="text-base font-semibold text-content-primary mb-1">{title}</h3>
    {description && <p className="text-sm text-content-secondary max-w-md mb-4">{description}</p>}
    {action}
  </div>
);
