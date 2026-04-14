import { useCallback, useState } from 'react';

interface QuizOption {
  label: string;
  isCorrect: boolean;
}

interface Props {
  question: string;
  options: QuizOption[];
  explanation?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onAnswer?: (isCorrect: boolean, selectedIndex: number) => void;
  disabled?: boolean;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'var(--success)',
  intermediate: 'var(--warning)',
  advanced: 'var(--danger)',
};

export function QuizQuestion({
  question,
  options,
  explanation,
  difficulty,
  onAnswer,
  disabled = false,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const correctIndex = options.findIndex((opt) => opt.isCorrect);
  const isCorrect = selectedIndex === correctIndex;

  const handleSelect = useCallback(
    (index: number) => {
      if (showResult || disabled) return;
      setSelectedIndex(index);
      setShowResult(true);
      onAnswer?.(options[index].isCorrect, index);
    },
    [showResult, disabled, options, onAnswer]
  );

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      {difficulty && (
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-elevated)',
          }}
        >
          <span
            style={{
              padding: '2px 6px',
              background: DIFFICULTY_COLORS[difficulty],
              borderRadius: 'var(--radius-sm)',
              fontSize: 8,
              fontWeight: 600,
              color: 'var(--bg-base)',
              textTransform: 'uppercase',
            }}
          >
            {difficulty}
          </span>
        </div>
      )}

      {/* Question */}
      <div style={{ padding: 14 }}>
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            margin: 0,
            marginBottom: 14,
          }}
        >
          {question}
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isCorrectOption = option.isCorrect;
            let bgColor = 'var(--bg-elevated)';
            let borderColor = 'var(--border)';
            let textColor = 'var(--text-secondary)';

            if (showResult) {
              if (isCorrectOption) {
                bgColor = 'rgba(102, 187, 106, 0.15)';
                borderColor = 'var(--success)';
                textColor = 'var(--success)';
              } else if (isSelected && !isCorrectOption) {
                bgColor = 'rgba(239, 83, 80, 0.15)';
                borderColor = 'var(--danger)';
                textColor = 'var(--danger)';
              }
            } else if (isSelected) {
              borderColor = 'var(--accent)';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showResult || disabled}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--radius-sm)',
                  color: textColor,
                  fontSize: 11,
                  textAlign: 'left',
                  cursor: showResult || disabled ? 'default' : 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                aria-pressed={isSelected}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${borderColor}`,
                    fontSize: 10,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {showResult && isCorrectOption ? (
                    <span style={{ color: 'var(--success)' }}>&#10003;</span>
                  ) : showResult && isSelected && !isCorrectOption ? (
                    <span style={{ color: 'var(--danger)' }}>&#10005;</span>
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && explanation && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              background: isCorrect ? 'rgba(102, 187, 106, 0.1)' : 'rgba(255, 167, 38, 0.1)',
              border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--warning)'}`,
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: isCorrect ? 'var(--success)' : 'var(--warning)',
                marginBottom: 4,
              }}
            >
              {isCorrect ? 'Correct!' : 'Not quite...'}
            </div>
            <p
              style={{
                fontSize: 10,
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
