import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/graphStore';
import './PropertiesPanel.css';

export const PropertiesPanel: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    updateNode,
    updateEdge,
    clearSelection,
  } = useGraphStore();

  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeType, setNodeType] = useState('');
  const [edgeCondition, setEdgeCondition] = useState('');

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) : null;

  useEffect(() => {
    if (selectedNode) {
      setNodeLabel(selectedNode.data.label);
      setNodeType(selectedNode.data.type);
    } else if (selectedEdge) {
      setEdgeCondition(selectedEdge.data?.condition || '');
    }
  }, [selectedNode, selectedEdge]);

  const handleNodeLabelChange = (value: string) => {
    setNodeLabel(value);
    if (selectedNodeId) {
      updateNode(selectedNodeId, {
        data: { ...selectedNode!.data, label: value },
      });
    }
  };

  const handleNodeTypeChange = (value: string) => {
    setNodeType(value);
    if (selectedNodeId) {
      updateNode(selectedNodeId, {
        data: { ...selectedNode!.data, type: value },
      });
    }
  };

  const handleEdgeConditionChange = (value: string) => {
    setEdgeCondition(value);
    if (selectedEdgeId) {
      updateEdge(selectedEdgeId, {
        data: { ...selectedEdge!.data, condition: value },
      });
    }
  };

  const hasSelection = selectedNodeId || selectedEdgeId;

  return (
    <div className={`properties-panel ${hasSelection ? 'visible' : ''}`}>
      <div className="properties-header">
        <h3 className="properties-title">
          {selectedNode ? 'Node Properties' : selectedEdge ? 'Edge Properties' : 'Properties'}
        </h3>
      </div>

      {hasSelection && (
        <div className="properties-content">
          {selectedNode && (
            <div className="property-group">
              <div className="property-item">
                <label className="property-label">Label</label>
                <input
                  type="text"
                  className="property-input"
                  value={nodeLabel}
                  onChange={(e) => handleNodeLabelChange(e.target.value)}
                  placeholder="Enter node label"
                />
              </div>

              <div className="property-item">
                <label className="property-label">Type</label>
                <input
                  type="text"
                  className="property-input"
                  value={nodeType}
                  onChange={(e) => handleNodeTypeChange(e.target.value)}
                  placeholder="Enter node type (e.g., start, process, decision)"
                />
              </div>

              <div className="property-item">
                <label className="property-label">Node ID</label>
                <input
                  type="text"
                  className="property-input readonly"
                  value={selectedNode.id}
                  readOnly
                />
              </div>

              <div className="property-item">
                <label className="property-label">Position</label>
                <div className="position-inputs">
                  <input
                    type="number"
                    className="property-input small"
                    value={Math.round(selectedNode.position.x)}
                    readOnly
                  />
                  <span className="position-separator">,</span>
                  <input
                    type="number"
                    className="property-input small"
                    value={Math.round(selectedNode.position.y)}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {selectedEdge && (
            <div className="property-group">
              <div className="property-item">
                <label className="property-label">Condition</label>
                <input
                  type="text"
                  className="property-input"
                  value={edgeCondition}
                  onChange={(e) => handleEdgeConditionChange(e.target.value)}
                  placeholder="Enter condition (e.g., always, if success)"
                />
              </div>

              <div className="property-item">
                <label className="property-label">Source</label>
                <input
                  type="text"
                  className="property-input readonly"
                  value={selectedEdge.source}
                  readOnly
                />
              </div>

              <div className="property-item">
                <label className="property-label">Target</label>
                <input
                  type="text"
                  className="property-input readonly"
                  value={selectedEdge.target}
                  readOnly
                />
              </div>

              <div className="property-item">
                <label className="property-label">Edge ID</label>
                <input
                  type="text"
                  className="property-input readonly"
                  value={selectedEdge.id}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!hasSelection && (
        <div className="properties-empty">
          <p>Select a node or edge to edit its properties</p>
        </div>
      )}
    </div>
  );
};
