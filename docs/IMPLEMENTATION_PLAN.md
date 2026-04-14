# LexWire PRD Implementation Plan

## Overview

This plan transforms LexWire from a wiring diagram explorer into a full anatomy-style vehicle explorer with layered silhouettes, integrated Haynes manual references, OBD-II data, torque specs, and persistent note-taking.

**Current State:** Wiring diagram app with 23 components, Zustand store, Dexie persistence, BFS circuit tracing
**Target State:** Anatomy-app-style explorer with 7 toggleable body layers, InfoPanel tabs, persistent notepad, model selector

---

## Architecture Mapping

### What We Keep (100% Reuse)
| Existing | PRD Requirement | Notes |
|----------|-----------------|-------|
| `SessionManager` | Persistent notepad sessions | Add note-specific methods |
| `useDiagnosticSession` | Auto-save notes | Works as-is |
| `LayerSlice` + `LayerPanel` | 7 toggleable layers | Expand layer definitions |
| `AnnotationEditor` | Component notepad | Enhance with tags |
| `StatusSelector` | Component status tracking | Reuse directly |
| `AppShell` | Responsive layout | Add dashboard route |
| Dexie schema | Notes persistence | Extend with Note table |
| `usePanZoom` | SVG zoom/pan | Works for silhouettes |
| Toast system | User feedback | Reuse directly |
| Quiz/Tour system | Learning tools | Generate from BFS |

### What We Adapt (70% Reuse)
| Existing | Target | Changes Needed |
|----------|--------|----------------|
| `DiagramCanvas` | `VehicleCanvas` | Replace graph with silhouette SVGs |
| `ComponentInfo` | `InfoPanel` | Add tabbed interface (5 tabs) |
| `DetailPanel` | `InfoPanel` container | Make collapsible, add tabs |
| `LayerPanel` | Enhanced layers | Add master toggle, isolate mode, multi-select |
| `Sidebar` | Model selector + layers | Add vehicle toggle at top |

### What We Build (New)
| Component | Purpose |
|-----------|---------|
| `VehicleCanvas.tsx` | Silhouette SVG renderer with layer compositing |
| `InfoPanel.tsx` | Tabbed info display (Manual/Wiring/OBD/Torque/Notes) |
| `ManualTab.tsx` | Haynes page excerpt + screenshot |
| `WiringTab.tsx` | Highlighted wiring diagram section |
| `OBDTab.tsx` | PIDs, values, interpretation |
| `TorqueTab.tsx` | N·m / kgf·cm / ft·lbf table |
| `NotesTab.tsx` | Component-scoped notepad |
| `Dashboard.tsx` | Home screen with 4 cards |
| `ModelSelector.tsx` | ES300 ↔ Camry toggle |
| `vehicleSlice.ts` | Vehicle/model state |
| `notesSlice.ts` | Notes state with tags |
| `manualSlice.ts` | PDF index state |

---

## Data Structure Design

### 1. PDF Index Schema (`src/data/pdf-index.json`)
```json
{
  "components": {
    "alternator": {
      "id": "alternator",
      "label": "Alternator",
      "systems": ["charging", "engine-mechanical"],
      "manual": {
        "pdf": "1mz-fe V6.pdf",
        "page": 127,
        "excerpt": "The alternator provides electrical power...",
        "screenshot": "manual-screenshots/alternator-127.png"
      },
      "wiring": {
        "pdf": "Wiring Diagram.pdf",
        "page": 64,
        "circuitId": "charging-main"
      },
      "obd": {
        "pids": ["B+_VOLTAGE"],
        "expectedRange": "13.5-14.8V",
        "redFlags": ["Below 12V indicates charging failure"]
      },
      "torque": {
        "bolts": [
          { "name": "Mounting bolts", "nm": 56, "kgfcm": 570, "ftlbf": 41 },
          { "name": "Adjusting bolt", "nm": 13, "kgfcm": 130, "ftlbf": 9 }
        ]
      },
      "vehicles": {
        "es300": { "partNumber": "27060-20140", "location": "Front right of engine" },
        "camry": { "partNumber": "27060-20140", "location": "Front right of engine", "shared": true }
      }
    }
  }
}
```

### 2. Vehicle Silhouette Structure
```
src/data/vehicles/
├── es300-1997/
│   ├── silhouettes/
│   │   ├── side-view.svg          # Base transparent silhouette
│   │   ├── top-down.svg           # Alternative view
│   │   └── layers/
│   │       ├── engine-mechanical.svg
│   │       ├── wiring-harnesses.svg
│   │       ├── fuel-system.svg
│   │       ├── cooling-system.svg
│   │       ├── intake-exhaust.svg
│   │       ├── suspension-brakes.svg
│   │       └── body-electrical.svg
│   ├── graphs/                     # Existing wiring graphs
│   └── ...
├── camry-1997/
│   ├── silhouettes/
│   │   └── layers/
│   │       ├── suspension-brakes.svg  # Model-specific
│   │       └── body-electrical.svg    # Model-specific
│   └── shared -> ../es300-1997/       # Symlink for 1MZ-FE data
```

### 3. Extended Dexie Schema
```typescript
// src/db/database.ts - additions
interface Note {
  id?: number;
  componentId: string;      // Unified ID across all data
  vehicleId: 'es300' | 'camry';
  sessionId: number;
  text: string;
  tags: string[];           // 'diagnostic', 'concept', 'torque', 'obd', 'problem'
  haynesPage?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ComponentVisit {
  id?: number;
  componentId: string;
  vehicleId: string;
  visitedAt: Date;
}

// New tables
notes!: Table<Note>;
componentVisits!: Table<ComponentVisit>;
```

### 4. Layer System Definition
```typescript
// src/types/layers.ts
interface AnatomyLayer {
  id: string;
  label: string;
  category: 'mechanical' | 'electrical' | 'fluid' | 'structural';
  color: string;
  svgFile: string;
  visible: boolean;
  opacity: number;
  isolated: boolean;
  outlineColor?: string;  // For multi-select highlighting
}

const ANATOMY_LAYERS: AnatomyLayer[] = [
  { id: 'engine-mechanical', label: 'Engine Mechanical', category: 'mechanical', color: '#E74C3C', svgFile: 'engine-mechanical.svg' },
  { id: 'wiring-harnesses', label: 'Wiring Harnesses', category: 'electrical', color: '#3498DB', svgFile: 'wiring-harnesses.svg' },
  { id: 'fuel-system', label: 'Fuel System', category: 'fluid', color: '#F39C12', svgFile: 'fuel-system.svg' },
  { id: 'cooling-system', label: 'Cooling System', category: 'fluid', color: '#1ABC9C', svgFile: 'cooling-system.svg' },
  { id: 'intake-exhaust', label: 'Intake/Exhaust', category: 'mechanical', color: '#9B59B6', svgFile: 'intake-exhaust.svg' },
  { id: 'suspension-brakes', label: 'Suspension & Brakes', category: 'structural', color: '#34495E', svgFile: 'suspension-brakes.svg' },
  { id: 'body-electrical', label: 'Body Electrical', category: 'electrical', color: '#E67E22', svgFile: 'body-electrical.svg' },
];
```

---

## Implementation Phases

### Phase 1: Foundation (Sprint 1)
**Goal:** Silhouette rendering + layer controls + basic click handling

#### 1.1 Create Vehicle Slice
```typescript
// src/store/slices/vehicleSlice.ts
interface VehicleSlice {
  currentVehicle: 'es300' | 'camry';
  currentView: 'side' | 'top';
  setVehicle: (vehicle: 'es300' | 'camry') => void;
  setView: (view: 'side' | 'top') => void;
}
```

#### 1.2 Extend Layer Slice
```typescript
// src/store/slices/layerSlice.ts - additions
interface LayerSlice {
  // Existing
  layers: Record<string, LayerState>;
  soloLayer: string | null;

  // New
  globalOpacity: number;
  isolatedLayers: string[];
  multiSelectColors: Record<string, string>;

  // New actions
  setGlobalOpacity: (opacity: number) => void;
  toggleAllLayers: (visible: boolean) => void;
  isolateLayer: (layerId: string) => void;
  setMultiSelectColor: (layerId: string, color: string) => void;
}
```

#### 1.3 Build VehicleCanvas Component
```typescript
// src/components/diagram/VehicleCanvas.tsx
export function VehicleCanvas() {
  const { currentVehicle, currentView } = useStore(s => s.vehicle);
  const layers = useStore(s => s.layers);
  const globalOpacity = useStore(s => s.globalOpacity);
  const setSelectedNode = useStore(s => s.setSelectedNode);

  const { x: panX, y: panY, scale, handlers } = usePanZoom(1);

  const handleComponentClick = useCallback((e: React.MouseEvent<SVGElement>) => {
    const componentId = (e.target as SVGElement).dataset.componentId;
    if (componentId) {
      setSelectedNode(componentId);
      // Trigger pulse animation
    }
  }, [setSelectedNode]);

  return (
    <main className="vehicle-canvas" role="application">
      <svg viewBox="0 0 1200 800" {...handlers}>
        {/* Base silhouette */}
        <image
          href={`/data/vehicles/${currentVehicle}/silhouettes/${currentView}.svg`}
          opacity={globalOpacity}
        />

        {/* Layer stack */}
        {ANATOMY_LAYERS.map(layer => (
          layers[layer.id]?.visible && (
            <g
              key={layer.id}
              opacity={layers[layer.id].opacity}
              className={layers[layer.id].isolated ? 'isolated' : ''}
            >
              <use
                href={`/data/vehicles/${currentVehicle}/silhouettes/layers/${layer.svgFile}#root`}
                onClick={handleComponentClick}
              />
            </g>
          )
        ))}

        {/* Selection highlight overlay */}
        <SelectionHighlight />
      </svg>

      <ZoomControls />
      <Minimap />
    </main>
  );
}
```

#### 1.4 Enhance LayerPanel
```typescript
// src/components/layers/LayerPanel.tsx - enhancements
export function LayerPanel() {
  const layers = useStore(s => s.layers);
  const globalOpacity = useStore(s => s.globalOpacity);
  const toggleAllLayers = useStore(s => s.toggleAllLayers);
  const setGlobalOpacity = useStore(s => s.setGlobalOpacity);

  const allVisible = Object.values(layers).every(l => l.visible);

  return (
    <div className="layer-panel">
      {/* Master controls */}
      <div className="layer-master-controls">
        <button onClick={() => toggleAllLayers(!allVisible)}>
          {allVisible ? 'Hide All' : 'Show All'}
        </button>
        <OpacitySlider
          value={globalOpacity}
          onChange={setGlobalOpacity}
          label="Global Opacity"
        />
      </div>

      {/* Layer rows with isolate button */}
      {ANATOMY_LAYERS.map(layer => (
        <LayerRow
          key={layer.id}
          layer={layer}
          showIsolateButton
          showMultiSelectColor
        />
      ))}
    </div>
  );
}
```

#### 1.5 Files to Create/Modify
| File | Action | Priority |
|------|--------|----------|
| `src/store/slices/vehicleSlice.ts` | Create | P0 |
| `src/store/slices/layerSlice.ts` | Extend | P0 |
| `src/store/index.ts` | Add vehicleSlice | P0 |
| `src/components/diagram/VehicleCanvas.tsx` | Create | P0 |
| `src/components/layers/LayerPanel.tsx` | Enhance | P0 |
| `src/types/layers.ts` | Create | P0 |
| `src/data/vehicles/es300-1997/silhouettes/` | Create directory | P0 |

---

### Phase 2: InfoPanel + Manual Integration (Sprint 2)
**Goal:** Tabbed InfoPanel with Manual, Wiring, OBD, Torque tabs

#### 2.1 Create PDF Index
```bash
# Generate pdf-index.json from manual analysis
node scripts/generate-pdf-index.mjs
```

#### 2.2 Create Manual Slice
```typescript
// src/store/slices/manualSlice.ts
interface ManualSlice {
  pdfIndex: Record<string, ComponentManualData>;
  loadPdfIndex: () => Promise<void>;
  getComponentData: (componentId: string) => ComponentManualData | null;
}
```

#### 2.3 Build InfoPanel Component
```typescript
// src/components/detail/InfoPanel.tsx
const TABS = ['manual', 'wiring', 'obd', 'torque', 'notes'] as const;

export function InfoPanel({ componentId }: Props) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('manual');
  const componentData = useStore(s => s.getComponentData(componentId));
  const currentVehicle = useStore(s => s.currentVehicle);

  // Show shared 1MZ-FE banner
  const isShared = componentData?.vehicles?.camry?.shared;

  return (
    <aside className="info-panel" role="complementary">
      {/* Shared parts banner */}
      {isShared && (
        <div className="shared-banner">
          Also fits 1997 Toyota Camry (identical 1MZ-FE). Consider both when replacing.
        </div>
      )}

      {/* Tab bar */}
      <nav className="info-tabs" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="tab-content">
        {activeTab === 'manual' && <ManualTab data={componentData?.manual} />}
        {activeTab === 'wiring' && <WiringTab data={componentData?.wiring} />}
        {activeTab === 'obd' && <OBDTab data={componentData?.obd} />}
        {activeTab === 'torque' && <TorqueTab data={componentData?.torque} />}
        {activeTab === 'notes' && <NotesTab componentId={componentId} />}
      </div>
    </aside>
  );
}
```

#### 2.4 Manual Tab Component
```typescript
// src/components/detail/ManualTab.tsx
export function ManualTab({ data }: Props) {
  if (!data) {
    return <div className="empty-state">No manual data available</div>;
  }

  return (
    <div className="manual-tab">
      <div className="page-reference">
        <span className="pdf-name">{data.pdf}</span>
        <span className="page-number">Page {data.page}</span>
      </div>

      <div className="excerpt">
        <p>{data.excerpt}</p>
      </div>

      {data.screenshot && (
        <div className="manual-screenshot">
          <img
            src={`/data/manual-screenshots/${data.screenshot}`}
            alt={`Haynes manual page ${data.page}`}
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
```

#### 2.5 Torque Tab Component
```typescript
// src/components/detail/TorqueTab.tsx
export function TorqueTab({ data }: Props) {
  if (!data?.bolts?.length) {
    return <div className="empty-state">N/A - No torque specifications</div>;
  }

  return (
    <div className="torque-tab">
      <table className="torque-table">
        <thead>
          <tr>
            <th>Fastener</th>
            <th>N·m</th>
            <th>kgf·cm</th>
            <th>ft·lbf</th>
          </tr>
        </thead>
        <tbody>
          {data.bolts.map((bolt, i) => (
            <tr key={i}>
              <td>{bolt.name}</td>
              <td className="value">{bolt.nm}</td>
              <td className="value">{bolt.kgfcm}</td>
              <td className="value">{bolt.ftlbf}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### 2.6 OBD Tab Component
```typescript
// src/components/detail/OBDTab.tsx
export function OBDTab({ data }: Props) {
  if (!data) {
    return <div className="empty-state">No OBD data for this component</div>;
  }

  return (
    <div className="obd-tab">
      <section className="pids">
        <h4>Related PIDs</h4>
        <ul>
          {data.pids.map(pid => (
            <li key={pid}>
              <code>{pid}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="expected-values">
        <h4>Expected Range</h4>
        <p className="value">{data.expectedRange}</p>
      </section>

      {data.redFlags?.length > 0 && (
        <section className="red-flags">
          <h4>Red Flags</h4>
          <ul>
            {data.redFlags.map((flag, i) => (
              <li key={i} className="warning">{flag}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
```

#### 2.7 Files to Create
| File | Action |
|------|--------|
| `src/store/slices/manualSlice.ts` | Create |
| `src/components/detail/InfoPanel.tsx` | Create |
| `src/components/detail/ManualTab.tsx` | Create |
| `src/components/detail/WiringTab.tsx` | Create |
| `src/components/detail/OBDTab.tsx` | Create |
| `src/components/detail/TorqueTab.tsx` | Create |
| `src/data/pdf-index.json` | Create |
| `scripts/generate-pdf-index.mjs` | Create |
| `public/data/manual-screenshots/` | Create directory |

---

### Phase 3: Notepad System (Sprint 3)
**Goal:** Persistent component-scoped notes with tags and search

#### 3.1 Extend Database Schema
```typescript
// src/db/database.ts - add Note table
class LexWireDB extends Dexie {
  // ... existing tables
  notes!: Table<Note>;
  componentVisits!: Table<ComponentVisit>;

  constructor() {
    super('lexwire');
    this.version(2).stores({
      // ... existing
      notes: '++id, componentId, vehicleId, sessionId, *tags, haynesPage, createdAt',
      componentVisits: '++id, componentId, vehicleId, visitedAt'
    });
  }
}
```

#### 3.2 Create Notes Slice
```typescript
// src/store/slices/notesSlice.ts
interface NotesSlice {
  notes: Record<string, Note[]>;  // Keyed by componentId
  searchQuery: string;
  tagFilter: string[];

  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: number, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  searchNotes: (query: string) => Note[];
  filterByTag: (tag: string) => Note[];
  exportNotes: (format: 'json' | 'markdown') => string;
}
```

#### 3.3 Build NotesTab Component
```typescript
// src/components/detail/NotesTab.tsx
export function NotesTab({ componentId }: Props) {
  const currentVehicle = useStore(s => s.currentVehicle);
  const sessionId = useStore(s => s.activeSessionId);
  const { addNote, notes } = useStore(s => ({
    addNote: s.addNote,
    notes: s.notes[componentId] || []
  }));

  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = async () => {
    await addNote({
      componentId,
      vehicleId: currentVehicle,
      sessionId,
      text,
      tags: selectedTags,
    });
    setText('');
    setSelectedTags([]);
  };

  return (
    <div className="notes-tab">
      {/* Note input */}
      <div className="note-input">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a note about this component..."
        />

        <div className="tag-selector">
          {NOTE_TAGS.map(tag => (
            <button
              key={tag}
              className={selectedTags.includes(tag) ? 'selected' : ''}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={!text.trim()}>
          Save Note
        </button>
      </div>

      {/* Note list */}
      <div className="note-list">
        {notes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

const NOTE_TAGS = ['diagnostic', 'concept', 'torque', 'obd', 'problem'];
```

#### 3.4 Global Notes View
```typescript
// src/components/notepad/GlobalNotesView.tsx
export function GlobalNotesView() {
  const allNotes = useStore(s => Object.values(s.notes).flat());
  const searchNotes = useStore(s => s.searchNotes);
  const exportNotes = useStore(s => s.exportNotes);

  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const filteredNotes = useMemo(() => {
    let result = allNotes;
    if (search) result = searchNotes(search);
    if (tagFilter.length) result = result.filter(n =>
      n.tags.some(t => tagFilter.includes(t))
    );
    return result;
  }, [allNotes, search, tagFilter, searchNotes]);

  return (
    <div className="global-notes">
      {/* Search and filters */}
      <div className="notes-toolbar">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes..."
        />

        <TagFilter tags={NOTE_TAGS} selected={tagFilter} onChange={setTagFilter} />

        <button onClick={() => exportNotes('markdown')}>
          Export Markdown
        </button>
        <button onClick={() => exportNotes('json')}>
          Export JSON
        </button>
      </div>

      {/* Notes grid */}
      <div className="notes-grid">
        {filteredNotes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            showComponentLink
          />
        ))}
      </div>
    </div>
  );
}
```

#### 3.5 Files to Create/Modify
| File | Action |
|------|--------|
| `src/db/database.ts` | Add Note table (version 2) |
| `src/store/slices/notesSlice.ts` | Create |
| `src/components/detail/NotesTab.tsx` | Create |
| `src/components/notepad/GlobalNotesView.tsx` | Create |
| `src/components/notepad/NoteCard.tsx` | Create |
| `src/components/shared/TagFilter.tsx` | Create |

---

### Phase 4: Dashboard + Model Toggle + Quizzes (Sprint 4)
**Goal:** Home screen, vehicle selector, learning system

#### 4.1 Dashboard Component
```typescript
// src/components/Dashboard.tsx
export function Dashboard() {
  const recentVisits = useStore(s => s.recentVisits);
  const flaggedNotes = useStore(s =>
    Object.values(s.notes).flat().filter(n => n.tags.includes('problem'))
  );
  const visitProgress = useStore(s => s.visitProgress);

  return (
    <div className="dashboard">
      {/* Recent Inspections */}
      <DashboardCard title="Recent Inspections" icon="clock">
        {recentVisits.slice(0, 5).map(visit => (
          <ComponentLink key={visit.id} componentId={visit.componentId} />
        ))}
      </DashboardCard>

      {/* Flagged Issues */}
      <DashboardCard title="Flagged Issues" icon="alert" variant="warning">
        {flaggedNotes.map(note => (
          <NotePreview key={note.id} note={note} />
        ))}
      </DashboardCard>

      {/* Learning Progress */}
      <DashboardCard title="Learning Progress" icon="book">
        <ProgressHeatmap data={visitProgress} />
        <span>{visitProgress.percentage}% explored</span>
      </DashboardCard>

      {/* Quick OBD Reference */}
      <DashboardCard title="Quick OBD Reference" icon="gauge">
        <OBDQuickRef />
      </DashboardCard>
    </div>
  );
}
```

#### 4.2 Model Selector
```typescript
// src/components/layout/ModelSelector.tsx
export function ModelSelector() {
  const currentVehicle = useStore(s => s.currentVehicle);
  const setVehicle = useStore(s => s.setVehicle);

  return (
    <div className="model-selector">
      <button
        className={currentVehicle === 'es300' ? 'active' : ''}
        onClick={() => setVehicle('es300')}
      >
        <img src="/icons/lexus.svg" alt="" />
        Lexus ES300
      </button>

      <span className="toggle-arrow">↔</span>

      <button
        className={currentVehicle === 'camry' ? 'active' : ''}
        onClick={() => setVehicle('camry')}
      >
        <img src="/icons/toyota.svg" alt="" />
        Toyota Camry
      </button>
    </div>
  );
}
```

#### 4.3 Enhanced Quiz Generator
```typescript
// src/components/education/SystemQuiz.tsx
export function SystemQuiz({ layerId }: Props) {
  const generateQuiz = useStore(s => s.generateSystemQuiz);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    // Generate 5-10 questions from BFS traversal of layer
    const quiz = generateQuiz(layerId, { count: 10 });
    setQuestions(quiz);
  }, [layerId, generateQuiz]);

  return (
    <div className="system-quiz">
      <h3>Learn: {LAYER_LABELS[layerId]}</h3>
      <QuizPanel questions={questions} />
    </div>
  );
}
```

#### 4.4 Files to Create
| File | Action |
|------|--------|
| `src/components/Dashboard.tsx` | Create |
| `src/components/dashboard/DashboardCard.tsx` | Create |
| `src/components/dashboard/ProgressHeatmap.tsx` | Create |
| `src/components/dashboard/OBDQuickRef.tsx` | Create |
| `src/components/layout/ModelSelector.tsx` | Create |
| `src/components/education/SystemQuiz.tsx` | Create |

---

### Phase 5: Polish + Testing + Camry (Sprint 5)
**Goal:** Accessibility, mobile optimization, Camry layer finalization

#### 5.1 Accessibility Audit Checklist
- [ ] All interactive elements have ARIA labels
- [ ] Tab order follows visual layout
- [ ] Focus indicators visible
- [ ] High contrast mode tested
- [ ] Screen reader announces layer changes
- [ ] Reduced motion preference respected

#### 5.2 Mobile Optimizations
- [ ] Touch targets ≥ 44px
- [ ] Pinch-to-zoom on silhouette
- [ ] Swipe gestures for tab switching
- [ ] Bottom sheet for InfoPanel (mobile)
- [ ] Haptic feedback on status changes

#### 5.3 Camry Layer Finalization
| Layer | Status |
|-------|--------|
| Engine Mechanical | Shared with ES300 |
| Wiring Harnesses | Shared with ES300 |
| Fuel System | Shared with ES300 |
| Cooling System | Shared with ES300 |
| Intake/Exhaust | Shared with ES300 |
| Suspension & Brakes | **Camry-specific SVG needed** |
| Body Electrical | **Camry-specific SVG needed** |

#### 5.4 Test Coverage
```typescript
// src/__tests__/integration/
- vehicle-switching.test.tsx
- layer-interactions.test.tsx
- notes-persistence.test.tsx
- offline-functionality.test.tsx
- pdf-index-loading.test.tsx
```

---

## Asset Requirements

### SVG Assets Needed (6 total per vehicle)
| Asset | Dimensions | Notes |
|-------|------------|-------|
| `side-view.svg` | 1200×800 | Base transparent silhouette |
| `top-down.svg` | 1200×800 | Alternative view |
| `engine-mechanical.svg` | 1200×800 | 1MZ-FE cutaway |
| `wiring-harnesses.svg` | 1200×800 | Color-coded by system |
| `fuel-system.svg` | 1200×800 | Tank, lines, injectors |
| `cooling-system.svg` | 1200×800 | Radiator, hoses, pump |
| `intake-exhaust.svg` | 1200×800 | Manifolds, throttle body |
| `suspension-brakes.svg` | 1200×800 | Model-specific |
| `body-electrical.svg` | 1200×800 | Lights, switches |

### PDF Processing
| Source | Pages | Output |
|--------|-------|--------|
| 1mz-fe V6.pdf | ~200 | Indexed excerpts + screenshots |
| Wiring Diagram.pdf | ~150 | Circuit mappings |
| Haynes Manual | Selected | Component references |

### Data Files
| File | Size Est. | Purpose |
|------|-----------|---------|
| `pdf-index.json` | ~500KB | Component to manual mapping |
| `obd-reference.json` | ~50KB | PID definitions |
| `torque-specs.json` | ~30KB | Fastener specifications |

---

## Integration Points

### Store Composition
```typescript
// src/store/index.ts - final
export const useStore = create<
  UISlice &
  DiagramSlice &
  LayerSlice &
  DiagnosticSlice &
  SessionSlice &
  NavigationSlice &
  SearchSlice &
  TourSlice &
  QuizSlice &
  VehicleSlice &   // NEW
  NotesSlice &     // NEW
  ManualSlice      // NEW
>()(
  persist(
    (...a) => ({
      ...createUISlice(...a),
      ...createDiagramSlice(...a),
      ...createLayerSlice(...a),
      ...createDiagnosticSlice(...a),
      ...createSessionSlice(...a),
      ...createNavigationSlice(...a),
      ...createSearchSlice(...a),
      ...createTourSlice(...a),
      ...createQuizSlice(...a),
      ...createVehicleSlice(...a),    // NEW
      ...createNotesSlice(...a),      // NEW
      ...createManualSlice(...a),     // NEW
    }),
    { name: 'lexwire-store' }
  )
);
```

### Route Structure
```typescript
// If using React Router (optional)
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/explore" element={<AppShell />} />
  <Route path="/notes" element={<GlobalNotesView />} />
  <Route path="/quiz/:layerId" element={<SystemQuiz />} />
</Routes>
```

### Component Hierarchy
```
App
├── OfflineBanner
├── Disclaimer (first visit)
├── Dashboard (home)
│   ├── DashboardCard × 4
│   └── ModelSelector
└── AppShell (explore mode)
    ├── TopBar
    │   └── ModelSelector
    ├── Sidebar
    │   └── LayerPanel (enhanced)
    ├── VehicleCanvas (replaces DiagramCanvas)
    │   ├── Silhouette layers
    │   ├── SelectionHighlight
    │   └── Minimap
    └── InfoPanel (replaces DetailPanel)
        ├── SharedBanner
        ├── TabBar
        └── TabContent
            ├── ManualTab
            ├── WiringTab
            ├── OBDTab
            ├── TorqueTab
            └── NotesTab
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Component click to info display | < 2 seconds |
| Layer toggle response | < 100ms |
| Offline functionality | 100% |
| Mobile touch accuracy | ≥ 95% |
| Notes search results | < 500ms |
| PDF index load time | < 1 second |
| Accessibility score | WCAG 2.1 AA |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| SVG assets not ready | Use placeholder rectangles, develop UI first |
| PDF indexing complex | Start with 20 key components, expand incrementally |
| Camry differences unclear | Default to "shared with ES300" banner |
| Mobile performance | Lazy load layers, virtualize large lists |
| Offline PDF access | Pre-cache critical excerpts in service worker |

---

## Quick Start Commands

```bash
# After implementing Phase 1
npm run dev                    # Start development
npm run validate-graph         # Verify component IDs match

# After implementing Phase 2
npm run generate-pdf-index     # Build pdf-index.json
npm run optimize-svgs          # Optimize all SVGs

# After implementing Phase 3
npm run test                   # Run test suite
npm run build                  # Production build
```
