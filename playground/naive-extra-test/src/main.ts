import naive from 'naive-ui'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAppStore } from './stores/app'
import '@quiteer/naive-extra/index.css'
import '@unocss/reset/tailwind-v4.css'
import 'virtual:uno.css'

const app = createApp(App)

app.use(naive)
app.use(createPinia())
app.use(router)

app.mount('#app')

const store = useAppStore()
store.init()
