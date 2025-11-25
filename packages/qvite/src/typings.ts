import type { UserConfig } from 'tsdown'
import type { UserConfig as ViteUserConfig } from 'vite'

export interface ViteConfig extends Omit<ViteUserConfig, 'publicDir' | 'ssr'> { }

export interface QviteConfig {
  cwd?: string
  vite?: ViteConfig
  tsdown?: UserConfig | UserConfig[]
  mode?: 'development' | 'production' | 'test' | 'staging' | 'production' | string
  port?: number
  minify?: boolean
}

export interface ConfigEnv {
  command: 'build' | 'serve'
  root: string
}

export type QviteConfigFnObject = (env: ConfigEnv) => QviteConfig
export type QviteConfigFnPromise = (env: ConfigEnv) => Promise<QviteConfig>
export type QviteConfigFn = (env: ConfigEnv) => QviteConfig | Promise<QviteConfig>

export type QviteConfigExport
  = | QviteConfig
    | Promise<QviteConfig>
    | QviteConfigFnObject
    | QviteConfigFnPromise
    | QviteConfigFn
