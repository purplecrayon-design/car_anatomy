# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LexWire is an interactive wiring diagram explorer for the 1997 Lexus ES300. It's a React + TypeScript PWA that visualizes electrical circuits as an interactive graph, allowing users to trace circuits, diagnose issues, and learn about automotive electrical systems.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite build
npm run test         # Run Vitest tests
npm run lint         # ESLint with zero warnings allowed

# Utility scripts
npm run optimize-svgs       # Optimize SVG diagrams with SVGO
npm run validate-graph      # Validate circuit graph data integrity
npm run build-search-index  # Rebuild Fuse.js search index
```

## Architecture

### State Management
Zustand store with sliced architecture (`src/store/`). Each slice manages a domain:
- `layerSlice` - System layer visibility/opacity (charging, starting, power, etc.)
- `diagnosticSlice` - Component test statuses, voltage readings, annotations
- `diagramSlice` - Pan/zoom, selected node, trace results
- `searchSlice` - Fuse.js search state
- `tourSlice` / `quizSlice` - Educational features
- `sessionSlice` - Diagnostic session persistence

### Circuit Graph System
The graph model (`src/graph/`) represents electrical circuits using graphology:
- `CircuitGraph.ts` - Core graph wrapper with node/edge accessors
- `tracing.ts` - BFS and directed trace algorithms for circuit path finding
- `cross-page.ts` - Cross-page wire reference resolution (wires spanning multiple diagram pages)

Key types in `src/types/circuit.ts`:
- `CircuitNode` - Components (fuses, relays, ECUs, grounds, splices, etc.)
- `WireEdge` - Connections with Toyota color codes, gauge, and cross-page refs
- `TraceResult` - BFS/trace output with visited nodes/edges

### Persistence
IndexedDB via Dexie (`src/db/`):
- Diagnostic sessions with component statuses
- Voltage readings and user annotations
- Tour progress and quiz scores

### Component Structure
- `components/diagram/` - DiagramCanvas, NodeElement, WireElement, Minimap
- `components/layout/` - AppShell (grid layout), Sidebar, DetailPanel
- `components/notepad/` - Diagnostic session tools (StatusSelector, VoltageInput)
- `components/education/` - GuidedTour, QuizPanel
- `components/layers/` - LayerPanel with visibility/opacity controls

### Path Alias
`@/*` maps to `src/*` (configured in tsconfig.json and vite.config.ts)

## Reference Materials
The `reference_files/` directory contains Haynes manual PDFs and Toyota technical documents for the 1997 Lexus ES300 / 1MZ-FE V6 engine, including the official wiring diagram.

## Claude Code Rules:
- 1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
- 2. The plan should have a list of todo items that you can check off as you complete them
- 3. Before you begin working, check in with me and I will verify the plan.
- 4. Then, begin working on the todo items, marking them as complete as you go.
- 5. Please every step of the way just give me a high level explanation of what changes you made
- 6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
- 7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
- 8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY
- 9. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY