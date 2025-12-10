import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    name: '@quiteer/vite-plugins',
    entry: ['src/index.ts'],
    platform: 'node',
    clean: true,
    dts: true,
    sourcemap: false,
    minify: false
  },
  {
    name: '@quiteer/vite-plugins/obfuscation',
    entry: ['extra/obfuscation.ts'],
    platform: 'browser',
    clean: true,
    dts: true,
    sourcemap: false,
    minify: false
  }
])
