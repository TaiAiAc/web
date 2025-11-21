export type Lang = 'zh-cn' | 'en-us'

export interface ReleaseOption {
  execute: string
  push: boolean
}

export interface ChangelogOption {
  groupOutput: string
  timelineOutput: string
  formats: 'group' | 'timeline' | 'both'
}

// removed icon set configuration for fixed rendering scheme

export interface GitCommitOption {
  add: boolean
}

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

  /** Default options for release command */
  release: ReleaseOption

  /** Default options for changelog command */
  changelog: ChangelogOption

  /** Default options for git-commit command */
  gitCommit: GitCommitOption
}
