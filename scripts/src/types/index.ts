import type { Lang } from '@/locales'

export interface CliOption {
  /** The project root directory */
  cwd: string
  /**
   * Cleanup dirs
   *
   * Glob pattern syntax {@link https://github.com/isaacs/minimatch}
   *
   * @default
   * ```json
   * ["** /dist", "** /node_modules", "!node_modules/**"]
   * ```
   */
  cleanupDirs: string[]
  /**
   * Npm-check-updates command args
   *
   * @default ['--deep', '-u']
   */
  ncuCommandArgs: string[]

  lang: Lang

  /** The ignore pattern list of git commit verify */
  gitCommitVerifyIgnores: RegExp[]
}
