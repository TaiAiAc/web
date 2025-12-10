import type { VirtualHtmlConfig, VirtualHtmlTag } from '@quiteer/vite-plugins'

/**
 * 示例：带类型提示的虚拟 HTML 配置
 *
 * 使用 `satisfies VirtualHtmlConfig` 获得更严格的 IDE 提示与约束：
 * - 未声明的字段/错误的字段类型会提示错误
 * - `position`、`selfClosing` 等联合类型有自动补全
 * - `attrs` 支持 `string|number|boolean|null|undefined`
 */
export default {
  title: '这是来自 html.config.ts 的 title',
  /**
   * 外链脚本演示：新增 script 配置
   *
   * - 支持 `type/async/defer/crossorigin/integrity/referrerpolicy/nonce/fetchpriority`
   * - `position` 控制注入位置：`head` | `body-prepend` | `body-append`
   */
  script: {
    src: 'https://unpkg.com/lodash@4.17.21/lodash.min.js',
    async: true,
    position: 'body-append',
    attrs: { 'data-demo': 'quiteer' }
  },
  /**
   * 外链样式演示：新增 style 配置
   *
   * - 以 `<link rel="stylesheet" href="...">` 的形式注入
   * - 可指定 `media/crossorigin/integrity/referrerpolicy` 等属性
   */
  style: {
    src: '/src/style.css',
    media: 'screen',
    position: 'head',
    attrs: { id: 'demo-style' }
  },
  tags: [
    { tag: 'div', attrs: { style: 'width: 100px; height: 100px; background-color: red;' }, selfClosing: true, position: 'body-append' } as VirtualHtmlTag
  ]
} satisfies VirtualHtmlConfig
