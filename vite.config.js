import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The deploy workflow sets VITE_BASE=/<repo-name>/ so the base path always matches the repo.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['recharts'],
        },
      },
    },
  },
});
