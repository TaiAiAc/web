<script setup lang="ts">
import type { ButtonProps } from 'naive-ui'
import { useAttrs } from 'vue'

export interface Props extends /* @vue-ignore */ ButtonProps {
  tip: string
}
defineProps<Props>()

const attrs = useAttrs()
</script>

<template>
  <NTooltip trigger="hover">
    <template #trigger>
      <NButton v-bind="attrs" secondary>
        <slot />
      </NButton>
    </template>
    {{ tip }}
  </NTooltip>
</template>

<style lang="scss" scoped></style>
