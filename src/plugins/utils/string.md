# 字符串工具

提供字符串相关工具：大小写转换、风格转换、裁剪截断、类型判断等。

## 导入
```ts
import { capitalize, isString, kebabCase, snakeCase, trim, truncate } from '@quiteer/utils'
```

## API 与示例

### capitalize(input)
```ts
// 函数：首字母大写
// 作用：将字符串首字符转为大写
capitalize('hello') // => 'Hello'
```

### kebabCase(input)
```ts
// 函数：转为 kebab-case
// 作用：将驼峰或空格分隔字符串转为短横线分隔
kebabCase('HelloWorld') // => 'hello-world'
```

### snakeCase(input)
```ts
// 函数：转为 snake_case
// 作用：将驼峰或空格分隔字符串转为下划线分隔
snakeCase('HelloWorld') // => 'hello_world'
```

### trim(input)
```ts
// 函数：去除首尾空白
// 作用：安全地移除字符串首尾空白字符
trim('  a  ') // => 'a'
```

### truncate(input, maxLength, suffix?)
```ts
// 函数：截断字符串
// 作用：超出长度时以省略号结尾（可配置后缀）
truncate('abcdef', 4) // => 'ab...'
```

### isString(value)
```ts
// 函数：判断是否为字符串
// 作用：返回 true/false
isString('x') // => true
isString(1) // => false
```
<!-- eof -->
