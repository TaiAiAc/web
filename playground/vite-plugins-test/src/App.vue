<script setup lang="ts">
import { decode } from '@quiteer/vite-plugins/obfuscation'
import { computed, onMounted, ref, watchEffect } from 'vue'

const decodeEnv = computed(() => {
  const env = {} as Record<string, string>
  for (const key in import.meta.env) {
    if (key.startsWith('VITE_')) {
      env[key] = decode(import.meta.env[key])
    }
  }
  return env
})

watchEffect(() => {
  console.log(' import.meta.env :>> ', import.meta.env)
  console.log('decodeEnv: ', decodeEnv.value)
})

console.log('import.meta.env.VITE_BASE_URL: ', import.meta.env.VITE_BASE_URL)

function runConsoleTests(): void {
  console.log('standalone')
  const a = (console.info('inExpr'), 1)
  if ((console.debug('inIf'), false)) {
    console.warn('branch')
  }
  console.error('keep error')
  void a
}

runConsoleTests()

async function getHello() {
  const res = await fetch('/api/hello')
  const data = await res.json()
  return data
}

const hello = ref('')
onMounted(async () => {
  hello.value = await getHello()
  console.log('hello: ', hello.value)
})
</script>53

<template>
  <div>
    <a :href="decodeEnv.VITE_TEST_URL" target="_blank">测试链接</a>
    <h3>import.meta.env</h3>
    <pre v-for="(value, key) in decodeEnv" :key="key">{{ key }}: {{ value }}</pre>
    <h3>获取到的 mock 数据</h3>
    <pre>{{ hello }}</pre>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
