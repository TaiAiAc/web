import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    name: 'electronup-api',
    outDir: 'dist/client',
    entry: ['index.ts'],
    format: ['esm', 'cjs'],
    minify: false,
    dts: true
  },
  {
    name: 'electronup-cli',
    outDir: 'dist/bin',
    format: 'cjs',
    minify: false,
    entry: { electronup: 'cli.ts' }
  }
])
