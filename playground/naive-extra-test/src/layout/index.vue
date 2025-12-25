<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { QuiLayout } from '../../../../packages/naive-extra/src'
import { useLayoutStore } from '../stores/layout'

const {
  collapsed,
  activeKey,
  menuOptions,
  bordered,
  inverted,
  headerHeight,
  footerHeight,
  siderWidth,
  collapsedWidth,
  type,
  baseRoutes
} = storeToRefs(useLayoutStore())
</script>

<template>
  <div style="display: grid; grid-template-columns: 360px 1fr; gap: 16px; align-items: start;">
    <QuiLayout
      v-model:is-collapsed="collapsed"
      v-model:active-key="activeKey"
      v-model:inverted="inverted"
      :base-routes="baseRoutes"
      :type="type"
      :bordered="bordered"
      :header-height="headerHeight"
      :footer-height="footerHeight"
      :sider-width="siderWidth"
      :collapsed-width="collapsedWidth"
      :menu-options="menuOptions"
    />
  </div>
</template>

<style lang="scss" scoped></style>
