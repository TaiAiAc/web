<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import type { StyleValue } from 'vue'
import type { ActionButtonProps, ActionItem } from './props'
import { useElementSize, useResizeObserver } from '@vueuse/core'
import { QuiIcon } from '../../icon'
import QuiBaseButton from '../base/index.vue'
import {
  resolveButtonProps as _resolveButtonProps,
  resolveMoreButtonProps as _resolveMoreButtonProps,
  getIcon,
  isDisabled
} from './utils'

const props = withDefaults(defineProps<ActionButtonProps>(), {
  actions: () => [],
  mode: 'button',
  max: 3,
  // buttonProps 默认值留空，由内部逻辑根据 mode 计算
  buttonProps: undefined,
  size: undefined,
  showDivider: false
})

const resolveButtonProps = (item: ActionItem) => _resolveButtonProps(item, props.mode, { ...props.buttonProps, size: props.size })
const resolveMoreButtonProps = () => _resolveMoreButtonProps(props.mode, { ...props.buttonProps, size: props.size })

// 判断是否显示
function isShow(item: ActionItem) {
  if (item.show === undefined)
    return true
  if (typeof item.show === 'function')
    return item.show()
  return unref(item.show)
}

// 过滤出可见的操作
const visibleActions = computed(() => {
  return props.actions.filter(isShow)
})

// 响应式显示逻辑
const containerRef = ref<any>()
const shadowRef = ref<any>()
const autoMax = ref(props.max)

const containerEl = computed(() => containerRef.value?.$el || containerRef.value)
const { width: containerWidth } = useElementSize(containerEl)

const limit = computed(() => props.responsive ? autoMax.value : props.max)

// 分割显示和折叠的操作
const displayActions = computed(() => {
  return visibleActions.value.slice(0, limit.value)
})

const collapsedActions = computed(() => {
  return visibleActions.value.slice(limit.value)
})

// 计算自动折叠数量
function updateAutoMax() {
  const el = containerEl.value
  if (!el)
    return

  const width = containerWidth.value
  if (!width)
    return

  // 获取间距 (NFlex size="small" 默认为 8px gap)
  const style = getComputedStyle(el)
  // 优先使用 column-gap，回退到 gap
  const gap = Number.parseFloat(style.columnGap || style.gap) || 8
  const paddingLeft = Number.parseFloat(style.paddingLeft) || 0
  const paddingRight = Number.parseFloat(style.paddingRight) || 0

  // 可用宽度需要减去内边距
  const availableWidth = width - paddingLeft - paddingRight

  // 获取所有按钮和元素的宽度
  if (!shadowRef.value)
    return
  const children = Array.from(shadowRef.value.children) as HTMLElement[]
  // shadowRef 结构: [Btn1, Btn2, ..., MoreBtn, Divider]
  // 最后一个是 Divider, 倒数第二个是 MoreBtn
  const dividerEl = children[children.length - 1]
  const moreBtnEl = children[children.length - 2]
  const actionBtns = children.slice(0, -2)

  const getWidth = (el: HTMLElement) => el?.getBoundingClientRect().width || 0

  const dividerWidth = getWidth(dividerEl)
  const moreBtnWidth = getWidth(moreBtnEl)

  // 1. 尝试放入所有按钮
  // 宽度计算:
  // 无分割线: Btn + Gap + Btn + Gap ...
  // 有分割线: Btn + Gap + Divider + Gap + Btn ...

  const calculateWidth = (btnCount: number, hasMore: boolean) => {
    if (btnCount === 0)
      return hasMore ? moreBtnWidth : 0

    let width = 0
    // 累加按钮宽度
    for (let i = 0; i < btnCount; i++) {
      width += getWidth(actionBtns[i])
    }

    // 累加按钮之间的间距和分割线
    const intervalCount = btnCount - 1
    if (intervalCount > 0) {
      if (props.showDivider) {
        width += intervalCount * (gap * 2 + dividerWidth)
      }
      else {
        width += intervalCount * gap
      }
    }

    // 如果有 More 按钮
    if (hasMore) {
      // 连接处
      // Btn (Gap [Divider Gap]) More
      if (props.showDivider) {
        width += gap * 2 + dividerWidth
      }
      else {
        width += gap
      }
      width += moreBtnWidth
    }

    return width
  }

  // 检查是否所有都能放下 (无 More)
  const allWidth = calculateWidth(actionBtns.length, false)
  // 留出 1px 缓冲，避免子像素精度问题
  if (allWidth <= availableWidth - 1) {
    autoMax.value = actionBtns.length
    return
  }

  // 尝试找到最大能放下的数量 (带 More)
  // 从 actionBtns.length - 1 开始递减
  for (let i = actionBtns.length - 1; i >= 0; i--) {
    const w = calculateWidth(i, true)
    if (w <= availableWidth - 1) {
      autoMax.value = i
      return
    }
  }

  // 最坏情况显示 0 个 (只显示 More)
  autoMax.value = 0
}

useResizeObserver(shadowRef, () => {
  if (props.responsive) {
    updateAutoMax()
  }
})

watch([containerWidth, () => props.actions, () => props.showDivider, () => props.responsive], () => {
  if (props.responsive) {
    // 使用 requestAnimationFrame 避免在一次渲染周期内多次计算
    requestAnimationFrame(() => updateAutoMax())
  }
})

const shadowStyle: StyleValue = {
  display: 'flex',
  gap: '8px',
  position: 'absolute',
  visibility: 'hidden',
  pointerEvents: 'none',
  top: 0,
  left: 0,
  zIndex: -1,
  width: 'max-content'
}

onMounted(() => {
  if (props.responsive) {
    updateAutoMax()
    // 初始延迟再次计算，确保字体加载等
    setTimeout(updateAutoMax, 100)
  }
})

function handleClick(item: ActionItem) {
  item.onClick?.(item.key, item)
}

function handlePopconfirmPositiveClick(item: ActionItem) {
  if (item.onPositiveClick) {
    item.onPositiveClick(item.key, item)
    return
  }

  // 兼容 popconfirm 对象中的 onPositiveClick
  if (typeof item.popconfirm === 'object' && item.popconfirm !== null && 'onPositiveClick' in item.popconfirm) {
    (item.popconfirm as any).onPositiveClick(item.key, item)
    return
  }

  item.onClick?.(item.key, item)
}

// 下拉菜单选项
const dropdownOptions = computed<DropdownOption[]>(() => {
  return collapsedActions.value.map(item => ({
    key: item.key,
    label: item.label,
    icon: () => {
      const icon = getIcon(item)
      return icon ? h(QuiIcon, { icon }) : undefined
    },
    disabled: isDisabled(item),
    props: {
      onClick: () => {
        if (!item.popconfirm) {
          handleClick(item)
        }
      }
    }
  }))
})

function handleDropdownSelect(key: string | number) {
  const item = collapsedActions.value.find(a => a.key === key)
  if (item && !item.popconfirm) {
    handleClick(item)
  }
}
</script>

<template>
  <NFlex
    ref="containerRef"
    align="center"
    size="small"
    v-bind="$attrs"
    style="width: 100%"
    :wrap="false"
  >
    <template v-for="(item, index) in displayActions" :key="`action-${item.key}`">
      <QuiBaseButton
        v-bind="resolveButtonProps(item)"
        @click="handleClick(item)"
        @positive-click="handlePopconfirmPositiveClick(item)"
      >
        <template v-if="props.mode !== 'icon'">
          {{ item.label }}
        </template>
      </QuiBaseButton>
      <NDivider v-if="showDivider && index < displayActions.length - 1" :key="`div-${item.key}`" vertical />
    </template>

    <!-- More Button -->
    <NDropdown
      v-if="collapsedActions.length > 0"
      :options="dropdownOptions"
      @select="handleDropdownSelect"
    >
      <div style="display: inline-flex; align-items: center;">
        <NDivider v-if="showDivider && displayActions.length > 0" vertical />
        <QuiBaseButton
          v-bind="resolveMoreButtonProps()"
        >
          <template v-if="props.mode !== 'icon'">
            更多
          </template>
        </QuiBaseButton>
      </div>
    </NDropdown>
  </NFlex>

  <!-- Shadow Container for Calculation -->
  <div
    v-if="responsive"
    ref="shadowRef"
    class="action-button-shadow"
    :style="shadowStyle"
    aria-hidden="true"
  >
    <QuiBaseButton
      v-for="item in visibleActions"
      :key="`shadow-${item.key}`"
      v-bind="resolveButtonProps(item)"
      style="flex-shrink: 0;"
    >
      <template v-if="props.mode !== 'icon'">
        {{ item.label }}
      </template>
    </QuiBaseButton>

    <!-- Shadow More Button -->
    <QuiBaseButton
      v-bind="resolveMoreButtonProps()"
      style="flex-shrink: 0;"
    >
      <template v-if="props.mode !== 'icon'">
        更多
      </template>
    </QuiBaseButton>

    <!-- Shadow Divider -->
    <NDivider vertical />
  </div>
</template>
