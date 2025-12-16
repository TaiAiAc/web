# QuiUpload 组件

## 基本用法

<script setup lang="ts">
import UploadDemo from './components/UploadDemo.vue'
import { AcceptType, useUploadProps ,QuiUpload} from '@quiteer/naive-extra'
import { ref } from 'vue'

const list1 = ref([
  { id: 'a1', name: '示例图片', status: 'finished', url: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg' }
])

const list2 = ref([
  { id: 'a1', name: '示例视频', status: 'finished', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
])

const list3 = ref([
  { id: 'a1', name: '示例音频', status: 'finished', url: 'https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3' }
])

</script>

<ClientOnly>
  <UploadDemo />
</ClientOnly>

## 组件模式(fileType)

<ClientOnly>
<n-flex>
  <n-card title="image-view" size="small">
    <QuiUpload file-type="image-view" v-model:value="list1" :is-set-fields-value="true" />
  </n-card>
  <n-card title="video-view" size="small">
    <QuiUpload file-type="video-view" v-model:value="list2" :is-set-fields-value="true" />
  </n-card>
  <n-card title="audio-view" size="small">
    <QuiUpload file-type="audio-view" v-model:value="list3" :is-set-fields-value="true" />
  </n-card>
  <n-card title="file" size="small">
    <QuiUpload file-type="file" v-model:value="list1" :is-set-fields-value="true" />
  </n-card>
</n-flex>
</ClientOnly>

## 属性

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `` `file-type` `` | `` 'image-view' \| 'video-view' \| 'audio-view' \| 'file' \| 'dragger-file' `` | — | 上传视图模式，决定 UI 展示样式 |
| `` `max` `` | `number` | — | 最大上传文件数量；设为 `1` 时启用单文件模式，影响移除逻辑与界面展示 |
| `` `accept` `` | `string[] \| AcceptType` | — | 允许的文件类型，可直接传扩展名数组，或使用 `AcceptType.Image` 等预设常量 |
| `` `file-size` `` | `number` | — | 单个文件大小上限（单位：MB），校验在上传前执行（如 `2` 表示 2MB） |
| `` `data-type` `` | `` 'string' \| 'array' `` | `'array'` | 返回值类型：`'string'` 时返回单文件 URL 字符串，否则返回文件对象列表 |
| `` `is-set-fields-value` `` | `boolean` | `` `true` `` | 是否根据 `v-model` 的初始值自动回显已上传的文件列表 |
| — | — | — | **以下属性透传至 `naive-ui` 的 `NUpload` 组件**：<br>`action`、`headers`、`data`、`disabled`、`list-type` 等标准 `UploadProps` |

## 事件

| 事件名 | 回调参数 | 说明 |
|--------|----------|------|
| `` `@finish` `` | `(value: string \| any[])` | 上传完成时触发；组件会根据 `data-type` 自动更新 `v-model`（`'string'` 模式返回 URL 字符串，否则返回文件对象列表） |
| `` `@remove` `` | `(file: any, index?: number)` | 文件被移除时触发；单文件模式清空值，列表模式按索引移除对应项 |
| `` `@before-upload` `` | `(file: File) => boolean \| Promise<boolean>` | 上传前校验钩子，可用于检查文件类型、大小、文件名合法性；返回 `false` 或 reject 可中断上传 |
| `` `@error` `` | `(error: Error \| { message: string })` | 上传失败时触发，通常用于打印后端返回的错误信息，便于调试与用户提示 |

## 插槽

- `dragger-file` 模式下使用 `NUploadDragger`，可通过默认插槽自定义拖拽区域内容
- 其他模式可以在 `NUpload` 默认插槽中放置触发按钮（示例中使用 `NButton`）

## 返回值结构（v-model）

| 模式 | 条件 | `v-model:value` 值类型与结构 |
|------|------|-------------------------------|
| 字符串模式 | `data-type='string'` 且 `max=1` | `string`<br>文件的 URL 字符串（如 `'https://example.com/file.jpg'`） |
| 列表模式 | 其他情况（默认） | `Array<{ id: string; name: string; url: string }>`<br>文件对象数组，每项包含唯一标识、文件名和访问地址 |

## AcceptType 对照表

| 常量 | 支持的文件扩展名 |
|------|------------------|
| `` AcceptType.Image `` | `.jpg, .jpeg, .png, .gif, .bmp, .webp, .svg` |
| `` AcceptType.Video `` | `.mp4, .webm, .ogg, .mov, .avi, .wmv, .flv, .mkv` |
| `` AcceptType.Audio `` | `.mp3, .wav, .ogg, .aac, .flac, .m4a` |
| `` AcceptType.File ``  | `.doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .pdf, .zip, .rar, .7z, .tar, .gz` |


## 与表单集成

```vue
<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import { AcceptType, QuiForm, QuiUpload, useUploadProps } from '@quiteer/naive-extra'

const schemas: FormSchema[] = [
  { field: 'name', label: '姓名', component: 'NInput' },
  // 将上传作为表单字段，支持字符串或列表两种模式
  { field: 'avatar', label: '头像', component: 'QuiUpload' }
]

// 生成常用上传配置
const uploadProps = useUploadProps({
  accept: AcceptType.Image,
  multiple: true,
  fileType: 'image-view'
})

/**
 * 函数：提交处理
 * 作用：获取并处理表单值（其中上传字段可能为字符串或文件列表）
 */
function handleSubmit(values: Record<string, any>) {
  // values.avatar 可能是字符串（url）或数组（id/name/url）
  console.log(values)
}
</script>

<template>
  <QuiForm :schemas="schemas">
    <template #avatar>
      <QuiUpload v-bind="uploadProps" />
    </template>
    <template #action-button>
      <NButton type="primary" @click="handleSubmit">
        提交
      </NButton>
    </template>
  </QuiForm>
</template>
```

## 使用建议

- 单文件返回字符串：设置 `data-type='string'` 且 `max=1`
- 文件类型校验：优先使用 `AcceptType.*` 提供的枚举，确保与 `before-upload` 一致
- 大小限制：设置 `file-size` 并在 UI 上提示；错误信息通过 `@error` 查看
- 初始值回显：`is-set-fields-value=true` 时，字符串或列表均会自动生成已完成文件项
