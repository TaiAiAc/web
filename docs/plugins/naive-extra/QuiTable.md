# QuiTable 组件

## 概述
- 封装基于 `naive-ui` 的表格，支持列设置、导出、列拖拽（需 `vuedraggable`）、尺寸切换等能力。
- 通过 `TableProps` 提供类型约束与智能提示。

## 基本用法

<script setup lang="ts">
import TableDemo from './components/TableDemo.vue'
</script>

<ClientOnly>
  <TableDemo />
</ClientOnly>

## 常用属性
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `` `size` `` | `` 'small' \| 'medium' \| 'large' `` | — | 表格尺寸 |
| `` `columns` `` | `Array<{ title?: string; key: string; render?: Function; }>` | — | 列配置数组，支持设置标题、字段键名、自定义渲染函数等 |
| `` `data` `` | `any[]` | — | 静态表格数据；若需异步加载，可配合 `fetch` 函数使用 |
| `` `show-settings` `` | `boolean` | — | 是否显示列设置面板（支持显示/隐藏列）；如需拖拽排序，请额外安装 `vuedraggable` |
| `` `exportable` `` | `boolean \| TableExportType` | — | 是否启用导出功能；若为对象，可指定导出类型（详见 `TableExportType` 类型定义） |

## 说明
- 若需高级用法（如服务端分页、筛选与排序），请在实际项目中结合 `fetch`、`onUpdate` 等事件进行拓展。
- 更多示例将持续补充到插件文档目录中。
