import type { QviteConfig, QviteConfigExport, QviteConfigFnObject } from './src/typings'

export function defineConfig(config: QviteConfig): QviteConfig

export function defineConfig(config: Promise<QviteConfig>): Promise<QviteConfig>

export function defineConfig(config: QviteConfigFnObject): QviteConfigFnObject

export function defineConfig(config: QviteConfigExport): QviteConfigExport

export function defineConfig(config: QviteConfigExport): QviteConfigExport {
  return config
}

export type { ConfigEnv, QviteConfig as qviteConfig, ViteConfig } from './src/typings'
