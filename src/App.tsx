import { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@xyflow/react/dist/style.css';

import { LandingPage } from './components/LandingPage';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useKeyboardShortcuts } from './utils/keyboardShortcuts';
import './styles/App.css';

export default function App() {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const { handleKeyDown } = useKeyboardShortcuts();

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleStartWorkflow = () => {
    setShowWorkflow(true);
  };

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

  if (!showWorkflow) {
    return <LandingPage onStart={handleStartWorkflow} />;
  }

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
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}