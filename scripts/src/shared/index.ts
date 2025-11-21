import type { Options } from 'execa'
import { execa } from 'execa'

export async function execCommand(cmd: string, args: string[], options?: Options) {
  const res = await execa(cmd, args, options)
  return (res?.stdout as string)?.trim() || ''
}
