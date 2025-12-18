import { defineConfig } from 'tsdown'

export default defineConfig([{
  name: '@quiteer/unocss',
  entry: ['src/index.ts'],

  dts: true,
  outDir: 'dist',
  clean: true,
  minify: false,
  treeshake: true
}])
