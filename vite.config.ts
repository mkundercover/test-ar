import { defineConfig } from 'vite';

export default defineConfig({
  base: '/test-ar/',
  root: './',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
});
