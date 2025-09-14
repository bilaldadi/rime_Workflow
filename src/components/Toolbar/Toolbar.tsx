import React from 'react';
import { useGraphStore } from '../../store/graphStore';
import { generateNodeId, getDefaultNodeType } from '../../utils/validation';
import './Toolbar.css';

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

import logo from '../../assets/logo.avif';

export const Toolbar: React.FC<ToolbarProps> = ({ onZoomIn, onZoomOut, onFitView }) => {
  const {
    addNode,
    undo,
    redo,
    canUndo,
    canRedo,
    selectedNodeId,
    duplicateNode,
    deleteNode,
    deleteEdge,
    selectedEdgeId,
  } = useGraphStore();

  const handleAddNode = () => {
    const newNode = {
      id: generateNodeId(),
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: 'New Node', type: getDefaultNodeType() },
    };
    addNode(newNode);
  };

  const handleDuplicateNode = () => {
    if (selectedNodeId) {
      duplicateNode(selectedNodeId);
    }
  };

  const handleDelete = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
    } else if (selectedEdgeId) {
      deleteEdge(selectedEdgeId);
    }
  };

  return (
    <div className="toolbar-container">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <div className="toolbar">
        <div className="toolbar-section">
          <button
            className="toolbar-button primary"
            onClick={handleAddNode}
            title="Add Node (Double-click canvas)"
          >
            <span className="icon">+</span>
            Add Node
          </button>
          
          <button
            className="toolbar-button"
            onClick={handleDuplicateNode}
            disabled={!selectedNodeId}
            title="Duplicate Node"
          >
            <span className="icon">⧉</span>
            Duplicate
          </button>
          
          <button
            className="toolbar-button danger"
            onClick={handleDelete}
            disabled={!selectedNodeId && !selectedEdgeId}
            title="Delete Selected (Del/Backspace)"
          >
            Delete
          </button>
        </div>

        <div className="toolbar-section">
          <button
            className="toolbar-button"
            onClick={onZoomIn}
            title="Zoom In"
          >
            <span className="icon">+</span>
            Zoom In
          </button>
          
          <button
            className="toolbar-button"
            onClick={onZoomOut}
            title="Zoom Out"
          >
            <span className="icon">-</span>
            Zoom Out
          </button>
          
          <button
            className="toolbar-button"
            onClick={onFitView}
            title="Fit to View"
          >
            <span className="icon">⊞</span>
            Fit View
          </button>
        </div>

        <div className="toolbar-section">
          <button
            className="toolbar-button"
            onClick={undo}
            disabled={!canUndo()}
            title="Undo (Ctrl/Cmd+Z)"
          >
            <span className="icon">↶</span>
            Undo
          </button>
          
          <button
            className="toolbar-button"
            onClick={redo}
            disabled={!canRedo()}
            title="Redo (Ctrl/Cmd+Shift+Z)"
          >
            <span className="icon">↷</span>
            Redo
          </button>
        </div>
      </div>
    </div>
  );
};
