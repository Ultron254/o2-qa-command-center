import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = true }) => {
  return (
    <div
      className={`rounded-sm transition-all duration-100 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        backgroundColor: '#252526',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      onClick={onClick}
      onMouseEnter={hoverable ? (e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)';
      } : undefined}
      onMouseLeave={hoverable ? (e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
      } : undefined}
    >
      {children}
    </div>
  );
};
