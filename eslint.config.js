import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  rules: {
    // 逗号结尾
    '@stylistic/comma-dangle': ['error', 'never'],
    'regexp/no-useless-flag': ['off', {
      ignore: [],
      strictTypes: true
    }]
  }
})
