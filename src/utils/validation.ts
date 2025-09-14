import type { WorkflowEdge } from '../store/graphStore';


export const validateEdgeConnection = (
  sourceId: string,
  targetId: string,
  existingEdges: WorkflowEdge[]
): { isValid: boolean; reason?: string } => {
  // Prevent self-connection
  if (sourceId === targetId) {
    return { isValid: false, reason: 'Cannot connect node to itself' };
  }

  // Prevent duplicate edges (same source → same target)
  const duplicateEdge = existingEdges.find(
    edge => edge.source === sourceId && edge.target === targetId
  );
  if (duplicateEdge) {
    return { isValid: false, reason: 'This connection already exists' };
  }
  return { isValid: true };
};


export const generateNodeId = (): string => {
  return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateEdgeId = (): string => {
  return `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getNodeTypes = (): string[] => {
  return ['start', 'process', 'decision', 'end', 'custom'];
};

export const getDefaultNodeType = (): string => {
  return 'process';
};
