<script setup lang="ts">
import { PermissionsKey } from '@quiteer/directives'
import { computed, inject } from 'vue'

const permsSet = inject<Set<string> | undefined>(PermissionsKey)

/**
 * 格式化当前注入的权限集合为可读字符串
 * @param set 权限集合（可能未注入）
 * @returns 逗号分隔的权限码字符串；未注入时返回 '无'
 */
function formatPermissions(set?: Set<string>): string {
  return Array.from(set ?? []).join(', ') || '无'
}

/**
 * 计算属性：当前权限集合的展示文本
 * 会根据注入的权限集合变化自动更新
 */
const currentPerms = computed(() => formatPermissions(permsSet))

function handleDeleteClick() {
  console.log('删除用户操作')
}
</script>

<template>
  <div class="card">
    <h3>权限指令示范</h3>

    <p class="desc">
      当前注入的权限：
      <code>{{ currentPerms }}</code>
    </p>

    <n-flex>
      <n-card title="基础：命中则显示，未命中则隐藏（默认效果）">
        <n-p>v-permission="'sys:user:add'"</n-p>
        <n-flex>
          <n-button v-permission="'sys:user:add'" type="primary">
            新增用户（sys:user:add）
          </n-button>
          <n-button v-permission="'sys:user:edit'" type="primary">
            编辑用户（sys:user:edit）
          </n-button>
        </n-flex>
      </n-card>

      <n-card title="任意命中：只要有其中一个权限即可显示">
        <n-p>v-permission.any="['sys:user:add', 'sys:user:edit']</n-p>
        <n-flex>
          <n-button v-permission.any="['sys:user:add', 'sys:user:edit']" type="primary">
            新增或编辑（['sys:user:add', 'sys:user:edit']）
          </n-button>
        </n-flex>
      </n-card>

      <n-card title="全部命中：必须同时拥有两个权限">
        <n-p>v-permission.all="['sys:user:add', 'sys:user:edit']"</n-p>
        <n-flex>
          <n-button v-permission.any="['sys:user:add', 'sys:user:edit']" type="primary">
            新增并编辑（['sys:user:add', 'sys:user:edit']）
          </n-button>
        </n-flex>
      </n-card>

      <n-card title="禁用效果：未授权时不隐藏，而是禁用">
        <n-p>v-permission.disable="'sys:user:delete'"</n-p>
        <n-flex>
          <n-button v-permission.disable="'sys:user:delete1'" type="error" @click="handleDeleteClick">
            删除用户（未授权时禁用）
          </n-button>
        </n-flex>
      </n-card>

      <n-card title="移除效果：remove ｜ hide ">
        <n-p>v-permission:remove="'sys:user:admin'"</n-p>
        <n-flex>
          <n-button v-permission:remove="'sys:user:admin'" type="primary">
            管理员操作（未授权时移除）
          </n-button>
          <n-button v-permission:hide="'sys:user:admin'" type="primary">
            管理员操作（未授权时隐藏）
          </n-button>
        </n-flex>
      </n-card>

      <n-card title="组合效果">
        <n-p>v-permission:remove.any="['sys:user:add', 'sys:user:edit']"</n-p>
        <n-flex>
          <n-button v-permission:disable.any="['sys:user:add', 'sys:user:edit']" type="primary">
            v-permission:disable.any="['sys:user:add', 'sys:user:edit']"
          </n-button>
          <n-button v-permission:disable.any="['sys:user:add1', 'sys:user:edit']" type="primary">
            v-permission:disable.any="['sys:user:add1', 'sys:user:edit']"
          </n-button>
        </n-flex>
      </n-card>
    </n-flex>
  </div>
</template>

<style scoped>
.card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.desc {
  margin-bottom: 12px;
  color: #666;
}

n-button {
  margin-right: 8px;
  margin-bottom: 8px;
}

.is-disabled {
  opacity: 0.6;
}
</style>
