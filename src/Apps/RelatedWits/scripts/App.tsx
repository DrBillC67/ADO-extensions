import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeIcons } from '@fluentui/react';
import { RelatedWitsApp } from './Components/App';
import './Components/App/App.scss';

// Initialize Fluent UI icons
initializeIcons();

export function init() {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root container not found');
    return;
  }

  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <RelatedWitsApp />
    </React.StrictMode>
  );
}

// Initialize the app when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 