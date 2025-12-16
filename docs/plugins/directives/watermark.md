# v-watermark 指令

## 概述
- 在容器内叠加文字或图片水印，支持透明度、旋转、间距、排列等配置。

## 示例
<script setup lang="ts">
import WatermarkDemo from './components/WatermarkDemo.vue'
</script>

<ClientOnly>
  <WatermarkDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/WatermarkDemo.vue

</details>

## 组合示例
| 配置项 | 类型 | 示例 | 说明 |
|--------|------|------|------|
| 文字水印（简写） | `string` | `` v-watermark="'机密'" `` | 直接传入字符串，生成文本水印 |
| 图片水印 | `object` | `` v-watermark="{ image: '/logo.png', imageOpacity: 0.3 }" `` | 使用图片作为水印；`imageOpacity` 控制透明度（0~1） |
| `rotate` | `number` | `rotate: -30` | 水印旋转角度（单位：度），默认 `-30` |
| `gap` | `number` | `gap: 100` | 水印之间的间距（单位：px），控制密度 |
| `pattern` | `` 'cross' \| 'grid' `` | `pattern: 'grid'` | 排列模式：<br>- `'cross'`：十字交叉<br>- `'grid'`：网格平铺 |
| `fontSize` | `number \| string` | `fontSize: 16` 或 `fontSize: '14px'` | 文本水印的字体大小 |
| `color` | `string` | `color: '#ccc'` | 文本水印的颜色（支持 HEX / RGBA 等） |
