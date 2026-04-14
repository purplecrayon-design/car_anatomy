# LexWire Development TODO

## Current Status: Anatomy Explorer Migration

The core wiring diagram app is functional with all 23 UI components implemented. Now pivoting to anatomy-style vehicle explorer per PRD.

---

## Phase 1: Foundation (Sprint 1)
*Silhouettes + layer controls + basic click handling*

### New Store Slices
- [ ] **vehicleSlice** - Vehicle/model state (currentVehicle: es300|camry, currentView: side|top)
- [ ] **Extend layerSlice** - Add globalOpacity, isolatedLayers, multiSelectColors, toggleAllLayers

### Core Components
- [ ] **VehicleCanvas.tsx** - Replace DiagramCanvas with silhouette-based renderer
  - Base silhouette image loading
  - Layer compositing with opacity
  - Component click handling via data-component-id
  - Pulsing selection highlight
- [ ] **Enhance LayerPanel** - Add master show/hide all, global opacity slider, isolate mode

### Data Structure
- [ ] Create `src/data/vehicles/es300-1997/silhouettes/` directory
- [ ] Define ANATOMY_LAYERS constant (7 layers: engine, wiring, fuel, cooling, intake/exhaust, suspension, body electrical)
- [ ] Create `src/types/layers.ts` with AnatomyLayer interface

### Assets Needed
- [ ] side-view.svg (1200×800 base silhouette)
- [ ] top-down.svg (1200×800 alternative view)
- [ ] engine-mechanical.svg layer
- [ ] wiring-harnesses.svg layer
- [ ] fuel-system.svg layer
- [ ] cooling-system.svg layer
- [ ] intake-exhaust.svg layer
- [ ] suspension-brakes.svg layer
- [ ] body-electrical.svg layer

---

## Phase 2: InfoPanel + Manual Integration (Sprint 2)
*Tabbed InfoPanel with Manual, Wiring, OBD, Torque tabs*

### Store & Data
- [ ] **manualSlice** - PDF index state, getComponentData accessor
- [ ] **pdf-index.json** - Map componentId to manual page, excerpt, screenshot, torque specs, OBD PIDs
- [ ] **generate-pdf-index.mjs** - Script to build index from reference PDFs

### InfoPanel Components
- [ ] **InfoPanel.tsx** - 5-tab container (Manual|Wiring|OBD|Torque|Notes)
  - Shared 1MZ-FE parts banner
  - Collapsible on desktop, full-screen modal on mobile
- [ ] **ManualTab.tsx** - PDF name, page number, excerpt text, screenshot
- [ ] **WiringTab.tsx** - Highlighted wiring diagram section
- [ ] **OBDTab.tsx** - PIDs, expected values, red flags
- [ ] **TorqueTab.tsx** - N·m / kgf·cm / ft·lbf table

### Data Files
- [ ] Create `public/data/manual-screenshots/` for Haynes page images
- [ ] Create `src/data/obd-reference.json` for PID definitions
- [ ] Create `src/data/torque-specs.json` for fastener specifications

---

## Phase 3: Notepad System (Sprint 3)
*Persistent component-scoped notes with tags and search*

### Database
- [ ] **Extend Dexie schema v2** - Add Note and ComponentVisit tables
- [ ] Note schema: id, componentId, vehicleId, sessionId, text, tags[], haynesPage, timestamps

### Store
- [ ] **notesSlice** - CRUD operations, search, tag filtering, export

### Components
- [ ] **NotesTab.tsx** - Component-scoped notepad with tag selector
- [ ] **NoteCard.tsx** - Individual note display with edit/delete
- [ ] **GlobalNotesView.tsx** - Full-text search, tag filters, export to JSON/Markdown
- [ ] **TagFilter.tsx** - Multi-select tag filter component

### Note Tags
- diagnostic, concept, torque, obd, problem

---

## Phase 4: Dashboard + Model Toggle + Quizzes (Sprint 4)
*Home screen, vehicle selector, learning system*

### Dashboard
- [ ] **Dashboard.tsx** - Home screen with 4 cards
- [ ] **DashboardCard.tsx** - Card container component
- [ ] **Recent Inspections card** - Last 5 components visited
- [ ] **Flagged Issues card** - Notes tagged "problem"
- [ ] **Learning Progress card** - % nodes visited + heatmap
- [ ] **Quick OBD Reference card** - Mini data sheet

### Model Selector
- [ ] **ModelSelector.tsx** - ES300 ↔ Camry toggle in TopBar
- [ ] Vehicle switching preserves notes (keyed by componentId + vehicleId)
- [ ] Instant layer reload on switch

### Quiz Enhancements
- [ ] **SystemQuiz.tsx** - "Learn This System" button on layers
- [ ] Auto-generate 5-10 questions via BFS from layer graph
- [ ] Progress saved per user session

---

## Phase 5: Polish + Testing + Camry (Sprint 5)
*Accessibility, mobile optimization, Camry finalization*

### Accessibility
- [ ] ARIA labels on all interactive elements
- [ ] Tab order follows visual layout
- [ ] Visible focus indicators
- [ ] High contrast mode testing
- [ ] Screen reader layer change announcements
- [ ] Reduced motion preference support

### Mobile
- [ ] Touch targets ≥ 44px
- [ ] Pinch-to-zoom on silhouette
- [ ] Swipe gestures for tab switching
- [ ] Bottom sheet InfoPanel on mobile
- [ ] Haptic feedback on status changes

### Camry Data
- [ ] Create `src/data/vehicles/camry-1997/` directory
- [ ] Symlink shared 1MZ-FE data from es300-1997
- [ ] Create Camry-specific suspension-brakes.svg
- [ ] Create Camry-specific body-electrical.svg

### Testing
- [ ] vehicle-switching.test.tsx
- [ ] layer-interactions.test.tsx
- [ ] notes-persistence.test.tsx
- [ ] offline-functionality.test.tsx
- [ ] pdf-index-loading.test.tsx

---

## Previously Completed (Pre-PRD)

### Components (23 total)
- [x] OpacitySlider, LayerRow, LayerModeSelector
- [x] Badge, VoltageDisplay, ConnectedWires, PinoutTable
- [x] BreadcrumbTrail, Section
- [x] TourStep, QuizQuestion, DifficultyToggle
- [x] ExportButton, ImportButton, ShareButton
- [x] TouchTargets, ZoneLabels, AnnotationMarker
- [x] ScreenReaderTable, ReducedMotion, OfflineBanner, Disclaimer

### Core Features
- [x] Circuit graph with BFS tracing
- [x] Layer visibility and opacity control
- [x] Diagnostic status tracking (5 states)
- [x] Voltage reading input and display
- [x] Session persistence (IndexedDB)
- [x] Command palette search
- [x] Guided tour system
- [x] Quiz system
- [x] Mobile-responsive layout
- [x] PWA offline support

---

## Reference

### File Locations
- Implementation Plan: `docs/IMPLEMENTATION_PLAN.md`
- Graph data: `src/data/vehicles/es300-1997/graphs/`
- Silhouettes (to create): `src/data/vehicles/es300-1997/silhouettes/`
- PDF index (to create): `src/data/pdf-index.json`

### Commands
```bash
npm run dev              # Development server
npm run build            # Production build
npm run test             # Run tests
npm run validate-graph   # Verify graph data
npm run optimize-svgs    # Optimize SVG files
```

### Key Types
- `AnatomyLayer` - Layer definition with id, label, category, color, svgFile
- `Note` - Component note with id, componentId, vehicleId, text, tags, haynesPage
- `ComponentManualData` - PDF index entry with manual, wiring, obd, torque data
