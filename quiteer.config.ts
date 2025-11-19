// 自动生成的 quiteer 配置文件

export default {
  cleanupDirs: [
    '**/dist',
    '**/node_modules',
    '!node_modules/**'
  ],
  lang: 'zh-cn',
  ncuCommandArgs: [
    '--deep',
    '-u'
  ],
  gitCommitVerifyIgnores: [
    /^((Merge pull request)|(Merge (.*?) into (.*)|(Merge branch (.*)))(?:\r?\n)*$)/m,
    /^(Merge tag (.*))(?:\r?\n)*$/m,
    /^(R|r)evert (.*)/,
    /^(amend|fixup|squash)!/,
    /^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/,
    /^Merge remote-tracking branch(\s*)(.*)/,
    /^Automatic merge(.*)/,
    /^Auto-merged (.*?) into (.*)/
  ]
}
