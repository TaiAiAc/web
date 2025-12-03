<script setup lang="ts">
const envStr = JSON.stringify(import.meta.env, null, 2)
const testUrl = import.meta.env.VITE_TESTURL

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
</script>

<template>
  <div>
    <h1>这是子页面</h1>
    <p>测试地址: {{ testUrl }}</p>
    <pre style="white-space: pre-wrap">{{ envStr }}</pre>
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
