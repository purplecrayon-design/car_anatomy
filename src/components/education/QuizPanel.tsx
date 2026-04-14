import { useState, useMemo, useCallback } from 'react';
import { useStore } from '@/store';
import type { QuizScore } from '@/types/quiz';
import type { DifficultyLevel } from '@/types/ui';

// Import quiz data
import chargingQuiz from '@/data/vehicles/es300-1997/quizzes/charging.json';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
}

const QUIZZES: Record<string, QuizQuestion[]> = {
  charging: chargingQuiz as QuizQuestion[],
};

export function QuizPanel() {
  const activeQuizSystem = useStore((s) => s.activeQuizSystem);
  const endQuiz = useStore((s) => s.endQuiz);
  const addScore = useStore((s) => s.addScore);
  const difficulty = useStore((s) => s.difficulty);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Get questions filtered by difficulty
  const questions = useMemo(() => {
    if (!activeQuizSystem) return [];
    const allQuestions = QUIZZES[activeQuizSystem] || [];

    const difficultyLevels: Record<DifficultyLevel, string[]> = {
      beginner: ['beginner'],
      intermediate: ['beginner', 'intermediate'],
      advanced: ['beginner', 'intermediate', 'advanced'],
    };

    const allowed = difficultyLevels[difficulty];
    return allQuestions.filter((q) => allowed.includes(q.difficulty));
  }, [activeQuizSystem, difficulty]);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;

  const handleAnswer = useCallback((index: number) => {
    if (showResult) return; // Already answered
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === currentQuestion?.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  }, [showResult, currentQuestion?.correctIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      setIsComplete(true);
      const score: QuizScore = {
        systemId: activeQuizSystem!,
        difficultyLevel: difficulty,
        score: correctCount + (isCorrect ? 1 : 0),
        totalQuestions: questions.length,
        timestamp: Date.now(),
      };
      addScore(score);
    }
  }, [currentIndex, questions.length, activeQuizSystem, difficulty, correctCount, isCorrect, addScore]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setIsComplete(false);
  }, []);

  // Not in a quiz
  if (!activeQuizSystem || questions.length === 0) {
    return null;
  }

  // Quiz complete screen
  if (isComplete) {
    const finalScore = correctCount + (isCorrect ? 1 : 0);
    const percentage = Math.round((finalScore / questions.length) * 100);
    const isPassing = percentage >= 70;

    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 400,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          padding: 24,
          textAlign: 'center',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Quiz results"
      >
        <div
          style={{
            fontSize: 48,
            marginBottom: 16,
            color: isPassing ? 'var(--success)' : 'var(--warning)',
          }}
        >
          {isPassing ? '\u2713' : '!'}
        </div>
        <h2
          style={{
            fontSize: 18,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          {isPassing ? 'Great Job!' : 'Keep Learning!'}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            marginBottom: 16,
          }}
        >
          You scored {finalScore} out of {questions.length} ({percentage}%)
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={handleRestart}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
          <button
            onClick={endQuiz}
            style={{
              padding: '8px 16px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--bg-base)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 500,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Quiz question ${currentIndex + 1} of ${questions.length}`}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-elevated)',
        }}
      >
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <button
          onClick={endQuiz}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: 16,
            cursor: 'pointer',
            padding: 4,
          }}
          aria-label="Exit quiz"
        >
          \u2715
        </button>
      </div>

      {/* Question */}
      <div style={{ padding: 16 }}>
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          {currentQuestion.question}
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === currentQuestion.correctIndex;
            let bgColor = 'var(--bg-elevated)';
            let borderColor = 'var(--border)';

            if (showResult) {
              if (isCorrectOption) {
                bgColor = 'rgba(102, 187, 106, 0.15)';
                borderColor = 'var(--success)';
              } else if (isSelected && !isCorrectOption) {
                bgColor = 'rgba(239, 83, 80, 0.15)';
                borderColor = 'var(--danger)';
              }
            } else if (isSelected) {
              borderColor = 'var(--accent)';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                style={{
                  padding: '10px 14px',
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)',
                  fontSize: 11,
                  textAlign: 'left',
                  cursor: showResult ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    marginRight: 10,
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                    lineHeight: '16px',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after answer) */}
        {showResult && (
          <div
            style={{
              marginTop: 16,
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
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {showResult && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={handleNext}
            style={{
              padding: '8px 16px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--bg-base)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}
