<script setup lang="ts">
import { onMounted, ref } from 'vue'

const envStr = JSON.stringify(import.meta.env, null, 2)

const testUrl = import.meta.env.VITE_TEST_URL

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
    <a :href="testUrl" target="_blank">测试链接</a>
    <h3>import.meta.env</h3>
    <pre>{{ envStr }}</pre>
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
