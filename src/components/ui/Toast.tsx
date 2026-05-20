import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const iconColors: Record<ToastType, string> = {
  success: 'text-status-pass',
  error: 'text-status-fail',
  warning: 'text-status-blocked',
  info: 'text-accent',
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast: t, onDismiss }) => {
  const Icon = icons[t.type];
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(t.id), t.duration || 4000);
    return () => clearTimeout(timerRef.current);
  }, [t.id, t.duration, onDismiss]);

  return (
    <div className="flex items-start gap-3 p-4 bg-surface-primary border border-line rounded-lg shadow-lg animate-slide-up max-w-sm w-full">
      <Icon size={18} className={`shrink-0 mt-0.5 ${iconColors[t.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-content-primary">{t.title}</p>
        {t.description && <p className="text-xs text-content-secondary mt-0.5">{t.description}</p>}
      </div>
      <button onClick={() => onDismiss(t.id)} className="shrink-0 p-0.5 text-content-muted hover:text-content-primary transition-colors">
        <X size={14} />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts(prev => [...prev.slice(-4), { ...opts, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => <ToastItem key={t.id} toast={t} onDismiss={dismiss} />)}
      </div>
    </ToastContext.Provider>
  );
};
