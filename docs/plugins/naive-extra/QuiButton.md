# QuiButton 按钮组件

包含 `QuiBaseButton`（基础按钮）和 `QuiActionButton`（操作按钮组）两个组件。

## QuiBaseButton

对 `NButton` 的增强封装，集成了 Tooltip（提示）和 Popconfirm（二次确认）功能，简化了常见交互的实现。

### 基础用法

```vue
<template>
  <!-- 基础按钮 -->
  <QuiBaseButton type="primary">保存</QuiBaseButton>
  
  <!-- 带图标 -->
  <QuiBaseButton icon="carbon:add">新建</QuiBaseButton>
  
  <!-- 带 Tooltip -->
  <QuiBaseButton icon="carbon:help" tooltip="点击查看帮助" />
  
  <!-- 带二次确认 -->
  <QuiBaseButton 
    type="error" 
    pop-text="确认删除该数据吗？"
    @positive-click="handleDelete"
  >
    删除
  </QuiBaseButton>
</template>
```

### API

#### Props

继承自 Naive UI `ButtonProps`，并扩展以下属性：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 图标名称 (Iconify) | `string` | - |
| tooltip | 提示文本，存在时自动包裹 NTooltip | `string` | - |
| text | 是否为文本按钮 (mode='text') | `boolean` | `false` |
| popconfirm | Popconfirm 配置对象，存在时自动包裹 NPopconfirm | `PopconfirmProps` | - |
| popText | Popconfirm 确认文本，设置后自动开启 Popconfirm | `string` | - |
| positiveText | Popconfirm 确认按钮文本 | `string` | - |
| negativeText | Popconfirm 取消按钮文本 | `string` | - |
| permission | 权限控制配置 | `ButtonPermission` | - |

#### ButtonPermission 类型

```typescript
interface ButtonPermission {
  /** 权限组：[拥有的权限列表, 需要的权限] */
  group: [string[], string]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示 */
  show?: boolean
}
```

#### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 自定义图标 |
| tooltip | 自定义 Tooltip 内容 |
| popconfirm | 自定义 Popconfirm 内容 |

#### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击事件 | `(e: MouseEvent) => void` |
| positiveClick | Popconfirm 确认点击事件 | `(e: MouseEvent) => void` |

---

## QuiActionButton

专为表格操作列设计的按钮组组件，支持自动折叠、响应式布局、统一配置等。

### 基础用法

```vue
<script setup lang="ts">
import { QuiActionButton, ActionItem } from 'naive-extra'

const actions: ActionItem[] = [
  { key: 'edit', label: '编辑', onClick: () => {} },
  { 
    key: 'delete', 
    label: '删除', 
    popText: '确认删除？',
    onPositiveClick: () => {} 
  }
]
</script>

<template>
  <!-- 表格操作列模式 (默认) -->
  <QuiActionButton :actions="actions" />
</template>
```

### API

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| actions | 按钮配置列表 | `ActionItem[]` | `[]` |
| mode | 显示模式 | `'icon' \| 'text' \| 'icon-text' \| 'button' \| 'secondary'` | `'text'` |
| max | 最大显示数量，超过的折叠到“更多”菜单 | `number` | `3` |
| showDivider | 是否显示分割线 (仅 text 模式有效) | `boolean` | `false` |
| responsive | 是否开启响应式折叠 (自动根据宽度计算 max) | `boolean` | `false` |
| size | 按钮尺寸 | `ButtonProps['size']` | - |
| buttonProps | 统一透传给所有按钮的属性 | `ButtonProps` | - |

#### ActionItem 配置

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| key | 唯一标识，也是默认图标映射键值 | `string` |
| label | 按钮文本 | `string` |
| icon | 图标名称 | `string` |
| onClick | 点击回调 | `(key, item) => void` |
| show | 是否显示 | `boolean \| (() => boolean) \| Ref<boolean>` |
| disabled | 是否禁用 | `boolean \| (() => boolean) \| Ref<boolean>` |
| tooltip | 提示文本 | `string` |
| popconfirm | Popconfirm 配置 | `PopconfirmProps` |
| popText | Popconfirm 文本 | `string` |
| onPositiveClick | Popconfirm 确认回调 | `(key, item) => void` |
| permission | 权限控制 | `ButtonPermission` |
| props | 透传给单个按钮的属性 | `ButtonProps` |

#### 内置 ActionEnum

组件内置了常用操作的枚举和默认图标：

```typescript
enum ActionEnum {
  EDIT = 'edit',      // carbon:edit
  DELETE = 'delete',  // carbon:trash-can
  VIEW = 'view',      // carbon:view
  ADD = 'add',        // carbon:add
  SEARCH = 'search',  // carbon:search
  DOWNLOAD = 'download', // carbon:download
  UPLOAD = 'upload',  // carbon:upload
  SETTING = 'setting' // carbon:settings
}
```
