import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  persistent?: boolean;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#0e2e1a', border: '#1a4a2a', icon: 'check' },
  error: { bg: '#2e0e0e', border: '#5a1a1a', icon: '!' },
  warning: { bg: '#2e1e0a', border: '#5a3a1a', icon: '!' },
  info: { bg: '#0e1e2e', border: '#1a3a5a', icon: 'i' },
};

const TOAST_ICONS: Record<ToastType, string> = {
  success: '\u2713',
  error: '\u2717',
  warning: '!',
  info: 'i',
};

function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const colors = TOAST_COLORS[toast.type];
  const icon = TOAST_ICONS[toast.type];

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    // Auto-dismiss after duration
    if (!toast.persistent) {
      const duration = toast.duration || 4000;
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(toast.id), 200);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        maxWidth: 360,
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 'var(--radius-full)',
          background: `${colors.border}80`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-primary)',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Message */}
      <span
        style={{
          flex: 1,
          fontSize: 11,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
        }}
      >
        {toast.message}
      </span>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          padding: 4,
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          fontSize: 12,
          lineHeight: 1,
        }}
        aria-label="Dismiss notification"
      >
        \u2715
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: 8,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <Toast toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

// Hook for creating toasts
let toastId = 0;
let toastListeners: ((toasts: ToastData[]) => void)[] = [];
let toastQueue: ToastData[] = [];

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastData[]) => setToasts(newToasts);
    toastListeners.push(listener);
    setToasts(toastQueue);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return { toasts };
}

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toastQueue]));
}

export const toast = {
  show: (type: ToastType, message: string, options?: { duration?: number; persistent?: boolean }) => {
    const id = `toast-${++toastId}`;
    const newToast: ToastData = {
      id,
      type,
      message,
      duration: options?.duration,
      persistent: options?.persistent,
    };
    toastQueue.push(newToast);
    notifyListeners();
    return id;
  },

  success: (message: string, options?: { duration?: number }) => {
    return toast.show('success', message, options);
  },

  error: (message: string, options?: { duration?: number; persistent?: boolean }) => {
    return toast.show('error', message, { persistent: true, ...options });
  },

  warning: (message: string, options?: { duration?: number }) => {
    return toast.show('warning', message, options);
  },

  info: (message: string, options?: { duration?: number }) => {
    return toast.show('info', message, options);
  },

  dismiss: (id: string) => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    notifyListeners();
  },

  dismissAll: () => {
    toastQueue = [];
    notifyListeners();
  },
};
