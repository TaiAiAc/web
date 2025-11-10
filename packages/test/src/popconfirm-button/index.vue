<script setup lang="ts">
import type { Props } from './props'
import { NButton, NPopconfirm } from 'naive-ui'

defineProps<Props>()
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
