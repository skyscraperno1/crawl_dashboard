import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'http://192.168.110.50:9011', // 生产
        // target: 'http://192.168.110.50:9012', // 开发
        target: 'http://192.168.110.38:9020', // 伟康
        changeOrigin: true,
        rewrite: path => path.replace('/api', '')
      },
    }
  }
})
