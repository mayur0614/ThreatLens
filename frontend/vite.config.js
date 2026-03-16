import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/scan_email': 'http://localhost:8000',
      '/scan_url': 'http://localhost:8000',
      '/scan_prompt': 'http://localhost:8000',
      '/analytics': 'http://localhost:8000',
      '/feedback': 'http://localhost:8000',
      '/retrain': 'http://localhost:8000',
    }
  }
})
