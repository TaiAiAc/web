<script setup lang="ts">
import type { ButtonProps, PopconfirmProps } from 'naive-ui'

defineProps<{
  title: string
  popconfirmProps?: PopconfirmProps
  buttonProps?: ButtonProps
}>()
</script>

<template>
  <NPopconfirm v-bind="popconfirmProps">
    <template #trigger>
      <NButton v-bind="buttonProps" secondary>
        <slot />
      </NButton>
    </template>
    {{ title }}
  </NPopconfirm>
</template>

<style lang="scss" scoped></style>
