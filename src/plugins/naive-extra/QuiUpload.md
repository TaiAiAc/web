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
  <!-- <UploadDemo /> -->
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
