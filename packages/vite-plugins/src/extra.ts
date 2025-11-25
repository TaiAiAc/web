import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { AntDesignVueResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import Progress from 'vite-plugin-progress'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueDevTools from 'vite-plugin-vue-devtools'

export { AntDesignVueResolver, Components, createSvgIconsPlugin, FileSystemIconLoader, Icons, IconsResolver, NaiveUiResolver, Progress, Vue, VueDevTools, VueJsx }
