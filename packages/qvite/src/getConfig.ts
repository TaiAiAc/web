import type { Command, Mode, QviteConfig, QviteConfigFn } from './typings'
import { join } from 'node:path'
import { isFunction } from '@quiteer/is'
import { parserConfig } from '@quiteer/parser-config'
import { deepMerge } from '@quiteer/utils'
import { bootstrapEnv } from '@quiteer/vite-plugins'
import { pathExists } from 'fs-extra'
import { loadEnv } from 'vite'
import { store } from './store'

const NOT_FOUND = '找不到 qvite.config.ts | qvite.config.js | qvite.config.json , 请在根目录下添加配置文件 , 或显式的指定配置文件路径（相对于根目录）'
const PARSING_FAILED = '找到了配置文件,但解析配置文件失败！'

const root = store.get('root') as string

async function configPath(filePath: string) {
  if (filePath)
    return join(root, filePath)

  const configList = ['ts', 'mjs', 'cjs', 'js'].map(suffix => `${join(root, 'qvite.config')}.${suffix}`)

  const index = (await Promise.all(configList.map(path => pathExists(path)))).findIndex(flag => flag)

  if (index > -1)
    return configList[index]

  throw new Error(NOT_FOUND)
}

export async function getConfig(filePath: string): Promise<QviteConfig> {
  const path = await configPath(filePath)

  const command = store.get<Command>('command')!

  const mode = store.get<Mode>('mode')!

  const includePrefixes = ['QVITE_', 'VITE_']
  await bootstrapEnv({ mode, includePrefixes })
  const modeEnv = loadEnv(mode, root, includePrefixes)
  const defaultEnv = loadEnv('', root, includePrefixes)

  const env = deepMerge({}, defaultEnv, modeEnv)
  try {
    const option: QviteConfig = await parserConfig(path, 'qvite.config')

    if (isFunction(option)) {
      const configFn = option as QviteConfigFn
      return configFn({ command, mode, env, root })
    }

    return option
  }
  catch (error) {
    console.error('error :>> ', error)
    throw new Error(PARSING_FAILED)
  }
}
