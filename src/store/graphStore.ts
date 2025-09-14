import { create } from 'zustand';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';

export interface WorkflowNode extends Node {
  data: {
    label: string;
    type: string;
  };
}

export interface WorkflowEdge extends Edge {
  label?: string;
  data?: {
    condition?: string;
  };
}

interface GraphState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  
  // Undo/Redo state
  history: {
    past: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }[];
    present: { nodes: WorkflowNode[]; edges: WorkflowEdge[] };
    future: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }[];
  };
  
  // Actions
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  addNode: (node: WorkflowNode) => void;
  addEdge: (edge: WorkflowEdge) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  updateEdge: (edgeId: string, updates: Partial<WorkflowEdge>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  
  // Selection
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  clearSelection: () => void;
  
  // Undo/Redo
  pushSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // React Flow handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection, condition?: string) => void;
}

const MAX_HISTORY = 20;

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [
    { id: 'n1', position: { x: 100, y: 100 }, data: { label: 'Start', type: 'start' }, type: 'workflow' },
    { id: 'n2', position: { x: 300, y: 100 }, data: { label: 'Process', type: 'process' }, type: 'workflow' },
  ],
  edges: [
    { id: 'e1', source: 'n1', target: 'n2', label: 'always', data: { condition: 'always' } },
  ],
  selectedNodeId: null,
  selectedEdgeId: null,
  
  history: {
    past: [],
    present: { nodes: [], edges: [] },
    future: [],
  },
  
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addNode: (node) => {
    const state = get();
    state.pushSnapshot();
    const newNode = { ...node, type: 'workflow' };
    set({ nodes: [...state.nodes, newNode] });
  },
  
  addEdge: (edge) => {
    const state = get();
    state.pushSnapshot();
    set({ edges: [...state.edges, edge] });
  },
  
  updateNode: (nodeId, updates) => {
    const state = get();
    state.pushSnapshot();
    set({
      nodes: state.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    });
  },
  
  updateEdge: (edgeId, updates) => {
    const state = get();
    state.pushSnapshot();
    set({
      edges: state.edges.map(edge =>
        edge.id === edgeId ? { 
          ...edge, 
          ...updates,
          label: updates.data?.condition || edge.label 
        } : edge
      ),
    });
  },
  
  deleteNode: (nodeId) => {
    const state = get();
    state.pushSnapshot();
    set({
      nodes: state.nodes.filter(node => node.id !== nodeId),
      edges: state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    });
  },
  
  deleteEdge: (edgeId) => {
    const state = get();
    state.pushSnapshot();
    set({
      edges: state.edges.filter(edge => edge.id !== edgeId),
      selectedEdgeId: state.selectedEdgeId === edgeId ? null : state.selectedEdgeId,
    });
  },
  
  duplicateNode: (nodeId) => {
    const state = get();
    const nodeToDuplicate = state.nodes.find(node => node.id === nodeId);
    if (nodeToDuplicate) {
      state.pushSnapshot();
      const newNode: WorkflowNode = {
        ...nodeToDuplicate,
        id: `node-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
        data: { ...nodeToDuplicate.data },
        type: 'workflow',
      };
      set({ nodes: [...state.nodes, newNode] });
    }
  },
  
  setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),
  
  pushSnapshot: () => {
    const state = get();
    const { past, present } = state.history;
    const newPast = [...past, present].slice(-MAX_HISTORY);
    
    set({
      history: {
        past: newPast,
        present: { nodes: [...state.nodes], edges: [...state.edges] },
        future: [],
      },
    });
  },
  
  undo: () => {
    const state = get();
    const { past, present, future } = state.history;
    
    if (past.length > 0) {
      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      
      set({
        nodes: previous.nodes,
        edges: previous.edges,
        history: {
          past: newPast,
          present: previous,
          future: [present, ...future],
        },
      });
    }
  },
  
  redo: () => {
    const state = get();
    const { past, present, future } = state.history;
    
    if (future.length > 0) {
      const next = future[0];
      const newFuture = future.slice(1);
      
      set({
        nodes: next.nodes,
        edges: next.edges,
        history: {
          past: [...past, present],
          present: next,
          future: newFuture,
        },
      });
    }
  },
  
  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,
  
  onNodesChange: (changes) => {
    const state = get();
    const newNodes = changes.reduce((acc, change) => {
      if (change.type === 'position' && change.position) {
        return acc.map(node =>
          node.id === change.id ? { ...node, position: change.position! } : node
        );
      }
      return acc;
    }, state.nodes);
    
    set({ nodes: newNodes });
  },
  
  onEdgesChange: (changes) => {
    const state = get();
    const newEdges = changes.reduce((acc, change) => {
      if (change.type === 'remove') {
        return acc.filter(edge => edge.id !== change.id);
      }
      return acc;
    }, state.edges);
    
    set({ edges: newEdges });
  },
  
  onConnect: (connection, condition?: string) => {
    const state = get();
    const edgeCondition = condition || 'always';
  
    const newEdge: WorkflowEdge = {
      id: `edge-${Date.now()}`,
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle || undefined, 
      targetHandle: connection.targetHandle || undefined,
      label: edgeCondition,
      data: { condition: edgeCondition },
    };
  
    state.addEdge(newEdge);
  },
  
}));
