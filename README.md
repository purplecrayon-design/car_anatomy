# LexWire

**Interactive Wiring Diagram Explorer for the 1997 Lexus ES300**

LexWire transforms complex automotive wiring diagrams into an interactive learning and diagnostic tool. Built for DIY mechanics, automotive students, and enthusiasts who want to understand and troubleshoot the electrical systems in the 1997 Lexus ES300 (1MZ-FE V6).

---

## Features

### Interactive Circuit Exploration
- **Visual Wiring Diagrams** - SVG-based diagrams with pan, zoom, and component selection
- **Circuit Tracing** - Click any component to highlight the complete circuit path using BFS traversal
- **Layer System** - Toggle visibility of different electrical systems (Charging, Starting, Engine Management, etc.)
- **Wire Color Coding** - Toyota-standard wire colors with visual indicators

### Diagnostic Tools
- **Component Status Tracking** - Mark components as Untested, Testing, Good, Suspected, or Bad
- **Voltage Readings** - Record actual vs. expected voltages with pass/warning/fail indicators
- **Annotations** - Add notes directly on the diagram for future reference
- **Session Management** - Save, load, export, and share diagnostic sessions

### Educational Content
- **Guided Tours** - Step-by-step walkthroughs of each electrical system
- **Difficulty Levels** - Beginner, Intermediate, and Advanced content tiers
- **Component Info** - Purpose, common failure modes, and test procedures for each component
- **Quizzes** - Test your understanding with interactive assessments

### Modern Web App
- **Progressive Web App (PWA)** - Install on your device, works offline
- **Mobile Responsive** - Touch-optimized for phones and tablets
- **Accessible** - Screen reader support, keyboard navigation, reduced motion support
- **Dark Theme** - Easy on the eyes in the garage

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | TypeScript check + production build |
| `npm run test` | Run Vitest test suite |
| `npm run lint` | ESLint with zero warnings policy |
| `npm run validate-graph` | Verify circuit graph data integrity |
| `npm run build-search-index` | Rebuild Fuse.js search index |
| `npm run optimize-svgs` | Optimize SVG diagrams with SVGO |

---

## Project Structure

```
src/
├── components/
│   ├── diagram/        # DiagramCanvas, NodeElement, WireElement
│   ├── layout/         # AppShell, TopBar, Sidebar, DetailPanel
│   ├── layers/         # LayerPanel, LayerRow, OpacitySlider
│   ├── notepad/        # StatusSelector, VoltageInput, SessionManager
│   ├── education/      # GuidedTour, QuizPanel, TourStep
│   ├── search/         # CommandPalette, BreadcrumbTrail
│   ├── detail/         # ComponentInfo, ConnectedWires, VoltageDisplay
│   ├── accessibility/  # ScreenReaderTable, ReducedMotion
│   └── shared/         # Badge, Section, Toast, ExportButton
├── store/              # Zustand slices (ui, diagram, layer, diagnostic, etc.)
├── graph/              # Circuit graph algorithms (tracing, validation)
├── hooks/              # Custom React hooks
├── db/                 # Dexie IndexedDB schema
├── data/               # Vehicle-specific graph/tour/quiz data
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global CSS
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| State | Zustand (sliced architecture) |
| Graph | Graphology (BFS tracing) |
| Storage | Dexie (IndexedDB wrapper) |
| Search | Fuse.js (fuzzy search) |
| PWA | vite-plugin-pwa |
| Testing | Vitest |

---

## Electrical Systems

| System | Status | Description |
|--------|--------|-------------|
| Charging | Complete | Alternator, voltage regulator, charge warning |
| Starting | Data needed | Starter motor, ignition switch, neutral safety |
| Power Distribution | Data needed | Battery, fusible links, fuse boxes |
| Engine Management | Data needed | ECU, sensors, injectors, ignition |
| Headlights | Data needed | Headlight switch, relays, bulbs |
| Taillights | Data needed | Brake, turn signal, reverse lights |
| Horn | Data needed | Horn relay, switch, horns |

---

## Safety Notice

This tool is for **educational purposes only**. Before working on your vehicle's electrical system:

- Disconnect the battery negative terminal
- Use proper safety equipment (insulated tools, safety glasses)
- Consult the official Factory Service Manual for your specific vehicle
- If you're uncomfortable with electrical work, consult a professional

The creators assume no responsibility for damage or injury resulting from use of this tool.

---

## Data Sources

- 1997 Lexus ES300 Factory Service Manual (FSM)
- Toyota Electrical Wiring Diagram conventions
- Wire colors follow Toyota standard coding

---

## Contributing

See [docs/TODO.md](docs/TODO.md) for the current development roadmap and open tasks.

### Adding a New System

1. Create graph JSON in `src/data/vehicles/es300-1997/graphs/`
2. Create SVG diagram in `src/data/vehicles/es300-1997/svgs/`
3. Add tour steps in `src/data/vehicles/es300-1997/tours/`
4. Add quiz questions in `src/data/vehicles/es300-1997/quizzes/`
5. Run `npm run validate-graph` to verify data integrity
6. Run `npm run build-search-index` to update search

---

## License

MIT License - See LICENSE file for details.

---

## Acknowledgments

- Toyota/Lexus for the 1MZ-FE platform
- Haynes Publishing for reference materials
- The DIY automotive community
