import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // host: '0.0.0.0',     // 👈 allows LAN access
  //   port: 8000,          // optional (default is 5173)
  //   strictPort: true,
    server: {
    host: true
}
})

