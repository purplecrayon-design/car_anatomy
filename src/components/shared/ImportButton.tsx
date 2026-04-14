import { useCallback, useRef, useState } from 'react';
import { importSession } from '@/services/import';
import type { SessionExport } from '@/types/session';

interface Props {
  onImport: (data: SessionExport) => void;
  variant?: 'icon' | 'text' | 'full';
  disabled?: boolean;
}

export function ImportButton({ onImport, variant = 'full', disabled = false }: Props) {
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (disabled || isImporting) return;
    fileInputRef.current?.click();
  }, [disabled, isImporting]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      setError(null);

      try {
        const data = await importSession(file);
        onImport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import session');
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsImporting(false);
        // Reset file input so same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onImport]
  );

  const iconOnly = variant === 'icon';
  const showIcon = variant !== 'text';
  const showText = variant !== 'icon';

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <button
        onClick={handleClick}
        disabled={disabled || isImporting}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: iconOnly ? '6px' : '6px 12px',
          background: error ? 'rgba(239, 83, 80, 0.15)' : 'var(--bg-elevated)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          color: error ? 'var(--danger)' : 'var(--text-secondary)',
          fontSize: 10,
          cursor: disabled || isImporting ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition-fast)',
          minWidth: iconOnly ? 28 : undefined,
        }}
        aria-label="Import session"
        title={error || 'Import session from file'}
      >
        {showIcon && (
          <span style={{ fontSize: 12 }}>
            {error ? '\u2717' : isImporting ? '\u21BB' : '\u2912'}
          </span>
        )}
        {showText && (
          <span>
            {error ? 'Error' : isImporting ? 'Importing...' : 'Import'}
          </span>
        )}
      </button>
    </>
  );
}
