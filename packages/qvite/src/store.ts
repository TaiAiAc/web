import { cwd } from 'node:process'
import { PersistentStore } from '@quiteer/utils'

export const store = PersistentStore.getInstance('qvite')

store.set('root', cwd())
store.set('command', 'serve')
store.set('config', 'qvite.config.ts')
store.set('mode', 'development')
store.set('env', {})
store.set('minify', false)
store.set('port', 8080)
store.set('prefixes', ['QVITE_', 'VITE_'])
