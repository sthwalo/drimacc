import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for src directory
    },
  },
  build: {
    outDir: 'dist', // Output directory for the build
  },
  server: {
    open: true, // Automatically open in browser
    port: 3000, // Port for dev server
  },
  publicDir: 'public', // Directory for static assets
});