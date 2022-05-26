import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  https:{
    key: fs.readFileSync('resource/ssl/privkey.pem'),
    cert: fs.readFileSync('resource/ssl/fullchain.pem')
  }
})
