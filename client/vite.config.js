import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '../client',
  build: {
    outDir: "/dist",
    rollupOptions: {
      // Ensure server code is excluded
      external: ['mongoose'],
    }
  }
})
