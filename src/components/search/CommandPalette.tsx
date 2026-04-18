import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useStore } from '@/store';
import { useSearch } from '@/hooks/useSearch';
import { SearchResult } from './SearchResult';
import type { CircuitNode } from '@/types/circuit';
import chargingData from '@/data/vehicles/es300-1997/graphs/charging.json';

interface QuickAction {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const isOpen = useStore((s) => s.commandPaletteOpen);
  const setOpen = useStore((s) => s.setCommandPaletteOpen);
  const query = useStore((s) => s.searchQuery);
  const setQuery = useStore((s) => s.setSearchQuery);
  const setSelectedNode = useStore((s) => s.setSelectedNode);
  const clearTrace = useStore((s) => s.clearTrace);
  const showAllLayers = useStore((s) => s.showAllLayers);
  const hideAllLayers = useStore((s) => s.hideAllLayers);

  // Get circuit nodes for search
  const nodes = useMemo(() => (chargingData as { nodes: CircuitNode[] }).nodes, []);
  const searchResults = useSearch(nodes, query);

  // Quick actions
  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        id: 'clear-trace',
        label: 'Clear current trace',
        shortcut: 'Esc',
        action: () => {
          clearTrace();
          setOpen(false);
        },
      },
      {
        id: 'show-all-layers',
        label: 'Show all layers',
        action: () => {
          showAllLayers();
          setOpen(false);
        },
      },
      {
        id: 'hide-all-layers',
        label: 'Hide all layers',
        action: () => {
          hideAllLayers();
          setOpen(false);
        },
      },
    ],
    [clearTrace, showAllLayers, hideAllLayers, setOpen]
  );

  // Filter quick actions based on query
  const filteredActions = useMemo(() => {
    if (!query || query.startsWith('>')) {
      const actionQuery = query.startsWith('>') ? query.slice(1).toLowerCase() : '';
      return quickActions.filter((a) => a.label.toLowerCase().includes(actionQuery));
    }
    return [];
  }, [query, quickActions]);

  // Combined results
  const allResults = useMemo(() => {
    const items: Array<{ type: 'node' | 'action' | 'recent'; data: CircuitNode | QuickAction | string }> =
      [];

    // Show recent searches if no query
    if (!query && recentSearches.length > 0) {
      recentSearches.slice(0, 3).forEach((search) => {
        items.push({ type: 'recent', data: search });
      });
    }

    // Quick actions (when query starts with >)
    if (query.startsWith('>')) {
      filteredActions.forEach((action) => {
        items.push({ type: 'action', data: action });
      });
    } else {
      // Search results
      searchResults.forEach((node) => {
        items.push({ type: 'node', data: node });
      });
    }

    return items;
  }, [query, searchResults, filteredActions, recentSearches]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [allResults.length]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('car-anatomy-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, allResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (allResults[selectedIndex]) {
            handleSelect(allResults[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          setQuery('');
          break;
      }
    },
    [allResults, selectedIndex, setOpen, setQuery]
  );

  const handleSelect = useCallback(
    (item: (typeof allResults)[number]) => {
      if (item.type === 'node') {
        const node = item.data as CircuitNode;
        setSelectedNode(node.id);
        // Save to recent searches
        const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 10);
        setRecentSearches(updated);
        localStorage.setItem('car-anatomy-recent-searches', JSON.stringify(updated));
      } else if (item.type === 'action') {
        (item.data as QuickAction).action();
      } else if (item.type === 'recent') {
        setQuery(item.data as string);
        return; // Don't close
      }
      setOpen(false);
      setQuery('');
    },
    [query, recentSearches, setSelectedNode, setOpen, setQuery]
  );

  // Close on backdrop click
  const handleBackdropClick = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, [setOpen, setQuery]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 100,
        zIndex: 9000,
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div style={{ padding: 12, borderBottom: '1px solid var(--border-subtle)' }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components... (type > for actions)"
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--bg-base)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              outline: 'none',
            }}
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls="command-palette-results"
            aria-activedescendant={
              allResults[selectedIndex] ? `result-${selectedIndex}` : undefined
            }
          />
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          id="command-palette-results"
          role="listbox"
          style={{
            maxHeight: 320,
            overflowY: 'auto',
          }}
        >
          {allResults.length === 0 && query && (
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: 11,
              }}
            >
              No results found
            </div>
          )}

          {allResults.length === 0 && !query && (
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: 11,
              }}
            >
              Start typing to search components
              <br />
              <span style={{ color: 'var(--text-ghost)', fontSize: 10 }}>
                Type &gt; for quick actions
              </span>
            </div>
          )}

          {allResults.map((item, index) => (
            <div
              key={`${item.type}-${index}`}
              id={`result-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleSelect(item)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                background: index === selectedIndex ? 'var(--bg-elevated)' : 'transparent',
                borderLeft: index === selectedIndex ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'background 0.1s ease',
              }}
            >
              {item.type === 'node' && <SearchResult node={item.data as CircuitNode} />}
              {item.type === 'action' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
                    {(item.data as QuickAction).label}
                  </span>
                  {(item.data as QuickAction).shortcut && (
                    <kbd
                      style={{
                        padding: '2px 6px',
                        background: 'var(--bg-base)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 9,
                        color: 'var(--text-muted)',
                      }}
                    >
                      {(item.data as QuickAction).shortcut}
                    </kbd>
                  )}
                </div>
              )}
              {item.type === 'recent' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--text-ghost)', fontSize: 10 }}>Recent:</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
                    {item.data as string}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer with hints */}
        <div
          style={{
            padding: '8px 12px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            color: 'var(--text-ghost)',
            fontSize: 9,
          }}
        >
          <span>
            <kbd style={{ marginRight: 4 }}>\u2191\u2193</kbd> navigate
          </span>
          <span>
            <kbd style={{ marginRight: 4 }}>\u21B5</kbd> select
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
