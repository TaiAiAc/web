import type { CliOption } from '../types'
import process from 'node:process'
import { loadConfig } from 'c12'

export const defaultOptions: CliOption = {
  cwd: process.cwd(),
  cleanupDirs: [
    '**/dist',
    '**/node_modules',
    '!node_modules/**'
  ],
  lang: 'zh-cn',
  ncuCommandArgs: ['--deep', '-u'],
  gitCommitVerifyIgnores: [
    /^((Merge pull request)|(Merge (.*?) into (.*)|(Merge branch (.*)))(?:\r?\n)*$)/m,
    /^(Merge tag (.*))(?:\r?\n)*$/m,
    /^(R|r)evert (.*)/,
    /^(amend|fixup|squash)!/,
    /^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/,
    /^Merge remote-tracking branch(\s*)(.*)/,
    /^Automatic merge(.*)/,
    /^Auto-merged (.*?) into (.*)/
  ],
  release: {
    execute: 'qui cl',
    push: true
  },
  changelog: {
    groupOutput: 'CHANGELOG.md',
    timelineOutput: 'CHANGELOG_TIMELINE.md',
    formats: 'both'
  },
  gitCommit: {
    add: true
  }
}

export async function loadCliOptions(overrides?: Partial<CliOption>, cwd = process.cwd()) {
  const { config } = await loadConfig<Partial<CliOption>>({
    name: 'quiteer',
    defaults: defaultOptions,
    overrides,
    cwd,
    packageJson: true
  })

  return config as CliOption
}
