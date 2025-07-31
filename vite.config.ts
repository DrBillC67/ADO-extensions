import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      OfficeFabric: resolve(__dirname, 'node_modules/office-ui-fabric-react/lib'),
      VSSUI: resolve(__dirname, 'node_modules/vss-ui'),
      Common: resolve(__dirname, 'src/Common'),
      BugBashPro: resolve(__dirname, 'src/Apps/BugBashPro/scripts'),
      Checklist: resolve(__dirname, 'src/Apps/Checklist/scripts'),
      ControlsLibrary: resolve(__dirname, 'src/Apps/ControlsLibrary/scripts'),
      OneClick: resolve(__dirname, 'src/Apps/OneClick/scripts'),
      PRWorkItems: resolve(__dirname, 'src/Apps/PRWorkItems/scripts'),
      RelatedWits: resolve(__dirname, 'src/Apps/RelatedWits/scripts')
    }
  },
  build: {
    target: 'es2015',
    lib: {
      entry: resolve(__dirname, 'src/Apps/BugBashPro/scripts/Components/App.tsx'),
      name: 'BugBashPro',
      formats: ['amd'],
      fileName: 'BugBashPro'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'q', /^VSS\/.*/, /^TFS\/.*/],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${resolve(__dirname, 'src/Common/_CommonStyles.scss')}";`
      }
    }
  },
  server: {
    port: 8888,
    https: true
  }
}); 