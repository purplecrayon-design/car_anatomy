import { useCallback, useState } from 'react';
import { useStore } from '@/store';
import { encodeSessionUrl } from '@/services/share';

interface Props {
  variant?: 'icon' | 'text' | 'full';
  disabled?: boolean;
}

export function ShareButton({ variant = 'full', disabled = false }: Props) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionName = useStore((s) => s.sessionName);
  const componentStatuses = useStore((s) => s.componentStatuses);
  const layers = useStore((s) => s.layers);
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const currentPage = useStore((s) => s.currentPage);

  const handleShare = useCallback(async () => {
    if (disabled) return;

    setError(null);

    const shareData = {
      sessionName,
      statuses: componentStatuses,
      layers,
      selectedNodeId,
      currentPage,
    };

    const { url, truncated } = encodeSessionUrl(shareData);

    if (truncated) {
      setError('Session too large to share via URL');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      // Try native share API first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: 'LexWire Session',
          text: sessionName || 'Diagnostic session',
          url,
        });
        setCopied(true);
      } else {
        // Fall back to clipboard
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // User cancelled share or clipboard failed
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Failed to share');
        setTimeout(() => setError(null), 3000);
      }
    }
  }, [disabled, sessionName, componentStatuses, layers, selectedNodeId, currentPage]);

  const iconOnly = variant === 'icon';
  const showIcon = variant !== 'text';
  const showText = variant !== 'icon';

  const getIcon = () => {
    if (error) return '\u2717';
    if (copied) return '\u2713';
    return '\u2197';
  };

  const getText = () => {
    if (error) return 'Error';
    if (copied) return 'Copied!';
    return 'Share';
  };

  return (
    <button
      onClick={handleShare}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: iconOnly ? '6px' : '6px 12px',
        background: error
          ? 'rgba(239, 83, 80, 0.15)'
          : copied
            ? 'rgba(102, 187, 106, 0.15)'
            : 'var(--bg-elevated)',
        border: `1px solid ${error ? 'var(--danger)' : copied ? 'var(--success)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)',
        color: error ? 'var(--danger)' : copied ? 'var(--success)' : 'var(--text-secondary)',
        fontSize: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        minWidth: iconOnly ? 28 : undefined,
      }}
      aria-label="Share session"
      title={error || 'Share session via URL'}
    >
      {showIcon && <span style={{ fontSize: 12 }}>{getIcon()}</span>}
      {showText && <span>{getText()}</span>}
    </button>
  );
}
