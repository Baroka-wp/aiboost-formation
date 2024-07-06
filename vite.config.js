import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.md', '**/*.mp4', '**/*.webm', '**/*.ogg']
})