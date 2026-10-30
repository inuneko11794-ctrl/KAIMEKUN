import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/KAIMEKUN/', // リポジトリ名に合わせています
})
