import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useReactFlow,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import { showSuccessToast, showErrorToast } from '../../utils/toastHelpers';
import { useGraphStore } from '../../store/graphStore';
import { validateEdgeConnection, generateNodeId, getDefaultNodeType } from '../../utils/validation';
import './Canvas.css';

interface CanvasProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

const WorkflowNode: React.FC<{ data: { label: string; type: string } }> = ({ data }) => {
  return (
    <div className="workflow-node">
      
      <Handle type="target" position={Position.Top} id="top-target" className="port port-top" />
      <Handle type="source" position={Position.Top} id="top-source" className="port port-top" />

      <Handle type="target" position={Position.Right} id="right-target" className="port port-right" />
      <Handle type="source" position={Position.Right} id="right-source" className="port port-right" />

      <Handle type="target" position={Position.Bottom} id="bottom-target" className="port port-bottom" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" className="port port-bottom" />

      <Handle type="target" position={Position.Left} id="left-target" className="port port-left" />
      <Handle type="source" position={Position.Left} id="left-source" className="port port-left" />

      <div className="node-header">
        <span className="node-type">{data.type}</span>
      </div>
      <div className="node-content">
        <span className="node-label">{data.label}</span>
      </div>
    </div>
  );
};

const nodeTypes = {
  workflow: WorkflowNode,
};

export const Canvas: React.FC<CanvasProps> = () => {
  const reactFlowInstance = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
    setSelectedEdgeId,
    clearSelection,
    addNode,
  } = useGraphStore();

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      
      // Handle selection changes - process all changes first, then handle selection
      const selectionChanges = changes.filter(change => change.type === 'select');
      
      if (selectionChanges.length > 0) {
        // Find the last selected node
        const selectedNode = selectionChanges
          .filter(change => change.selected)
          .pop();
        
        if (selectedNode) {
          setSelectedNodeId(selectedNode.id);
        } else {
          // Only clear if no nodes are selected
          const hasSelectedNodes = selectionChanges.some(change => change.selected);
          if (!hasSelectedNodes) {
            setSelectedNodeId(null);
          }
        }
      }
    },
    [onNodesChange, setSelectedNodeId]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      
      // Handle selection changes - process all changes first, then handle selection
      const selectionChanges = changes.filter(change => change.type === 'select');
      
      if (selectionChanges.length > 0) {
        // Find the last selected edge
        const selectedEdge = selectionChanges
          .filter(change => change.selected)
          .pop();
        
        if (selectedEdge) {
          setSelectedEdgeId(selectedEdge.id);
        } else {
          // Only clear if no edges are selected
          const hasSelectedEdges = selectionChanges.some(change => change.selected);
          if (!hasSelectedEdges) {
            setSelectedEdgeId(null);
          }
        }
      }
    },
    [onEdgesChange, setSelectedEdgeId]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      const validation = validateEdgeConnection(connection.source!, connection.target!, edges);
  
      if (validation.isValid) {
        onConnect(connection, connection.sourceHandle === 'right-source' ? 'if con ' : 'condition');
      } else {
        showErrorToast(validation.reason || 'Invalid connection');
      }
    },
    [onConnect, edges]
  );
  

  const handlePaneClick = useCallback((event: React.MouseEvent) => {
    // Only handle pane clicks, not clicks on nodes or edges
    if (event.target === event.currentTarget) {
      if (event.detail === 2) {
        // Double click - add node
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        
        const newNode = {
          id: generateNodeId(),
          position,
          data: { label: 'New Node', type: getDefaultNodeType() },
          type: 'workflow',
        };
        
        addNode(newNode);
        showSuccessToast('Node added successfully');
      } else {
        // Single click - clear selection
        clearSelection();
      }
    }
  }, [clearSelection, reactFlowInstance, addNode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearSelection();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection]);

  // Expose zoom functions to parent
  useEffect(() => {
    const zoomIn = () => {
      reactFlowInstance.zoomIn();
    };
    
    const zoomOut = () => {
      reactFlowInstance.zoomOut();
    };
    
    const fitView = () => {
      reactFlowInstance.fitView();
    };

    // Store references for parent component
    (window as any).canvasZoomIn = zoomIn;
    (window as any).canvasZoomOut = zoomOut;
    (window as any).canvasFitView = fitView;
  }, [reactFlowInstance]);

  return (
    <div className="canvas-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          labelStyle: {
            fontSize: 12,
            fill: '#374151',
            fontWeight: 500,
          },
          labelBgStyle: {
            fill: 'white',
            fillOpacity: 0.8,
            stroke: '#e5e7eb',
            strokeWidth: 1,
          },
        }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background 
          color="#e2e8f0" 
          gap={12} 
          size={3}
        />
        <Controls 
          position="bottom-left"
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
      </ReactFlow>
    </div>
  );
};
