import React, { useState, useEffect } from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {/* Animated background */}
      <div className="landing-background">
        <div className="grid-overlay"></div>
        <div className="particles">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className={`landing-content ${isLoaded ? 'loaded' : ''}`}>
        {/* Logo section */}
        <div className="logo-section">
          <div className="logo-container">
            <div className="logo-wrapper">
              <img 
                src="/logo.avif" 
                alt="Workflow Engine Logo" 
                className="logo-image"
              />
              <div className="logo-glow"></div>
            </div>
            <div className="logo-subtitle">Workflow Engine</div>
          </div>
        </div>

        {/* Description */}
        <div className="description-section">
          <div className="description-box">
            <p className="description-text">
              Create, design, and manage complex workflows with our intuitive visual editor.
              Build powerful automation flows with drag-and-drop simplicity.
            </p>
          </div>
        </div>

        {/* Start button */}
        <div className="action-section">
          <button 
            className="start-button"
            onClick={onStart}
          >
            <span className="button-text">START WORKFLOW</span>
            <div className="button-glow"></div>
            <div className="button-particles">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="button-particle"></div>
              ))}
            </div>
          </button>
        </div>

        {/* Features preview */}
        <div className="features-section">
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <span>Real-time Editing</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔗</div>
            <span>Smart Connections</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <span>Mobile Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
