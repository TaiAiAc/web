<script setup lang="ts">
import { NCard, NForm, NFormItem, NInputNumber, NRadioButton, NRadioGroup, NSwitch } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '../stores/layout'

const layout = useLayoutStore()

const {
  collapsed,
  bordered,
  inverted,
  headerHeight,
  footerHeight,
  siderWidth,
  collapsedWidth,
  type
} = storeToRefs(layout)

const isCollapsed = computed({
  get: () => collapsed.value,
  set: val => layout.setCollapsed(val)
})
</script>

<template>
  <NCard title="布局参数" size="small">
    <NForm label-placement="left" label-width="100">
      <NFormItem label="布局类型">
        <NRadioGroup v-model:value="type">
          <NRadioButton value="left-menu">
            左侧菜单
          </NRadioButton>
          <NRadioButton value="left-mixed">
            左侧混合
          </NRadioButton>
          <NRadioButton value="left-mixed-top-priority">
            左混合-顶优
          </NRadioButton>
          <NRadioButton value="top-menu">
            顶部菜单
          </NRadioButton>
          <NRadioButton value="top-mixed-side-priority">
            顶混合-侧优
          </NRadioButton>
          <NRadioButton value="top-mixed-top-priority">
            顶混合-顶优
          </NRadioButton>
          <NRadioButton value="blank">
            无菜单
          </NRadioButton>
        </NRadioGroup>
      </NFormItem>
      <NFormItem label="显示边框">
        <NSwitch v-model:value="bordered" />
      </NFormItem>
      <NFormItem label="反色样式">
        <NSwitch v-model:value="inverted" />
      </NFormItem>
      <NFormItem label="折叠侧边栏">
        <NSwitch v-model:value="isCollapsed" />
      </NFormItem>
      <NFormItem label="头部高度">
        <NInputNumber v-model:value="headerHeight" :min="40" :max="120" />
      </NFormItem>
      <NFormItem label="底部高度">
        <NInputNumber v-model:value="footerHeight" :min="40" :max="120" />
      </NFormItem>
      <NFormItem label="侧栏宽度">
        <NInputNumber v-model:value="siderWidth" :min="160" :max="360" />
      </NFormItem>
      <NFormItem label="折叠宽度">
        <NInputNumber v-model:value="collapsedWidth" :min="48" :max="120" />
      </NFormItem>
    </NForm>
  </NCard>
</template>

<style lang="scss" scoped></style>
