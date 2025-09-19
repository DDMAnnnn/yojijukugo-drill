// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/yojijukugo-drill/',   // <-- repo name, leading & trailing slashes
})
