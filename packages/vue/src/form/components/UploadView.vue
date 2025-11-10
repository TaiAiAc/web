<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui'
import type { UploadConfig } from '../types'
import { isArray, isString } from '@quiteer/is'
import { computed, nextTick, ref, useAttrs, watchEffect } from 'vue'

interface FileListItem {
  id: string
  name: string
  url: string
}

const props = defineProps<{ isSetFieldsValue: boolean }>()
const modelValue = defineModel<FileListItem[] | string | undefined>('value')
const attrs = useAttrs() as unknown as UploadConfig

const isSingle = computed(() => attrs.max === 1)
const accept = computed(() => (attrs.accept as string) ?? '')
const fileSize = computed(() => (attrs.fileSize as number) ?? 0)
const showTip = computed(() => attrs.accept || attrs.fileSize)

const fileList = ref<UploadFileInfo[]>([])

function transformList(uri: FileListItem[] | undefined | null): UploadFileInfo[] {
  if (!uri)
    return []

  if (Array.isArray(uri)) {
    return uri.map((item) => {
      return {
        ...item,
        status: 'finished'
      }
    })
  }
  return []
}

watchEffect(() => {
  if (props.isSetFieldsValue) {
    if (isString(modelValue.value)) {
      fileList.value = [{ id: '0', name: '文件', url: modelValue.value, status: 'finished' }]
    }
    else if (isArray(modelValue.value)) {
      fileList.value = transformList(modelValue.value)
    }
  }
})

function isErrorState(xhr: XMLHttpRequest) {
  const responseText = xhr?.responseText
  const response = JSON.parse(responseText)
  return response.code !== 200
}

function handleFinish({ file, event }: { file: UploadFileInfo, event?: ProgressEvent }) {
  const result = JSON.parse((event?.target as unknown as any)?.response)?.data as {
    url: string
    fileName: string
    ossId: string
  }

  if (attrs.dataType === 'string') {
    modelValue.value = result.url
  }
  else {
    if (!isArray(modelValue.value))
      modelValue.value = []
    nextTick(() => {
      (modelValue.value as FileListItem[])?.push({
        id: result.ossId,
        name: result.fileName,
        url: result.url
      })
    })
  }

  return file
}

function handleRemove({ index }: { index: number }) {
  if (isSingle.value) {
    modelValue.value = []
  }
  else {
    modelValue.value = (modelValue.value as FileListItem[])?.filter((_, i) => i !== index)
  }
}

function handleError(options: { file: UploadFileInfo, event?: ProgressEvent }) {
  const { event } = options
  // @ts-expect-error Ignore type errors
  const responseText = event?.target?.responseText
  const msg = JSON.parse(responseText).msg
  console.error('msg: ', msg)
}

function beforeUpload(options: { file: UploadFileInfo, fileList: UploadFileInfo[] }) {
  const { file } = options

  // 校检文件类型
  if (attrs?.accept) {
    const fileName = file.name.split('.')
    const fileExt = `.${fileName[fileName.length - 1]}`
    const isTypeOk = accept.value.split(',')?.includes(fileExt)
    if (!isTypeOk) {
      return false
    }
  }
  // 校检文件名是否包含特殊字符
  if (file.name.includes(',')) {
    return false
  }
  // 校检文件大小
  if (attrs.fileSize && file.file?.size) {
    const isLt = file.file?.size / 1024 / 1024 < fileSize.value
    if (!isLt) {
      return false
    }
  }
  return true
}
</script>

<template>
  <template v-if="attrs.fileType === 'file'">
    <NUpload v-bind="attrs" v-model:file-list="fileList">
      <NButton>上传文件</NButton>
    </NUpload>
  </template>
  <template v-else-if="attrs.fileType === 'file-dragger'">
    <div class="w-full flex-col">
      <NUpload
        v-bind="attrs"
        v-model:file-list="fileList"
        :multiple="isSingle"
        directory-dnd
        :is-error-state="isErrorState"
        @finish="handleFinish"
        @error="handleError"
        @before-upload="beforeUpload"
        @remove="handleRemove"
      >
        <NUploadDragger>
          <div class="mb-12px flex-center">
            <icon-material-symbols:unarchive-outline class="text-58px color-#d8d8db dark:color-#a1a1a2" />
          </div>
          <NText class="text-16px">
            点击或者拖动文件到该区域来上传
          </NText>
          <NP v-if="showTip" depth="3" class="mt-8px text-center">
            请上传
            <template v-if="fileSize">
              大小不超过
              <b class="text-red-500">{{ fileSize }}MB</b>
            </template>
            <template v-if="accept">
              ，且格式为
              <b class="text-red-500">{{ accept?.replaceAll(',', '/') }}</b>
            </template>
            的文件
          </NP>
        </NUploadDragger>
      </NUpload>
    </div>
  </template>
  <template v-else-if="attrs.fileType === 'image-view'">
    <template v-if="!attrs.disabled">
      <NUpload
        v-bind="attrs"
        v-model:file-list="fileList"
        list-type="image-card"
        @finish="handleFinish"
        @remove="handleRemove"
      />
    </template>
    <NImageGroup v-else>
      <NSpace>
        <NImage v-for="(item, i) in fileList" :key="i" width="100" :src="item.url ?? ''" />
      </NSpace>
    </NImageGroup>
  </template>
</template>
