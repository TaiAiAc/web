<script setup lang="ts">
import type { FormSchema } from 'naive-extra'
import type { CascaderProps, SelectProps } from 'naive-ui'
import { QuiSearchBar, useForm } from 'naive-extra'
import { reactive, ref } from 'vue'

const schemas: FormSchema<any>[] = reactive([
  {
    field: 'categoryId',
    label: '类目',
    component: 'NCascader',
    componentProps: {
      options: [],
      checkStrategy: 'child',
      valueField: 'id',
      labelField: 'name',
      childrenField: 'childrenLevelList'
    } as CascaderProps
  },
  {
    field: 'productCode',
    label: '商品编号',
    component: 'NInput'
  },
  {
    field: 'skuName',
    label: 'SKU名称',
    component: 'NInput'
  },
  {
    field: 'title',
    label: '商品标题',
    component: 'NInput'
  },
  {
    field: 'color',
    label: '颜色',
    component: 'NInput'
  },
  {
    field: 'listingStatus',
    label: '上架状态',
    component: 'NSelect',
    componentProps: {
      options: [
        {
          label: '未上架',
          value: 0
        },
        {
          label: '已上架',
          value: 1
        }
      ]
    } as SelectProps
  }
])

/**
 * 通过 useForm 演示如何动态更新下拉选项与组件属性
 */
const {
  setOptions,
  setComponentProps,
  setDefaultValue,
  replaceSchema,
  removeSchema,
  listFields,
  toRulesMap
} = useForm(schemas)

interface SearchBarExpose {
  getFormRef: () => any
  getFieldsValue: () => Record<string, any>
  submit: (e?: Event) => Promise<object | boolean>
  reset: () => Promise<void>
  expandedBar: () => void
  closeBar: () => void
  setSearchData: (data: Record<string, any>) => Promise<void>
}
type QuiSearchBarInstance = InstanceType<typeof QuiSearchBar> & SearchBarExpose
const formRef = ref<QuiSearchBarInstance>()

function getSearchParams() {
  return formRef.value?.getFieldsValue()
}

const result = ref<Record<string, any>>({})
function handleSubmit() {
  result.value = getSearchParams() || {}
}

const showAdvancedButton = ref(true)
const expanded = ref(false)
const submitOnReset = ref(false)

/**
 * 模拟异步获取选项并写入 listingStatus
 */
async function loadListingStatus() {
  const opts = await Promise.resolve([
    { label: '未上架', value: 0 },
    { label: '已上架', value: 1 },
    { label: '已下架', value: 2 }
  ])
  setOptions('listingStatus', opts)
  setComponentProps('listingStatus', { clearable: true, filterable: true })
  setDefaultValue('listingStatus', 1)
}

/**
 * 演示替换某个字段的 schema（把 color 改为下拉）
 */
function replaceColorToSelect() {
  replaceSchema('color', {
    component: 'NSelect',
    componentProps: { options: [
      { label: '黑色', value: 'black' },
      { label: '白色', value: 'white' }
    ] }
  })
}

/**
 * 演示移除某个字段
 */
function removeSkuName() {
  removeSchema('skuName')
}

function setMockSearch() {
  formRef.value?.setSearchData({
    productCode: 'SKU-00001',
    color: 'black'
  })
}

function expand() {
  formRef.value?.expandedBar()
}

function collapse() {
  formRef.value?.closeBar()
}

function reset() {
  formRef.value?.reset()
}

const debugFields = ref<string[]>([])
const debugRules = ref<Record<string, any[]>>({})

function showFields() {
  debugFields.value = listFields()
}

function showRules() {
  debugRules.value = toRulesMap()
}
</script>

<template>
  <n-flex vertical>
    <n-card title="基础搜索栏" size="small">
      <n-space>
        <n-switch v-model:value="showAdvancedButton">
          <template #checked>
            显示折叠按钮
          </template>
          <template #unchecked>
            隐藏折叠按钮
          </template>
        </n-switch>
        <n-switch v-model:value="submitOnReset">
          <template #checked>
            重置后自动提交
          </template>
          <template #unchecked>
            重置后不提交
          </template>
        </n-switch>
        <n-button type="primary" @click="setMockSearch">
          写入示例搜索条件
        </n-button>
        <n-button type="primary" @click="loadListingStatus">
          异步加载上架状态选项
        </n-button>
        <n-button @click="replaceColorToSelect">
          将颜色改为下拉
        </n-button>
        <n-button type="error" @click="removeSkuName">
          移除 SKU 名称
        </n-button>
        <n-button @click="expand">
          展开
        </n-button>
        <n-button @click="collapse">
          收起
        </n-button>
        <n-button type="warning" @click="reset">
          重置
        </n-button>
        <n-button @click="showFields">
          列出字段
        </n-button>
        <n-button @click="showRules">
          导出规则映射
        </n-button>
      </n-space>
      <n-divider />
      <QuiSearchBar
        ref="formRef"
        v-model:expanded="expanded"
        :schemas="schemas"
        :inline="true"
        :show-advanced-button="showAdvancedButton"
        :submit-on-reset="submitOnReset"
        label-width="100"
        submit-button-text="查询"
        reset-button-text="重置"
        @submit="handleSubmit"
        @reset="handleSubmit"
      />
    </n-card>
    <n-card title="提交结果" size="small">
      <n-flex vertical>
        <div>
          <b>字段列表:</b> {{ debugFields }}
        </div>
        <div>
          <b>规则映射:</b> {{ debugRules }}
        </div>
        <div>
          <b>提交数据:</b> {{ result }}
        </div>
      </n-flex>
    </n-card>
  </n-flex>
</template>

<style lang="scss" scoped></style>
