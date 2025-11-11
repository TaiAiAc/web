import antfu from '@antfu/eslint-config'

export default antfu({
  markdown: true,
  rules: {
    // 限制使用 console：警告级别
    // - 允许的白名单方法：info、warn、error、time、timeEnd
    // - 其它 console 调用将触发 warn（可改为 'off' | 'error'）
    'no-console': ['warn', { allow: ['info', 'warn', 'error', 'time', 'timeEnd'] }],

    // 末尾逗号（JS/TS 通用）：不允许任何场景出现末尾逗号
    // - 适用于对象、数组、函数参数、导入导出等
    'style/comma-dangle': ['error', 'never'],
    '@stylistic/comma-dangle': ['error', 'never']
  }
})
