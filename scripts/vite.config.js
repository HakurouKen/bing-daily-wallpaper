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
      '@': root
    }
  },
  plugins: [vue()],
  optimizeDeps: {
    exclude: [
      'electron-window-state',
      'electron',
      ...require('builtin-modules')
    ]
  }
});
