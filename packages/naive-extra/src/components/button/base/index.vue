<script setup lang="ts">
import type { ButtonProps, PopconfirmProps } from 'naive-ui'
import type { BaseButtonProps } from './props'
import { QuiIcon } from '../../icon'

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<BaseButtonProps>(), {
  type: 'default',
  size: 'small',
  text: false,
  secondary: false,
  disabled: undefined
})

const emit = defineEmits<{
  click: [e: MouseEvent]
  positiveClick: [e: MouseEvent]
}>()

const computedButtonProps = computed<ButtonProps>(() => {
  const { icon: _1, tooltip: _2, popconfirm: _3, popText: _4, positiveText: _5, negativeText: _6, permission: _7, disabled: _8, ...others } = props
  return others as ButtonProps
})

const permissionCheck = computed(() => {
  if (!props.permission) {
    return { visible: true, disabled: false }
  }

  const { group, disabled } = props.permission
  const [codes, code] = group

  // 如果权限组为空或当前权限为空，认为有权限（或者根据业务逻辑，这里假设必须都有值）
  // 按照通常逻辑，如果没传 code，就不校验
  if (!codes || !code) {
    return { visible: true, disabled: false }
  }

  const hasPermission = codes.includes(code)

  if (hasPermission) {
    return { visible: true, disabled: false }
  }

  // 无权限
  if (disabled) {
    return { visible: true, disabled: true }
  }

  // 默认隐藏
  return { visible: false, disabled: false }
})

const finalDisabled = computed(() => {
  if (props.disabled !== undefined) {
    return props.disabled
  }
  return permissionCheck.value.disabled
})

const computedPopconfirm = computed<PopconfirmProps | undefined>(() => {
  const { popconfirm, positiveText, negativeText, popText } = props
  if (!popconfirm && !positiveText && !negativeText && !popText)
    return undefined

  let basePopconfirm: PopconfirmProps = {}

  if (popconfirm) {
    basePopconfirm = { ...popconfirm }
  }
  else if (popText) {
    basePopconfirm.showIcon = true
  }

  if (positiveText) {
    basePopconfirm.positiveText = positiveText
  }
  if (negativeText) {
    basePopconfirm.negativeText = negativeText
  }

  return Object.keys(basePopconfirm).length > 0 ? basePopconfirm : undefined
})

const popconfirmTitle = computed(() => {
  const { popText } = props
  if (popText)
    return popText
  return '确认进行此操作？'
})
</script>

<template>
  <template v-if="permissionCheck.visible">
    <!-- 带气泡确认的按钮 -->
    <NPopconfirm
      v-if="computedPopconfirm || $slots.popconfirm"
      v-bind="computedPopconfirm"
      @positive-click="emit('positiveClick', $event)"
    >
      <template #trigger>
        <NButton
          v-bind="{ ...computedButtonProps, ...$attrs }"
          :disabled="finalDisabled"
          @click="emit('click', $event)"
        >
          <template v-if="icon" #icon>
            <QuiIcon :icon="icon" />
          </template>
          <slot />
        </NButton>
      </template>
      <slot name="popconfirm">
        {{ popconfirmTitle }}
      </slot>
    </NPopconfirm>

    <!-- 普通按钮 -->
    <template v-else>
      <!-- 带提示的按钮 -->
      <NTooltip v-if="tooltip || $slots.tooltip" trigger="hover">
        <template #trigger>
          <NButton
            v-bind="{ ...computedButtonProps, ...$attrs }"
            :disabled="finalDisabled"
            @click="emit('click', $event)"
          >
            <template v-if="icon" #icon>
              <QuiIcon :icon="icon" />
            </template>
            <slot />
          </NButton>
        </template>
        <slot name="tooltip">
          {{ tooltip }}
        </slot>
      </NTooltip>

      <!-- 仅按钮 -->
      <NButton
        v-else
        v-bind="{ ...computedButtonProps, ...$attrs }"
        :disabled="finalDisabled"
        @click="emit('click', $event)"
      >
        <template v-if="icon" #icon>
          <QuiIcon :icon="icon" />
        </template>
        <slot />
      </NButton>
    </template>
  </template>
</template>
