<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui'
import type { Props } from './props'
import { isArray, isString } from '@quiteer/is'
import { computed, nextTick, ref, watchEffect } from 'vue'

interface FileListItem {
  id: string
  name: string
  url: string
}

// 使用 /* @vue-ignore */ 避免编译器尝试展开复杂索引类型
// 以防止“Failed to resolve index type into finite keys”错误
const props = withDefaults(defineProps<Props>(), {
  isSetFieldsValue: true
})

const modelValue = defineModel<FileListItem[] | string | undefined>('value')

const isSingle = computed(() => props.max === 1)
const accept = computed(() => (props.accept as string) ?? '')
const fileSize = computed(() => (props.fileSize as number) ?? 0)
const showTip = computed(() => props.accept || props.fileSize)

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

// 函数：文件上传完成后的处理
// 作用：根据配置更新 v-model 的值（字符串或列表），并返回 UploadFileInfo
function handleFinish({ file, event }: { file: UploadFileInfo, event?: ProgressEvent }) {
  const result = JSON.parse((event?.target as unknown as any)?.response)?.data as {
    url: string
    fileName: string
    ossId: string
  }

  if (props.dataType === 'string') {
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

// 函数：移除文件后的处理
// 作用：根据是否单文件模式更新 v-model 的列表
function handleRemove({ index }: { index: number }) {
  if (isSingle.value) {
    modelValue.value = []
  }
  else {
    modelValue.value = (modelValue.value as FileListItem[])?.filter((_, i) => i !== index)
  }
}

// 函数：上传错误时的处理
// 作用：打印后端返回的错误信息
function handleError(options: { file: UploadFileInfo, event?: ProgressEvent }) {
  const { event } = options
  // @ts-expect-error Ignore type errors
  const responseText = event?.target?.responseText
  const msg = JSON.parse(responseText).msg
  console.error('msg: ', msg)
}

// 函数：上传前校验
// 作用：校验类型、大小、文件名合法性，返回是否允许上传
function beforeUpload(options: { file: UploadFileInfo, fileList: UploadFileInfo[] }) {
  const { file } = options

  // 校检文件类型
  if (props?.accept) {
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
  if (props.fileSize && file.file?.size) {
    const isLt = file.file?.size / 1024 / 1024 < fileSize.value
    if (!isLt) {
      return false
    }
  }
  return true
}
</script>

<template>
  <template v-if="props.fileType === 'file'">
    <NUpload v-bind="props" v-model:file-list="fileList">
      <NButton>上传文件</NButton>
    </NUpload>
  </template>
  <template v-else-if="props.fileType === 'dragger-file'">
    <div class="w-full flex-col">
      <NUpload
        v-bind="props"
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
  <template v-else-if="props.fileType === 'image-view'">
    <template v-if="!props.disabled">
      <NUpload
        v-bind="props"
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
  <template v-else-if="props.fileType === 'video-view'">
    <template v-if="!props.disabled">
      <NUpload
        v-bind="props"
        v-model:file-list="fileList"
        @finish="handleFinish"
        @remove="handleRemove"
        @before-upload="beforeUpload"
        @error="handleError"
      >
        <NButton>上传视频</NButton>
      </NUpload>
      <NSpace class="mt-12px">
        <div v-for="(item, i) in fileList" :key="i" style="width: 320px;">
          <video
            v-if="item.url"
            :src="item.url"
            controls
            style="width: 100%; border-radius: 8px; background: #000;"
          />
          <NText v-else>
            暂无预览
          </NText>
        </div>
      </NSpace>
    </template>
    <NSpace v-else>
      <div v-for="(item, i) in fileList" :key="i" style="width: 320px;">
        <video
          v-if="item.url"
          :src="item.url"
          controls
          style="width: 100%; border-radius: 8px; background: #000;"
        />
        <NText v-else>
          暂无预览
        </NText>
      </div>
    </NSpace>
  </template>

  <template v-else-if="props.fileType === 'audio-view'">
    <template v-if="!props.disabled">
      <NUpload
        v-bind="props"
        v-model:file-list="fileList"
        @finish="handleFinish"
        @remove="handleRemove"
        @before-upload="beforeUpload"
        @error="handleError"
      >
        <NButton>上传音频</NButton>
      </NUpload>
      <NSpace class="mt-12px">
        <div v-for="(item, i) in fileList" :key="i" style="width: 320px;">
          <audio
            v-if="item.url"
            :src="item.url"
            controls
            style="width: 100%;"
          />
          <NText v-else>
            暂无预览
          </NText>
        </div>
      </NSpace>
    </template>
    <NSpace v-else>
      <div v-for="(item, i) in fileList" :key="i" style="width: 320px;">
        <audio
          v-if="item.url"
          :src="item.url"
          controls
          style="width: 100%;"
        />
        <NText v-else>
          暂无预览
        </NText>
      </div>
    </NSpace>
  </template>
</template>
