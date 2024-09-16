import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Ensure your dependencies are properly managed
      external: ['react', 'react-dom','bootstrap','react-bootstrap'],
    },
  },
})
