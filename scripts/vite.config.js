const { defineConfig } = require('vite');
const path = require('path');
const vue = require('@vitejs/plugin-vue');

const root = path.join(__dirname, '..', 'src/renderer');

module.exports = defineConfig({
  root,
  server: {
    open: false,
    port: process.env.PORT || 3000
  },
  base: './',
  build: {
    outDir: path.join(__dirname, '..', 'dist/renderer'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '..', 'src')
    }
  },
  plugins: [vue()],
  optimizeDeps: {
    exclude: ['electron', ...require('builtin-modules')]
  }
});
