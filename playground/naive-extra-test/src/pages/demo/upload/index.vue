<script setup lang="ts">
import { QuiUpload, useUploadProps } from 'naive-extra'
import { ref } from 'vue'

const { getUploadProps, getImageUploadProps, getAudioUploadProps, getVedioUploadProps } = useUploadProps({
  fileType: 'file',
  action: 'https://www.mocky.io/v2/5e4bafc63100007100d8b70f',
  dataType: 'string'
})

console.log('getUploadProps() :>> ', getUploadProps())

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

<template>
  <n-card title="file" size="small">
    <QuiUpload v-bind="getUploadProps()" v-model:value="list1" :max="1" file-type="file" />
  </n-card>
  <n-card title="dragger-file" size="small">
    <QuiUpload v-bind="getUploadProps()" v-model:value="list1" file-type="dragger-file" />
  </n-card>
  <n-card title="image-view" size="small">
    <QuiUpload v-bind="getImageUploadProps()" v-model:value="list1" file-type="image-view" />
  </n-card>
  <n-card title="video-view" size="small">
    <QuiUpload v-bind="getVedioUploadProps()" v-model:value="list2" file-type="video-view" />
  </n-card>
  <n-card title="audio-view" size="small">
    <QuiUpload v-bind="getAudioUploadProps()" v-model:value="list3" file-type="audio-view" />
  </n-card>
</template>

<style lang="scss" scoped></style>
