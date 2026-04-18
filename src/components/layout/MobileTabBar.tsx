import { useState, useCallback } from 'react';
import { useStore } from '@/store';

type TabId = 'diagram' | 'layers' | 'components' | 'session';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'diagram', label: 'Diagram', icon: 'D' },
  { id: 'layers', label: 'Layers', icon: 'L' },
  { id: 'components', label: 'Parts', icon: 'P' },
  { id: 'session', label: 'Session', icon: 'S' },
];

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function MobileTabBar({ activeTab, onTabChange }: Props) {
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const statuses = useStore((s) => s.componentStatuses);

  // Calculate badge counts
  const testedCount = Object.values(statuses).filter((s) => s !== 'untested').length;

  const handleTabClick = useCallback(
    (tabId: TabId) => {
      onTabChange(tabId);
    },
    [onTabChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, tabId: TabId) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTabClick(tabId);
      }
    },
    [handleTabClick]
  );

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        background: 'rgba(30, 41, 59, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(51, 65, 85, 0.5)',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      role="tablist"
      aria-label="Main navigation"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const hasBadge = tab.id === 'components' && selectedNodeId;
        const hasCount = tab.id === 'session' && testedCount > 0;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              padding: '8px 0',
            }}
          >
            {/* Icon - 36px touch target */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--accent)' : 'var(--bg-elevated)',
                color: isActive ? 'var(--bg-base)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 600,
                transition: 'background 0.15s ease, color 0.15s ease, transform 0.1s ease',
                position: 'relative',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {tab.icon}

              {/* Badge indicator */}
              {hasBadge && (
                <div
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 10,
                    height: 10,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent)',
                    border: '2px solid var(--bg-surface)',
                  }}
                />
              )}

              {/* Count badge */}
              {hasCount && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -8,
                    minWidth: 18,
                    height: 16,
                    padding: '0 5px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--success)',
                    color: 'var(--bg-base)',
                    fontSize: 10,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {testedCount}
                </div>
              )}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: 11,
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
                transition: 'color 0.15s ease',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// Hook to manage mobile tab state
export function useMobileTab() {
  const [activeTab, setActiveTab] = useState<TabId>('diagram');
  return { activeTab, setActiveTab };
}
