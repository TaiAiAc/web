import UnoCSS from '@unocss/vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import Progress from 'vite-plugin-progress'
import VueDevTools from 'vite-plugin-vue-devtools'

export { FileSystemIconLoader } from 'unplugin-icons/loaders'
export { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
export { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export { AutoImport, Components, Icons, IconsResolver, Progress, UnoCSS, Vue, VueDevTools, VueJsx }
