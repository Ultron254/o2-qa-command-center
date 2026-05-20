import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, error, children, className = '' }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-content-primary mb-1.5">
      {label}
      {required && <span className="text-status-fail ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-status-fail mt-1">{error}</p>}
  </div>
);

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ error, className = '', ...props }) => (
  <input
    className={`input w-full ${error ? 'border-status-fail focus:border-status-fail focus:ring-status-fail/20' : ''} ${className}`}
    {...props}
  />
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({ error, className = '', ...props }) => (
  <textarea
    className={`input w-full resize-none ${error ? 'border-status-fail' : ''} ${className}`}
    {...props}
  />
);

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({ error, className = '', children, ...props }) => (
  <select
    className={`input w-full ${error ? 'border-status-fail' : ''} ${className}`}
    {...props}
  >
    {children}
  </select>
);
