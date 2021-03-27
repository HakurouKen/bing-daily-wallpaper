const path = require('path');
const nodeExternals = require('rollup-plugin-node-externals');
const commonjs = require('@rollup/plugin-commonjs');
const esbuild = require('rollup-plugin-esbuild');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json');
const packageJson = require('../package.json');

module.exports = {
  input: path.join(__dirname, '../src/main/index.ts'),
  output: {
    file: path.join(__dirname, '../dist/main/index.js'),
    format: 'cjs',
    name: packageJson.name,
    sourcemap: true,
  },
  plugins: [
    nodeExternals(),
    commonjs(),
    json(),
    esbuild({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/,
      sourceMap: false,
      minify: process.env.NODE_ENV === 'production',
      target: 'es2020',
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      define: {
        __VERSION__: '"x.y.z"',
      },
      loaders: {
        '.json': 'json',
        '.js': 'jsx',
      },
    }),
    alias({
      entries: [{ find: '@', replacement: path.join(__dirname, '../src') }],
    }),
  ],
  external: [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
  ],
};
