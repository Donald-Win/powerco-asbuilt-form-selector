import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/powerco-asbuilt-form-selector/',
  
  // Add this build configuration
  build: {
    rollupOptions: {
      output: {
        // Include service worker in build
        manualChunks: undefined,
      }
    }
  }
})
