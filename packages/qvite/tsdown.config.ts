import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    name: 'qvite-api',
    outDir: 'dist/client',
    entry: ['index.ts'],
    platform: 'node',
    minify: false,
    dts: true
  },
  {
    name: 'qvite-cli',
    outDir: 'dist/bin',
    platform: 'node',
    minify: false,
    entry: { qvite: 'cli.ts' }
  }
])
