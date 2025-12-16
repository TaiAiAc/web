# v-permission 指令示范

本页演示如何在项目中中展示自定义指令 `v-permission`，并详细说明用法与行为。

::: tip 提示
建议绑定在单根真实 dom 元素上，直接绑定到非原生 html 元素时，插件可能无法正常工作，建议仅在原生 html 元素上使用。
目前已知不会挂载指令的元素有：
- `template`
- `el-dropdown-item`
:::

## 权限注入方式

- 适合全局共享的权限集合，一次注入，所有组件均可用。

```ts
import Directives from '@quiteer/directives'
import { createApp } from 'vue'

const app = createApp(App)
app.use(Directives, {
        permission: []
      })
```

- 权限修改为响应式 ， 权限修改界面不刷新即可重新鉴权

```ts
import { getPermissionManager } from '@quiteer/directives'

const permissionManager = getPermissionManager()
permissionManager.addPermissions([
  'sys:user:list',
  'sys:user:add',
  'sys:user:edit',
  'sys:user:delete'
])
```


<script setup lang="ts">
import PermissionDemo from './components/PermissionDemo.vue'
</script>

<ClientOnly>
  <PermissionDemo />
</ClientOnly>


<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/PermissionDemo.vue

</details>

## v-permission 指令说明

- 功能：根据用户权限控制元素的可见性或交互性。
- 指令值：
  | 模式 | 示例 | 说明 |
  |------|------|------|
  | 字符串 | `` 'sys:user:add' `` | 单一权限码，元素在用户拥有该权限时显示 |
  | 数组 | `` ['sys:user:add', 'sys:user:edit'] `` | 多个权限码，默认为 **“或”关系**（满足任一即可） |
  | 对象 | `` { codes: ['sys:user:add'], mode: 'and' \| 'or', effect: 'show' \| 'hide' } `` | 高级配置：<br>- `codes`：权限码列表<br>- `mode`：校验逻辑，
- 修饰符：
  | 名称 | 类型 | 用法示例 | 说明 |
  |------|------|----------|------|
  | `` any `` | 校验模式 | `` v-permission.any="['a', 'b']" `` | 权限码列表中 **任意一个匹配即授权通过**（等价于 `mode: 'or'`） |
  | `` all `` | 校验模式 | `` v-permission.all="['a', 'b']" `` | 权限码列表 **必须全部匹配才授权通过**（等价于 `mode: 'and'`） |
  | `` hide `` | 未授权效果 | `` v-permission.hide="['a']" `` | 无权限时 **隐藏元素**（`display: none`），默认行为 |
  | `` disable `` | 未授权效果 | `` v-permission.disable="['a']" `` | 无权限时 **禁用元素**（如添加 `disabled` 或 `pointer-events: none`） |
  | `` remove `` | 未授权效果 | `` v-permission.remove="['a']" `` | 无权限时 **从 DOM 中完全移除元素**（不渲染） |
- 参数：
  - 可用 `:hide` / `:disable` / `:remove`
  - 指定效果 `v-permission:remove="'sys:user:add'"`

### 代码示例

```vue
<!-- 任意命中 -->
<button v-permission.any="['sys:user:add','sys:user:edit']">
新增或编辑
</button>

<!-- 全部命中 -->
<button v-permission.all="['sys:user:add','sys:user:edit']">
新增并编辑
</button>

<!-- 禁用（未授权时） -->
<button v-permission.disable="'sys:user:delete'">
删除用户
</button>

<!-- 移除（未授权时） -->
<button v-permission:remove="'sys:user:admin'">
管理员操作
</button>
```

## 基础用法（默认隐藏）

- 功能：未授权时隐藏元素，授权则显示
- 示例：`'sys:user:add'` 已授权、`'sys:user:edit'` 未授权

<details>
  <summary>查看代码</summary>

```vue
<!-- 命中则显示 -->
<button v-permission="'sys:user:add'">
新增用户（有权限）
</button>

<!-- 未命中则隐藏 -->
<button v-permission="'sys:user:edit'">
编辑用户（无权限，默认隐藏）
</button>
```
</details>

## 任意命中（any）

- 功能：只要命中其中一个权限码即可显示
- 示例：当前注入有 `'sys:user:add'`，无 `'sys:user:edit'`

<details>
  <summary>查看代码</summary>

```vue
<button v-permission.any="['sys:user:add','sys:user:edit']">
新增或编辑（任意命中）
</button>
```
</details>

## 全部命中（all）

- 功能：必须同时拥有多个权限码才显示
- 示例：当前注入仅 `'sys:user:add'`，缺少 `'sys:user:edit'`，因此不显示

<details>
  <summary>查看代码</summary>

```vue
<button v-permission.all="['sys:user:add','sys:user:edit']">
新增并编辑（全部命中）
</button>
```
</details>

## 禁用效果（disable）

- 功能：未授权时不隐藏，而是禁用交互（添加 `aria-disabled`、`pointer-events: none` 等）
- 示例：删除按钮在未授权时禁用

<details>
  <summary>查看代码</summary>

```vue
<button v-permission.disable="'sys:user:delete'">
删除用户（未授权时禁用）
</button>
```
</details>

## 移除效果（remove）

- 功能：未授权时直接从 DOM 中移除
- 示例：管理员操作在未授权时不渲染

<details>
  <summary>查看代码</summary>

```vue
<button v-permission:remove="'sys:user:admin'">
管理员操作（未授权时移除）
</button>
```
</details>

## 对象值（codes/mode/effect）

- 功能：通过对象统一配置权限码、匹配模式和效果
- 示例：全部命中且未授权时禁用

<details>
  <summary>查看代码</summary>

```vue
<button
  v-permission="{
    codes: ['sys:user:add','sys:user:edit'],
    mode: 'all',
    effect: 'disable'
  }"
>
  组合配置（全部命中且未授权时禁用）
</button>
```
</details>

## 修饰符与参数优先级

- 修饰符优先（`.any`/`.all` 与 `.hide`/`.disable`/`.remove`）
- 参数次之（`:hide`/`:disable`/`:remove`）
- 选项对象最后（`{ mode, effect }`）

<details>
  <summary>查看代码</summary>

```vue
<!-- 修饰符优先：强制 all + remove -->
<button v-permission.all:remove="['sys:user:add','sys:user:edit']">
强制全部命中且未授权时移除
</button>

<!-- 参数优先于对象：效果变为 disable -->
<button v-permission:disable="{ codes: 'sys:user:edit', effect: 'hide' }">
优先级演示（最终禁用）
</button>
```
</details>

---


