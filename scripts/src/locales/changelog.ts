import type { Lang } from '../types'

/**
 * 获取 changelog 类型到分组标题的映射
 * @param lang 输出语言
 * @returns 类型分组标题映射
 */
export function getChangelogHeadingMap(lang: Lang): Record<string, string> {
  if (lang === 'en-us') {
    return {
      'feat': 'Features',
      'feat-wip': 'Features',
      'fix': 'Fixes',
      'docs': 'Docs',
      'typo': 'Typo',
      'style': 'Style',
      'refactor': 'Refactor',
      'perf': 'Performance',
      'optimize': 'Optimization',
      'test': 'Tests',
      'build': 'Build',
      'ci': 'CI',
      'chore': 'Chore',
      'revert': 'Revert'
    }
  }
  return {
    'feat': '新功能',
    'feat-wip': '新功能',
    'fix': '修复',
    'docs': '文档',
    'typo': '勘误',
    'style': '代码风格',
    'refactor': '重构',
    'perf': '性能优化',
    'optimize': '质量优化',
    'test': '测试',
    'build': '构建',
    'ci': 'CI',
    'chore': '其他',
    'revert': '回滚'
  }
}
