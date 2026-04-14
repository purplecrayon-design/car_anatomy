import type { ReactNode } from 'react';

interface Props {
  title: string;
  icon?: string;
  variant?: 'default' | 'warning' | 'success';
  children: ReactNode;
}

const VARIANT_STYLES = {
  default: {
    border: 'var(--border)',
    iconBg: 'var(--bg-elevated)',
  },
  warning: {
    border: 'var(--warning)',
    iconBg: 'rgba(241, 196, 15, 0.1)',
  },
  success: {
    border: 'var(--success)',
    iconBg: 'rgba(46, 204, 113, 0.1)',
  },
};

export function DashboardCard({ title, icon, variant = 'default', children }: Props) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${styles.border}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 14px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {icon && (
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 'var(--radius-sm)',
              background: styles.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
            }}
          >
            {icon}
          </span>
        )}
        <h3
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Content */}
      <div style={{ padding: 14 }}>{children}</div>
    </div>
  );
}
