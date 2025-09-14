import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Toaster } from 'react-hot-toast';
import '@xyflow/react/dist/style.css';

import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useKeyboardShortcuts } from './utils/keyboardShortcuts';
import './styles/App.css';

export default function App() {
  const { handleKeyDown } = useKeyboardShortcuts();

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleZoomIn = () => {
    if ((window as any).canvasZoomIn) {
      (window as any).canvasZoomIn();
    }
  };

  const handleZoomOut = () => {
    if ((window as any).canvasZoomOut) {
      (window as any).canvasZoomOut();
    }
  };

  const handleFitView = () => {
    if ((window as any).canvasFitView) {
      (window as any).canvasFitView();
    }
  };

  return (
    <div className="app">
      <Toolbar
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
      />
      <div className="app-content">
        <div className="app-main">
          <ReactFlowProvider>
            <Canvas
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitView={handleFitView}
            />
          </ReactFlowProvider>
        </div>
        <PropertiesPanel />
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}