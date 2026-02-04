import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 6002,
    host: true,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@assets': '/src/assets',
      '@store': '/src/store',
    },
  },
  optimizeDeps: {
    exclude: ['@tailwindcss/vite'],
    include: ['react', 'react-dom', 'antd', 'axios', 'echarts', '@ant-design/icons'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd', '@ant-design/icons'],
          utils: ['axios', 'echarts'],
        },
      },
    },
  },
})
