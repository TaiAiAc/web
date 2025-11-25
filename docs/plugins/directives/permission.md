# v-permission 指令示范

本页演示如何在项目中中展示自定义指令 `v-permission`，并详细说明用法与行为。

<script setup lang="ts">
import PermissionDemo from './components/PermissionDemo.vue'
</script>

<ClientOnly>
  <PermissionDemo />
</ClientOnly>

<<< @/plugins/directives/components/PermissionDemo.vue

## v-permission 指令说明

- 功能：根据用户权限控制元素的可见性或交互性。
- 指令值：
  - 字符串：单一权限码，如 `'sys:user:add'`
  - 数组：多个权限码，如 `['sys:user:add','sys:user:edit']`
  - 对象：`{ codes, mode, effect }`
- 修饰符：
  - `any`：任意命中即可，如 `v-permission.any="[...]"`
  - `all`：必须全部命中，如 `v-permission.all="[...]"`
  - `hide`：未授权时隐藏（默认效果）
  - `disable`：未授权时禁用
  - `remove`：未授权时移除
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

> 提示：本页示例的权限集合在 `.vitepress/theme/index.ts` 中通过 `installPermissions` 注入。实际项目请根据登录用户动态生成集合。

## 权限注入方式

- 全局方式（应用根上下文）：适合全局共享的权限集合，一次注入，所有组件均可用。

```ts
import Directives, { installPermissions } from '@quiteer/directives'
import { createApp } from 'vue'

const app = createApp(App)
app.use(Directives)

// 根据当前登录用户动态生成权限码集合
installPermissions(app, [
  'sys:user:list',
  'sys:user:add',
  'sys:user:edit',
  'sys:user:delete'
])
```

- 组合式方式（组件子树作用域）：适合局部或多子树隔离场景，仅对子树生效。

```ts
// 根组件或布局组件 setup 中
import { providePermissions } from '@quiteer/directives'

providePermissions([
  'sys:user:add',
  'sys:user:edit'
])
```

### 差异说明
- `installPermissions(app, perms)`：注入到应用根上下文，全局可 `inject`，指令在任意组件中都能读取到。
- `providePermissions(perms)`：在调用组件的子树中可 `inject`，更灵活，适合局部权限控制或多应用实例。

指令内部优先使用 `inject(PermissionsKey)` 获取权限集合，若未命中再回退到实例 `provides` 与全局属性 `$permissions`，因此两种注入方式均被支持。
