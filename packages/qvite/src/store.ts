import { PersistentStore } from '@quiteer/utils'

export const store = PersistentStore.getInstance('qvite')

store.set('command', 'serve')
store.set('config', 'qvite.config.ts')
store.set('mode', 'development')
store.set('minify', false)
store.set('port', 8080)
