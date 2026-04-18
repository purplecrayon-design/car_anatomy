import { useState, useCallback } from 'react';
import type { TestCondition, VoltageResult, VoltageReading } from '@/types/diagnostic';

interface Props {
  testPointId: string;
  testPointLabel: string;
  expectedVoltage?: number;
  onSubmit: (reading: Omit<VoltageReading, 'id' | 'sessionId'>) => void;
}

const CONDITIONS: { value: TestCondition; label: string }[] = [
  { value: 'key_off', label: 'Key Off' },
  { value: 'koeo', label: 'KOEO' },
  { value: 'koer', label: 'KOER' },
  { value: 'cranking', label: 'Cranking' },
];

function calculateResult(expected: number, actual: number): VoltageResult {
  const diff = Math.abs(expected - actual);
  const pctDiff = diff / expected;

  if (pctDiff <= 0.05) return 'pass'; // Within 5%
  if (pctDiff <= 0.15) return 'warning'; // Within 15%
  return 'fail';
}

export function VoltageInput({ testPointId, testPointLabel, expectedVoltage = 12.6, onSubmit }: Props) {
  const [actual, setActual] = useState<string>('');
  const [condition, setCondition] = useState<TestCondition>('koeo');

  const handleSubmit = useCallback(() => {
    const actualValue = parseFloat(actual);
    if (isNaN(actualValue)) return;

    const result = calculateResult(expectedVoltage, actualValue);

    onSubmit({
      testPointId,
      expected: expectedVoltage,
      actual: actualValue,
      condition,
      result,
      timestamp: Date.now(),
    });

    setActual('');
  }, [actual, condition, expectedVoltage, testPointId, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const previewResult = actual ? calculateResult(expectedVoltage, parseFloat(actual)) : null;

  const resultColors = {
    pass: 'var(--success)',
    warning: 'var(--warning)',
    fail: 'var(--danger)',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {testPointLabel}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Expected: {expectedVoltage}V
        </span>
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Voltage input */}
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="number"
            step="0.1"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '8px 32px 8px 12px',
              background: 'var(--bg-base)',
              border: `1px solid ${
                previewResult ? resultColors[previewResult] + '80' : 'var(--border)'
              }`,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontFamily: 'var(--font-mono)',
              outline: 'none',
            }}
            aria-label="Measured voltage"
          />
          <span
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: 12,
            }}
          >
            V
          </span>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!actual}
          style={{
            padding: '10px 16px',
            minHeight: 40,
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--bg-base)',
            fontSize: 12,
            fontWeight: 600,
            cursor: actual ? 'pointer' : 'not-allowed',
            opacity: actual ? 1 : 0.5,
            transition: 'transform 0.1s ease, opacity 0.15s ease',
          }}
          aria-label="Record voltage reading"
        >
          Record
        </button>
      </div>

      {/* Condition selector - 36px touch targets */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {CONDITIONS.map((c) => (
          <button
            key={c.value}
            onClick={() => setCondition(c.value)}
            style={{
              padding: '8px 12px',
              minHeight: 36,
              background: condition === c.value ? 'var(--bg-base)' : 'transparent',
              border: `1px solid ${
                condition === c.value ? 'var(--accent)' : 'var(--border-subtle)'
              }`,
              borderRadius: 'var(--radius-sm)',
              color: condition === c.value ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            aria-pressed={condition === c.value}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Result preview */}
      {previewResult && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 12px',
            background: resultColors[previewResult] + '15',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 'var(--radius-full)',
              background: resultColors[previewResult],
            }}
          />
          <span style={{ fontSize: 12, color: resultColors[previewResult], fontWeight: 500 }}>
            {previewResult === 'pass' && 'Within spec'}
            {previewResult === 'warning' && 'Marginal - verify'}
            {previewResult === 'fail' && 'Out of spec'}
          </span>
        </div>
      )}
    </div>
  );
}
