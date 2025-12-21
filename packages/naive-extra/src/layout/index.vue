<script lang="ts" setup>
import type { Props } from './props'

const props = withDefaults(defineProps<Props>(), {
  layoutType: 'no-menu',
  inverted: false,
  header: () => ({ height: 56, position: 'static', inverted: false }),
  content: () => ({ position: 'absolute', embedded: false, nativeScrollbar: false }),
  footer: () => ({ height: 48, position: 'static', inverted: false })
})
</script>

<template>
  <NLayout
    :inverted="props.inverted"
    :position="props.content?.position"
    :embedded="props.content?.embedded"
    :native-scrollbar="props.content?.nativeScrollbar"
  >
    <NLayoutHeader
      v-if="props.header"
      :inverted="props.header?.inverted"
      :position="props.header?.position"
      :style="{ height: typeof props.header?.height === 'number' ? `${props.header?.height}px` : props.header?.height }"
    >
      <slot name="header" />
    </NLayoutHeader>

    <NLayoutContent :class="props.content?.contentClass" :style="props.content?.contentStyle">
      <slot />
    </NLayoutContent>

    <NLayoutFooter
      v-if="props.footer"
      :inverted="props.footer?.inverted"
      :position="props.footer?.position"
      :style="{ height: typeof props.footer?.height === 'number' ? `${props.footer?.height}px` : props.footer?.height }"
    >
      <slot name="footer" />
    </NLayoutFooter>
  </NLayout>
</template>
