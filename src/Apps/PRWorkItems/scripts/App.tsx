import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Fabric } from '@fluentui/react';
import { ConfigureDialog } from './Components/ConfigureDialog';
import './css/App.scss';

// Initialize Fluent UI icons
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();

// Initialize the app
export function init() {
  const container = document.getElementById('dialog-container');

  if (!container) {
    console.error('Dialog container not found');
    return;
  }

  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Fabric>
        <ConfigureDialog />
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