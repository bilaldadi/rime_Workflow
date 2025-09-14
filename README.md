# Workflow Canvas

A powerful, responsive workflow canvas built with React, TypeScript, and React Flow. Create, edit, and manage workflow diagrams with an intuitive interface.

## Features

### 🎨 **Interactive Canvas**
- **Pan & Zoom**: Navigate large workflows with smooth panning and zooming
- **Snap to Grid**: Align nodes perfectly with 20px grid snapping
- **Double-click to Add**: Quickly add nodes by double-clicking on empty canvas
- **Drag & Drop**: Move nodes around the canvas with visual feedback

### 🔧 **Node Management**
- **Add Nodes**: Use toolbar button or double-click on canvas
- **Node Types**: Support for start, process, decision, end, and custom types
- **Editable Properties**: Change node labels and types in real-time
- **Duplicate Nodes**: Clone existing nodes with one click
- **Visual Ports**: Connection points on all four sides of nodes

### 🔗 **Edge Connections**
- **Drag to Connect**: Create edges by dragging from node ports
- **Condition Labels**: Add conditional logic to edges
- **Validation**: Prevents invalid connections (self-loops, duplicates)
- **Smooth Animations**: Beautiful animated edge transitions

### ⚡ **Powerful Editing**
- **Selection**: Click to select nodes/edges, drag-box for multiple selection
- **Properties Panel**: Edit node labels, types, and edge conditions
- **Keyboard Shortcuts**: Efficient workflow with hotkeys
- **Delete Operations**: Remove nodes/edges with keyboard or UI

### ↩️ **Undo/Redo System**
- **20-Action History**: Track up to 20 operations
- **Smart Snapshots**: Automatic history on meaningful changes
- **Keyboard Shortcuts**: Ctrl/Cmd+Z for undo, Ctrl/Cmd+Shift+Z for redo

### 📱 **Responsive Design**
- **Mobile-First**: Works from 320px to large desktop screens
- **Collapsible Panels**: Properties panel adapts to screen size
- **Touch-Friendly**: Optimized for touch interactions

## Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Usage Guide

### Basic Operations

#### Adding Nodes
1. **Toolbar**: Click "Add Node" button
2. **Canvas**: Double-click on empty canvas area
3. **Properties**: Edit label and type in the properties panel

#### Creating Edges
1. **Drag Connection**: Click and drag from one node port to another
2. **Add Condition**: Edit the condition in the properties panel
3. **Validation**: Invalid connections are automatically prevented

#### Editing Properties
1. **Select**: Click on a node or edge
2. **Properties Panel**: Appears on the right side
3. **Edit**: Change labels, types, or conditions in real-time

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo last action |
| `Ctrl/Cmd + Shift + Z` | Redo last undone action |
| `Delete` / `Backspace` | Delete selected node/edge |
| `Escape` | Clear selection |

### Node Types

- **Start**: Beginning of workflow
- **Process**: General processing step
- **Decision**: Conditional branching
- **End**: Workflow termination
- **Custom**: User-defined type

### Edge Conditions

Edges support conditional logic with free-text conditions:
- `always` - Always execute
- `if success` - Execute on success
- `if error` - Execute on error
- `when condition` - Custom conditions

## Project Structure

```
src/
├── components/          # React components
│   ├── Canvas.tsx      # Main workflow canvas
│   ├── Toolbar.tsx     # Top toolbar with actions
│   └── PropertiesPanel.tsx # Right-side properties editor
├── store/              # State management
│   └── graphStore.ts   # Zustand store with undo/redo
├── utils/              # Utility functions
│   ├── validation.ts   # Edge validation logic
│   └── keyboardShortcuts.ts # Keyboard event handling
└── styles/             # CSS styles
    └── App.css         # Global styles and layout
```

## Technical Details

### State Management
- **Zustand**: Lightweight state management
- **Undo/Redo**: Custom implementation with 20-action history
- **TypeScript**: Full type safety throughout

### Performance
- **Debounced Updates**: Node position changes are debounced
- **Efficient Rendering**: React Flow optimizations
- **Memory Management**: History capped at 20 operations

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Component Separation**: Clear component boundaries
- **Responsive CSS**: Mobile-first design approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the documentation above
2. Search existing issues
3. Create a new issue with detailed description

---

**Built with ❤️ using React, TypeScript, and React Flow**