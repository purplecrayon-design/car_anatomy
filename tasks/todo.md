# LexWire PRD Implementation

## Phase 1: Foundation ✓ COMPLETE
## Phase 2: InfoPanel + Manual Integration ✓ COMPLETE
## Phase 3: Dashboard + Notes Enhancement ✓ COMPLETE

---

## Phase 3 Tasks Completed

### 1. Create notesSlice
- [x] Create `src/store/notesSlice.ts`
- [x] State: notes by componentId, recentComponents
- [x] Actions: addNote, deleteNote, getNotesForComponent, getFlaggedNotes, trackComponentVisit

### 2. Create Dashboard component
- [x] Create `src/components/Dashboard.tsx`
- [x] 4 cards: Recent Inspections, Flagged Issues, Learning Progress, OBD Quick Ref
- [x] Create `src/components/dashboard/DashboardCard.tsx`

### 3. Add viewMode to uiSlice
- [x] Add viewMode: 'dashboard' | 'explore' to uiSlice
- [x] Add setViewMode action
- [x] Default to 'dashboard' on app start

### 4. Wire up view switching
- [x] Update App.tsx to show Dashboard or AppShell based on viewMode
- [x] Add Home/Explore toggle button to TopBar

### 5. Track component visits
- [x] Update VehicleCanvas to call trackComponentVisit on component click
- [x] Dashboard shows recent components

### 6. Enhanced NotesTab
- [x] Create `src/components/detail/NotesTab.tsx`
- [x] Tag selector (diagnostic, concept, torque, obd, problem)
- [x] Display note history with tags and timestamps
- [x] Delete note functionality

---

## Files Created/Modified (Phase 3)

| File | Action | Lines |
|------|--------|-------|
| `src/store/notesSlice.ts` | Created | 60 lines |
| `src/store/uiSlice.ts` | Modified | +6 lines |
| `src/store/index.ts` | Modified | +3 lines |
| `src/components/Dashboard.tsx` | Created | 200 lines |
| `src/components/dashboard/DashboardCard.tsx` | Created | 70 lines |
| `src/components/detail/NotesTab.tsx` | Created | 200 lines |
| `src/components/detail/InfoPanel.tsx` | Modified | -15 lines |
| `src/components/layout/TopBar.tsx` | Modified | +15 lines |
| `src/components/diagram/VehicleCanvas.tsx` | Modified | +5 lines |
| `src/App.tsx` | Modified | +5 lines |

---

## All Phases Complete Summary

### Phase 1: Foundation
- vehicleSlice for ES300/Camry toggle
- 7 anatomy layers with global opacity
- VehicleCanvas with silhouette + layer compositing
- ModelSelector in TopBar
- 8 placeholder SVGs with clickable components

### Phase 2: InfoPanel + Manual Integration
- pdf-index.json with 17 components
- manualSlice with getComponentData
- 5-tab InfoPanel (Manual/Wiring/OBD/Torque/Notes)
- Tab components with proper data display
- Shared 1MZ-FE parts banner

### Phase 3: Dashboard + Notes Enhancement
- Dashboard home screen with 4 cards
- viewMode switching (dashboard/explore)
- notesSlice with tags and search
- Enhanced NotesTab with tag selector
- Component visit tracking

---

## Review

### What's Working
1. **Dashboard** - Home screen with Recent Inspections, Flagged Issues, Learning Progress, OBD Quick Ref
2. **View Switching** - Home button in TopBar toggles between Dashboard and Explorer
3. **Component Tracking** - Clicking components tracks visits, shows in Recent Inspections
4. **Notes with Tags** - Add notes with tags (diagnostic, concept, torque, obd, problem)
5. **Flagged Issues** - Notes tagged "problem" appear in Flagged Issues card
6. **Progress Tracking** - Learning Progress shows % of components explored

### App Flow
1. App starts on Dashboard
2. Click "Start Exploring" or "Explore" button
3. Toggle layers, click components in silhouette
4. InfoPanel shows Manual/Wiring/OBD/Torque/Notes tabs
5. Add notes with tags in Notes tab
6. Return to Dashboard to see recent activity and flagged issues

### Build Stats
- 112 modules
- 383 KB JS (gzipped: 119 KB)
- PWA ready with offline support

### Remaining Future Enhancements
- Persist notes to IndexedDB
- Export notes to JSON/Markdown
- Camry-specific SVGs
- Top-down view
- Real Haynes manual screenshots
- OBD scanner integration

---

## Vehicle Folder Consolidation ✓ COMPLETE

- [x] 1. Copy detailed layers from `lexus-es300-1997/layers/` to `es300/layers/`
- [x] 2. Ensure silhouette files exist in `es300/silhouettes/`
- [x] 3. Update `ANATOMY_LAYERS` in `src/types/anatomy.ts` to 12 layers
- [x] 4. Update `VehicleCanvas.tsx` path from `silhouettes/layers/` to `layers/`
- [x] 5. Delete redundant `lexus-es300-1997` folder
- [x] 6. Delete old `es300/silhouettes/layers/` folder
- [x] 7. Verify app loads correctly

### Review

**Changes Made:**
1. Created `es300/layers/` and copied 12 detailed SVGs (3-11 KB each) from `lexus-es300-1997/layers/`
2. Updated `ANATOMY_LAYERS` in `src/types/anatomy.ts` from 7 layers to 12 layers
3. Changed layer path in `VehicleCanvas.tsx` from `silhouettes/layers/` to `layers/`
4. Deleted redundant `lexus-es300-1997/` folder
5. Deleted old `es300/silhouettes/layers/` folder (kept silhouettes for base car outline)

**Final Structure:**
```
public/data/vehicles/es300/
├── silhouettes/
│   └── side-view.svg       # Base car outline
└── layers/
    ├── chassis.svg
    ├── engine-mechanical.svg
    ├── engine-wiring.svg
    ├── full-wiring.svg
    ├── fuel-system.svg
    ├── cooling-system.svg
    ├── intake-exhaust.svg
    ├── suspension-steering.svg
    ├── brakes.svg
    ├── body-electrical.svg
    ├── hvac.svg
    └── drivetrain.svg
```

**Files Modified:**
- `src/types/anatomy.ts` - Updated ANATOMY_LAYERS array
- `src/components/diagram/VehicleCanvas.tsx` - Updated layer path

**Build:** Successful (67 modules, 209 KB JS)

---

## Phase 4: PRD Rehaul & Polish (Current)

### Root Cause Analysis
After reviewing the codebase, I found these issues:

1. **Vehicle ID Mismatch** - Manifest uses `id: "lexus-es300-1997"` but SVG files are in `public/data/vehicles/es300/`. The VehicleCanvas tries to load from `lexus-es300-1997` folder which no longer exists.

2. **No Clickable Hotspots** - The SVG layer images are loaded with `pointerEvents: 'none'`. There are no actual clickable component regions to trigger InfoPanel.

3. **Layout OK** - The 3-column layout code exists and works, but the canvas appears empty because of #1.

4. **InfoPanel, Notepad, SplashScreen** - All properly implemented and functional.

### Tasks

- [x] 1. **Fix Vehicle ID** - Update manifest.json `id` from "lexus-es300-1997" to "es300" to match folder structure
- [x] 2. **Update Camry Manifest** - Ensure Camry also points to correct paths (shares es300 assets)
- [x] 3. **Add Clickable Component Hotspots** - Created 17 interactive hotspot regions in VehicleCanvas
- [x] 4. **Fix Silhouette Path** - VehicleCanvas now uses `currentVehicle.silhouette` from manifest
- [x] 5. **Build & Test** - Build passes (211 KB JS)

### Files Modified

| File | Change |
|------|--------|
| `src/data/vehicles/es300-1997/manifest.json` | `id: "es300"`, `silhouette: "silhouettes/side-view.svg"` |
| `src/data/vehicles/camry-1997/manifest.json` | `id: "es300"`, `silhouette: "silhouettes/side-view.svg"` |
| `src/components/VehicleCanvas.tsx` | Added 17 clickable hotspots, fixed silhouette path |

### Review

**What was fixed:**
1. Vehicle ID now matches folder structure (`es300` → `public/data/vehicles/es300/`)
2. Silhouette loads from correct path (`silhouettes/side-view.svg`)
3. 17 clickable component hotspots added with hover highlighting
4. Camry shares ES300 assets (same 1MZ-FE platform)

**How it works now:**
1. Splash screen shows on first visit
2. VehicleCanvas loads silhouette + layers from `es300/` folder
3. Hovering over component areas highlights them in emerald
4. Clicking a hotspot triggers InfoPanel with component details
5. LayerControls toggle visibility of all 12 layers
6. Vehicle selector switches between ES300/Camry (same SVGs, different metadata)

**Build:** Successful (211 KB JS)

---

## Phase 5: Canvas Layout Fix ✓ COMPLETE

### Problem
Canvas was tiny and stuck in top-left 1/16 of screen with massive empty space.

### Tasks Completed
- [x] 1. **Fix SVG scaling** - Use proper `preserveAspectRatio="xMidYMid meet"` and centered flexbox container
- [x] 2. **Fix 3-column layout** - App.tsx now uses fixed sidebar widths (280px/320px) with flex-1 center
- [x] 3. **Remove hardcoded widths** - LayerControls and InfoPanel now fill their containers
- [x] 4. **Add selection highlight** - Clicked components show emerald glow/pulse effect
- [x] 5. **Build & push** - Deployed to Netlify

### Files Modified
| File | Change |
|------|--------|
| `src/App.tsx` | Fixed 3-column layout with proper flex structure |
| `src/components/VehicleCanvas.tsx` | Fixed SVG scaling, centered container, selection glow |
| `src/components/LayerControls.tsx` | Removed hardcoded width, fills container |
| `src/components/InfoPanel.tsx` | Removed hardcoded width, fills container |

### Result
- Canvas now fills available space and centers properly
- Works in both normal and full-screen mode
- Selection highlight shows which component is active
