import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/algoriza-internship2025-FS99-FE-byway-admin/',
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'http://minasafwat-001-site1.stempurl.com' 
          : 'http://localhost:5045',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', '@headlessui/react'],
          charts: ['recharts'],
          forms: ['react-hook-form'],
          utils: ['axios', 'react-hot-toast']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
