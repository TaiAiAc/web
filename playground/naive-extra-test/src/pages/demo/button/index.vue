<script setup lang="ts">
import type { ActionItem } from 'naive-extra'
import { QuiActionButton, QuiBaseButton } from 'naive-extra'
import { useMessage } from 'naive-ui'
import { computed, ref } from 'vue'

const message = useMessage()

// 权限控制演示
const permissionCode = ref('user:edit')

// ActionButton 数据
const tableActions = computed<ActionItem[]>(() => [
  {
    key: 'edit',
    label: '编辑 (有权限)',
    // 权限配置示例：需要 user:edit 权限
    permission: {
      group: [['user:edit'], permissionCode.value]
      // 无权限时：隐藏
    },
    onClick: () => message.info('点击编辑')
  },
  {
    key: 'delete',
    label: '删除 (禁用)',
    permission: {
      group: [['user:delete'], permissionCode.value],
      // 无权限时：禁用
      disabled: true
    },
    popconfirm: {},
    popText: '确认删除此项吗？',
    positiveText: '删！',
    negativeText: '手滑',
    onPositiveClick: () => message.success('已删除')
  },
  {
    key: 'more1',
    label: '更多',
    onClick: () => message.info('更多操作')
  }
])

const manyActions: ActionItem[] = [
  { key: '1', label: '新建', icon: 'carbon:add' },
  { key: '2', label: '编辑', icon: 'carbon:edit' },
  { key: '3', label: '删除', icon: 'carbon:trash-can' },
  { key: '4', label: '查询', icon: 'carbon:search' },
  { key: '5', label: '设置', icon: 'carbon:settings' },
  { key: '6', label: '用户', icon: 'carbon:user' },
  { key: '7', label: '下载', icon: 'carbon:download' },
  { key: '8', label: '上传', icon: 'carbon:upload' }
]

const containerWidth = ref(300)
</script>

<template>
  <n-flex vertical size="large">
    <n-alert type="info" title="组件说明" closable>
      <n-text strong>
        QuiActionButton
      </n-text> 专为表格操作列设计，支持自动折叠、二次确认、权限控制等功能。
      <br>
      <n-text strong>
        QuiBaseButton
      </n-text> 是基础按钮封装，集成了 Tooltip 和 Popconfirm。
    </n-alert>

    <!-- 1. 基础按钮功能 (Moved up) -->
    <n-card title="1. QuiBaseButton 基础能力" size="small">
      <n-flex vertical>
        <n-card title="权限控制 (Permission)" size="small" embedded>
          <n-flex vertical>
            <n-flex align="center">
              <n-text>当前拥有的权限:</n-text>
              <n-radio-group v-model:value="permissionCode">
                <n-radio-button value="user:edit">
                  user:edit
                </n-radio-button>
                <n-radio-button value="user:delete">
                  user:delete
                </n-radio-button>
                <n-radio-button value="none">
                  无权限
                </n-radio-button>
              </n-radio-group>
            </n-flex>
            <n-divider style="margin: 8px 0" />
            <n-flex align="center">
              <QuiBaseButton
                type="primary"
                :permission="{ group: [['user:edit'], permissionCode] }"
              >
                编辑 (仅 user:edit 可见)
              </QuiBaseButton>

              <QuiBaseButton
                type="error"
                :permission="{ group: [['user:delete'], permissionCode], disabled: true }"
              >
                删除 (无 user:delete 则禁用)
              </QuiBaseButton>

              <QuiBaseButton>
                公开按钮
              </QuiBaseButton>
            </n-flex>
          </n-flex>
        </n-card>

        <n-card title="二次确认 (Popconfirm)" size="small" embedded>
          <n-flex align="center">
            <QuiBaseButton
              type="error"
              :popconfirm="{}"
              pop-text="确定删除吗？"
              positive-text="确定"
              negative-text="取消"
              @positive-click="message.success('已删除')"
            >
              删除 (简单配置)
            </QuiBaseButton>

            <QuiBaseButton
              type="warning"
              :popconfirm="{ showIcon: false }"
              pop-text="这是一个危险操作，请谨慎处理！"
              @positive-click="message.warning('操作已执行')"
            >
              自定义配置
            </QuiBaseButton>
          </n-flex>
        </n-card>

        <n-card title="外观与类型" size="small" embedded>
          <n-flex align="center">
            <QuiBaseButton>默认文本</QuiBaseButton>
            <QuiBaseButton type="primary">
              Primary
            </QuiBaseButton>
            <QuiBaseButton type="success" secondary :text="false">
              Success Secondary
            </QuiBaseButton>
            <QuiBaseButton type="error" :text="false">
              Error Solid
            </QuiBaseButton>
            <QuiBaseButton icon="carbon:settings" tooltip="设置" />
          </n-flex>
        </n-card>
      </n-flex>
    </n-card>

    <!-- 2. 表格操作列最佳实践 -->
    <n-card title="2. QuiActionButton - 表格操作列 (推荐)" size="small">
      <template #header-extra>
        <n-tag type="success" size="small">
          mode="text" (默认)
        </n-tag>
      </template>
      <n-flex vertical>
        <n-text depth="3">
          最常用的场景：在表格的操作列中，使用带分割线的文本按钮。内置了分割线逻辑（最后不需要分割线）。
          <br>
          <n-text type="warning">
            尝试切换上方的权限开关，观察下方按钮变化。
          </n-text>
        </n-text>

        <!-- 模拟表格 -->
        <n-table :single-line="false" size="small">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>状态</th>
              <th width="200">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>示例数据 A</td>
              <td>
                <n-tag type="success" size="small">
                  正常
                </n-tag>
              </td>
              <td>
                <QuiActionButton :actions="tableActions" />
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>示例数据 B (折叠)</td>
              <td>
                <n-tag type="warning" size="small">
                  异常
                </n-tag>
              </td>
              <td>
                <QuiActionButton :actions="manyActions" :max="3" />
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-flex>
    </n-card>

    <!-- 3. 操作组模式展示 -->
    <n-card title="3. QuiActionButton - 其他模式" size="small">
      <n-flex vertical size="large">
        <n-card size="small" embedded title="1. 响应式折叠">
          <n-flex align="center" style="margin-bottom: 12px">
            <span>容器宽度: {{ containerWidth }}px</span>
            <n-slider v-model:value="containerWidth" :min="100" :max="600" style="width: 200px" />
          </n-flex>
          <div :style="{ width: `${containerWidth}px`, border: '1px dashed #ccc', padding: '8px', transition: 'width 0.3s' }">
            <QuiActionButton
              :actions="manyActions"
              responsive
              mode="text"
            />
          </div>
        </n-card>

        <n-grid :cols="2" :x-gap="12">
          <n-gi>
            <n-card size="small" embedded title="2. 纯图标模式 (mode='icon')">
              <QuiActionButton :actions="manyActions" mode="icon" :max="5" />
            </n-card>
          </n-gi>
          <n-gi>
            <n-card size="small" embedded title="3. 图标+文字 (mode='icon-text')">
              <QuiActionButton :actions="tableActions" mode="icon-text" />
            </n-card>
          </n-gi>
          <n-gi>
            <n-card size="small" embedded title="4. 按钮模式 (mode='button')">
              <QuiActionButton :actions="tableActions" mode="button" :show-divider="false" />
            </n-card>
          </n-gi>
          <n-gi>
            <n-card size="small" embedded title="5. 次要按钮 (mode='secondary')">
              <QuiActionButton :actions="tableActions" mode="secondary" :show-divider="false" />
            </n-card>
          </n-gi>
        </n-grid>
      </n-flex>
    </n-card>
  </n-flex>
</template>

<style lang="scss" scoped></style>
