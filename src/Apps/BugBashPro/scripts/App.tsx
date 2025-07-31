import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Fabric } from '@fluentui/react';
import { App } from './Components/App';
import './css/App.scss';

// Initialize Fluent UI icons
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();

// Initialize the app
export function init() {
  const container = document.getElementById('root');
  
  if (!container) {
    console.error('Root container not found');
    return;
  }

  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Fabric>
        <App />
      </Fabric>
    </React.StrictMode>
  );
}

// Auto-initialize if this is the main module
if (typeof window !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else if (typeof window !== 'undefined') {
  init();
} 