import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomBar } from './BottomBar';
import { DetailPanel } from './DetailPanel';
import { MobileTabBar } from './MobileTabBar';
import { VehicleCanvas } from '../diagram/VehicleCanvas';
import { CommandPalette } from '../search/CommandPalette';
import { SkipLink } from '../accessibility/SkipLink';
import { LayerPanel } from '../layers/LayerPanel';
import { DiagnosticPanel } from '../notepad/DiagnosticPanel';
import { GuidedTour } from '../education/GuidedTour';
import { QuizPanel } from '../education/QuizPanel';
import { useResponsive } from '@/hooks/useResponsive';

type MobileTab = 'diagram' | 'layers' | 'components' | 'session';

export function AppShell() {
  const bp = useResponsive();
  const isMobile = bp === 'mobile' || bp === 'tablet';
  const [mobileTab, setMobileTab] = useState<MobileTab>('diagram');

  return (
    <>
      {/* Skip link for keyboard navigation */}
      <SkipLink targetId="main-content" />

      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: bp === 'desktop' ? '216px 1fr 260px' : '1fr',
          gridTemplateRows: bp === 'desktop' ? '44px 1fr 24px' : '44px 1fr 56px',
          background: 'var(--bg-base)',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Top bar spans full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <TopBar />
        </div>

        {/* Desktop layout: Sidebar | Canvas | Detail */}
        {bp === 'desktop' && (
          <>
            <Sidebar />
            <div id="main-content" tabIndex={-1}>
              <VehicleCanvas />
            </div>
            <DetailPanel />
          </>
        )}

        {/* Mobile/Tablet layout: Tab-based navigation */}
        {isMobile && (
          <div id="main-content" tabIndex={-1} style={{ overflow: 'hidden' }}>
            {/* Diagram tab */}
            {mobileTab === 'diagram' && <VehicleCanvas />}

            {/* Layers tab */}
            {mobileTab === 'layers' && (
              <div
                style={{
                  padding: 16,
                  height: '100%',
                  overflowY: 'auto',
                  background: 'var(--bg-surface)',
                }}
              >
                <LayerPanel />
              </div>
            )}

            {/* Components tab */}
            {mobileTab === 'components' && (
              <div style={{ height: '100%', overflowY: 'auto' }}>
                <DetailPanel />
              </div>
            )}

            {/* Session tab */}
            {mobileTab === 'session' && (
              <div
                style={{
                  padding: 16,
                  height: '100%',
                  overflowY: 'auto',
                  background: 'var(--bg-surface)',
                }}
              >
                <DiagnosticPanel />
              </div>
            )}
          </div>
        )}

        {/* Bottom bar - desktop only */}
        {bp === 'desktop' && (
          <div style={{ gridColumn: '1 / -1' }}>
            <BottomBar />
          </div>
        )}

        {/* Mobile tab bar */}
        {isMobile && <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />}
      </div>

      {/* Command palette (modal) */}
      <CommandPalette />

      {/* Educational overlays */}
      <GuidedTour />
      <QuizPanel />
    </>
  );
}
