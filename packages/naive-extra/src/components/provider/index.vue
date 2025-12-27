<script setup lang="ts">
import type { ProviderProps } from './props'
import { dateZhCN, useDialog, useLoadingBar, useMessage, useNotification, zhCN } from 'naive-ui'
import { createTextVNode } from 'vue'

defineOptions({
  name: 'QuiProvider'
})

const props = defineProps<ProviderProps>()

const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    function register() {
      window.$loadingBar = useLoadingBar()
      window.$dialog = useDialog()
      window.$message = useMessage()
      window.$notification = useNotification()
    }

    register()

    return () => createTextVNode()
  }
})
</script>

<template>
  <n-config-provider
    :locale="props.configProviderProps?.locale ?? zhCN"
    :date-locale="props.configProviderProps?.dateLocale ?? dateZhCN"
    class="h-full"
    v-bind="props.configProviderProps"
  >
    <n-loading-bar-provider v-bind="props.loadingBarProviderProps">
      <n-dialog-provider v-bind="props.dialogProviderProps">
        <n-notification-provider v-bind="props.notificationProviderProps">
          <n-message-provider v-bind="props.messageProviderProps">
            <ContextHolder />
            <slot />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped></style>
