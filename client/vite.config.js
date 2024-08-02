import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',  // Indicates the root of the project is the client folder
  build: {
    outDir: 'dist',  // Output directory for the build
    rollupOptions: {
      // Ensure server-side dependencies are excluded
      external: ['mongoose'],
    },
  },
  resolve: {
    alias: {
      // Define any path aliases if needed
      '@': '/src',
    },
  },
});
