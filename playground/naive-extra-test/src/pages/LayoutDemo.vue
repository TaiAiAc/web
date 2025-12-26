<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { DEFAULT_LAYOUT_TYPE, QuiTooltipButton } from '../../../../packages/naive-extra/src'
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

const router = useRouter()

const isCollapsed = computed({
  get: () => collapsed.value,
  set: val => layout.setCollapsed(val)
})
function addDynamic() {
  layout.addRoute({
    path: '/dynamic-example',
    name: 'DynamicExample',
    meta: { title: '动态示例-这是一个很长很长的标题', icon: 'mdi:lightning-bolt', order: 90 },
    component: () => import('../pages/DynamicExample.vue')
  })

  router.push('/dynamic-example')
}

function removeDynamic() {
  const name = 'DynamicExample'
  layout.removeRoute(name)
  router.push('/')
}
</script>

<template>
  <NCard title="布局参数" size="small">
    <NForm label-placement="left" label-width="100">
      <NFormItem label="布局类型">
        <n-flex>
          <QuiTooltipButton v-for="item in DEFAULT_LAYOUT_TYPE" :key="item.name" :tip="item.desc" @click="type = item.type">
            {{ item.name }}
          </QuiTooltipButton>
        </n-flex>
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
  <NCard title="动态路由示例" size="small" class="mt-3">
    <n-button type="primary" @click="addDynamic">
      添加动态路由“动态示例”
    </n-button>
    <n-button class="ml-2" type="error" @click="removeDynamic">
      删除动态路由“动态示例”
    </n-button>
  </NCard>
</template>

<style lang="scss" scoped></style>
