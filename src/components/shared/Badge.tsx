import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'system';

interface Props {
  children: ReactNode;
  variant?: BadgeVariant;
  systemColor?: string;
  size?: 'sm' | 'md';
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  default: {
    bg: 'var(--bg-base)',
    color: 'var(--text-muted)',
    border: 'var(--border-subtle)',
  },
  primary: {
    bg: 'rgba(86, 180, 233, 0.15)',
    color: 'var(--accent)',
    border: 'rgba(86, 180, 233, 0.3)',
  },
  success: {
    bg: 'rgba(102, 187, 106, 0.15)',
    color: 'var(--success)',
    border: 'rgba(102, 187, 106, 0.3)',
  },
  warning: {
    bg: 'rgba(255, 167, 38, 0.15)',
    color: 'var(--warning)',
    border: 'rgba(255, 167, 38, 0.3)',
  },
  danger: {
    bg: 'rgba(239, 83, 80, 0.15)',
    color: 'var(--danger)',
    border: 'rgba(239, 83, 80, 0.3)',
  },
  system: {
    bg: 'var(--bg-base)',
    color: 'var(--bg-base)',
    border: 'transparent',
  },
};

export function Badge({ children, variant = 'default', systemColor, size = 'sm' }: Props) {
  const styles = VARIANT_STYLES[variant];
  const isSystem = variant === 'system' && systemColor;

  const padding = size === 'sm' ? '2px 6px' : '4px 8px';
  const fontSize = size === 'sm' ? 8 : 9;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        background: isSystem ? systemColor : styles.bg,
        color: isSystem ? 'var(--bg-base)' : styles.color,
        border: `1px solid ${isSystem ? 'transparent' : styles.border}`,
        borderRadius: 'var(--radius-sm)',
        fontSize,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
