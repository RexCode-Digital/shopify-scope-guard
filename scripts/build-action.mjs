import { build } from 'esbuild';
await build({ entryPoints: ['src/action/index.js'], bundle: true, platform: 'node', format: 'cjs', outfile: 'dist/index.cjs', banner: { js: '#!/usr/bin/env node' }, minify: false });
console.log('Bundled GitHub Action to dist/index.cjs');
