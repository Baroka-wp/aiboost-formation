import { defineConfig } from 'vite'
import vercel from 'vite-plugin-vercel';
 
export default defineConfig({
  server: {
    port: process.env.PORT,
  },
  plugins: [vercel()],
  assetsInclude: ['**/*.md', '**/*.mp4', '**/*.webm', '**/*.ogg']
});