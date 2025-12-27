<script setup lang="ts">
import { useBorderRadio } from 'naive-extra'
import { NAlert, NAvatar, NButton, NCard, NColorPicker, NConfigProvider, NDatePicker, NFlex, NInput, NInputNumber, NPagination, NSelect, NSlider, NTag } from 'naive-ui'
import { computed, ref } from 'vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()

const dateValue = ref<number | null>(Date.now())
const page = ref(1)
const pageSize = ref(10)

const { radiusRef, setRadius, increase, decrease, reset, getConfigProps } = useBorderRadio(3)
const configProps = computed(() => getConfigProps())
const options = [
  { label: 'Option A', value: 'A' },
  { label: 'Option B', value: 'B' },
  { label: 'Option C', value: 'C' }
]

function handleMessage() {
  window.$message?.success('Message from window.$message')
}

function handleDialog() {
  window.$dialog?.info({
    title: 'Dialog',
    content: 'Dialog from window.$dialog',
    positiveText: 'OK'
  })
}

function handleNotification() {
  window.$notification?.success({
    title: 'Notification',
    content: 'Notification from window.$notification',
    duration: 2500
  })
}

function handleLoadingBar() {
  window.$loadingBar?.start()
  setTimeout(() => {
    window.$loadingBar?.finish()
  }, 1000)
}
</script>

<template>
  <NCard title="Locale & Theme">
    <NFlex>
      <NButton @click="store.setZh">
        中文
      </NButton>
      <NButton @click="store.setEn">
        English
      </NButton>
      <NButton @click="store.toggleLocale">
        切换语言
      </NButton>
      <NButton @click="store.setDark">
        暗黑
      </NButton>
      <NButton @click="store.setLight">
        明亮
      </NButton>
      <NButton @click="store.toggleTheme">
        切换主题
      </NButton>
      <NTag type="info">
        {{ store.isDark ? 'Dark' : 'Light' }}
      </NTag>
    </NFlex>
    <NFlex vertical>
      <NDatePicker v-model:value="dateValue" panel type="date" />
      <NPagination
        v-model:page="page" v-model:page-size="pageSize" :item-count="123" show-quick-jumper
        show-size-picker
      />
    </NFlex>
    <NCard title="主题色（全局组件主题色）" class="mt-4">
      <NFlex vertical>
        <div>
          <div>Primary</div>
          <NColorPicker :value="store.primary" @update:value="store.setPrimary" />
        </div>
        <div>
          <div>Info</div>
          <NColorPicker :value="store.colors.info" @update:value="(v: string) => store.setPalette({ info: v })" />
        </div>
        <div>
          <div>Success</div>
          <NColorPicker :value="store.colors.success" @update:value="(v: string) => store.setPalette({ success: v })" />
        </div>
        <div>
          <div>Warning</div>
          <NColorPicker :value="store.colors.warning" @update:value="(v: string) => store.setPalette({ warning: v })" />
        </div>
        <div>
          <div>Error</div>
          <NColorPicker :value="store.colors.error" @update:value="(v: string) => store.setPalette({ error: v })" />
        </div>
      </NFlex>
      <NFlex class="mt-2">
        <NTag type="primary">
          primary: {{ store.primary }}
        </NTag>
        <NTag type="info">
          info: {{ store.colors.info }}
        </NTag>
        <NTag type="success">
          success: {{ store.colors.success }}
        </NTag>
        <NTag type="warning">
          warning: {{ store.colors.warning }}
        </NTag>
        <NTag type="error">
          error: {{ store.colors.error }}
        </NTag>
      </NFlex>
      <NFlex class="mt-2">
        <NButton type="warning" @click="store.resetColors">
          重置品牌色到默认
        </NButton>
      </NFlex>
    </NCard>
  </NCard>

  <NCard title="主题圆角" class="mt-4">
    <NFlex align="center">
      <NInputNumber :value="radiusRef" :min="0" :max="24" @update:value="(v) => setRadius(v ?? 0)" />
      <NSlider :value="radiusRef" :min="0" :max="24" style="width: 320px;" @update:value="(v) => setRadius(v)" />
      <NButton @click="decrease(1)">
        -1
      </NButton>
      <NButton @click="increase(1)">
        +1
      </NButton>
      <NButton type="warning" @click="reset">
        重置
      </NButton>
      <NTag type="info">
        当前：{{ radiusRef }}px
      </NTag>
    </NFlex>
    <NConfigProvider v-bind="configProps">
      <NCard title="组件示例（圆角覆盖）" class="mt-4">
        <NFlex justify="space-between" wrap>
          <NButton type="primary">
            Primary
          </NButton>
          <NButton type="info">
            Info
          </NButton>
          <NButton type="success">
            Success
          </NButton>
          <NButton type="warning">
            Warning
          </NButton>
          <NButton type="error">
            Error
          </NButton>
          <NTag type="primary">
            Tag
          </NTag>
          <NAvatar>U</NAvatar>
        </NFlex>
        <NFlex class="mt-4" vertical>
          <NInput placeholder="圆角输入框" />
          <NSelect :options="options" placeholder="圆角选择器" />
          <NAlert type="info" title="圆角提示" />
        </NFlex>
      </NCard>
    </NConfigProvider>
  </NCard>

  <NCard title="Provider Demo (Window API)" class="mt-4">
    <NFlex>
      <NButton @click="handleMessage">
        $message
      </NButton>
      <NButton @click="handleDialog">
        $dialog
      </NButton>
      <NButton @click="handleNotification">
        $notification
      </NButton>
      <NButton @click="handleLoadingBar">
        $loadingBar
      </NButton>
    </NFlex>
  </NCard>
</template>

<style lang="scss" scoped></style>
