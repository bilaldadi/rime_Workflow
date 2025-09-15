import { useGraphStore } from '../store/graphStore';

export const useKeyboardShortcuts = () => {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    deleteNode,
    deleteEdge,
    selectedNodeId,
    selectedEdgeId,
    clearSelection,
  } = useGraphStore();

  const handleKeyDown = (event: KeyboardEvent) => {
    // Prevent shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

    // Undo: Ctrl/Cmd + Z (without Shift)
    if (ctrlKey && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      if (canUndo()) {
        undo();
      }
      return;
    }

    // Redo: Ctrl/Cmd + Shift + Z
    if (ctrlKey && event.key === 'z' && event.shiftKey) {
      event.preventDefault();
      if (canRedo()) {
        redo();
      }
      return;
    }

    // Delete: Delete or Backspace
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      if (selectedNodeId) {
        deleteNode(selectedNodeId);
      } else if (selectedEdgeId) {
        deleteEdge(selectedEdgeId);
      }
      return;
    }

    // Clear selection: Escape
    if (event.key === 'Escape') {
      event.preventDefault();
      clearSelection();
      return;
    }
  };

  return { handleKeyDown };
};
