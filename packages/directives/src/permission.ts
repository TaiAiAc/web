import type { App, Directive } from 'vue'
import { getCurrentInstance, inject, provide } from 'vue'

/**
 * 注入 Key，用于在应用层通过 provide 注入权限集合
 */
export const PermissionsKey = Symbol.for('quiteer.permissions')

/**
 * 指令值的类型定义
 * - codes: 权限码（字符串或字符串数组）
 * - mode: 匹配模式，'any' 表示任意一个命中即可，'all' 表示必须全部命中
 * - effect: 效果，'hide' 隐藏元素，'remove' 直接移除元素，'disable' 禁用元素
 */
export interface PermissionOptions {
  codes: string | string[]
  mode?: 'any' | 'all'
  effect?: 'hide' | 'remove' | 'disable'
}

export type PermissionValue = string | string[] | PermissionOptions

/**
 * 便捷安装函数：将当前用户的权限集合注入到应用上下文
 * @param app Vue 应用实例
 * @param perms 权限码集合（字符串可迭代）
 */
export function installPermissions(app: App, perms: Iterable<string>) {
  const set = new Set(perms)
  app.provide(PermissionsKey, set)
  ;(app.config.globalProperties as any).$permissions = set
}

/**
 * 组合式注入权限集合
 *
 * 在组件的 `setup()` 中调用，通过 Composition API 的 `provide` 注入权限集合，作用域为当前组件的子树。
 *
 * @param perms - 权限码集合（字符串可迭代）
 *
 * @example
 * ```ts
 * // 在根组件或布局组件中调用
 * import { providePermissions } from '@quiteer/directives'
 * providePermissions(['sys:user:add','sys:user:edit'])
 * ```
 *
 * @remarks
 * - 与 `installPermissions(app, perms)` 不同：此方式不需要 `app`，但仅对子树生效
 * - 指令内部优先使用 `inject` 获取，故两种注入方式均可被识别
 */
export function providePermissions(perms: Iterable<string>) {
  const set = new Set(perms)
  provide(PermissionsKey, set)
}

/**
 * 获取已注入的权限集合（优先使用 Composition API 的 `inject`）
 *
 * 在指令钩子执行期间，当前组件实例处于激活状态，优先调用 `inject(PermissionsKey)` 获取权限集合；
 * 若由于上下文差异导致 `inject` 返回空，则回退到实例的 `provides` 以及全局属性 `$permissions`。
 *
 * @param instance - 指令绑定所在组件实例
 * @returns 注入的权限集合 `Set<string>`，若未注入则返回 `undefined`
 *
 * @example
 * ```ts
 * const set = getPermissionSet(binding.instance)
 * ```
 *
 * @remarks
 * - 权限集合需通过应用层调用 `installPermissions(app, perms)` 注入
 * - 使用 `Symbol.for` 确保跨模块唯一键
 *
 * @security
 * - 权限码应来自受信任的服务端返回，避免客户端伪造
 */
function getPermissionSet(instance: any): Set<string> | undefined {
  const injected = inject<Set<string> | undefined>(PermissionsKey as any, undefined)
  if (injected)
    return injected

  const internal = instance?.$ ?? getCurrentInstance()
  const provides
    = internal?.appContext?.provides
      ?? internal?.provides
      ?? instance?.appContext?.provides
      ?? instance?.provides
      ?? internal?.root?.appContext?.provides
      ?? internal?.root?.provides
  const byProvide = provides?.[PermissionsKey as any]
  if (byProvide)
    return byProvide as Set<string>
  const globalSet = internal?.appContext?.config?.globalProperties?.$permissions
  return globalSet as Set<string> | undefined
}

/**
 * 将指令值规范化为统一的选项对象
 * @param binding 指令绑定对象
 */
function normalizeOptions(binding: any): PermissionOptions {
  const v = binding.value as PermissionValue
  const mods = binding.modifiers || {}
  const arg = binding.arg as PermissionOptions['effect'] | undefined

  const base: PermissionOptions = typeof v === 'string'
    ? { codes: v }
    : Array.isArray(v)
      ? { codes: v }
      : { codes: v?.codes || [], mode: v?.mode, effect: v?.effect }

  // 修饰符优先：支持 .any / .all、.hide / .remove / .disable
  const mode: PermissionOptions['mode'] = mods.all ? 'all' : mods.any ? 'any' : base.mode || 'any'
  const effect: PermissionOptions['effect']
    = mods.remove
      ? 'remove'
      : mods.hide
        ? 'hide'
        : mods.disable
          ? 'disable'
          : arg || base.effect || 'hide'

  return { codes: base.codes, mode, effect }
}

/**
 * 检查权限是否命中
 * @param set 已注入的权限集合
 * @param codes 需要的权限码（字符串或数组）
 * @param mode 匹配模式：'any'（任意命中）或 'all'（全部命中）
 */
function hasAuth(set: Set<string> | undefined, codes: string | string[], mode: 'any' | 'all'): boolean {
  if (!set)
    return false
  const list = Array.isArray(codes) ? codes : [codes]
  if (list.length === 0)
    return true
  return mode === 'any'
    ? list.some(code => set.has(code))
    : list.every(code => set.has(code))
}

/**
 * 对未授权元素应用效果
 * @param el 目标元素
 * @param effect 效果：'hide' | 'remove' | 'disable'
 */
function applyEffect(el: HTMLElement, effect: PermissionOptions['effect']) {
  if (effect === 'remove') {
    el.parentNode?.removeChild(el)
    return
  }
  if (effect === 'hide') {
    el.style.display = 'none'
    return
  }
  // disable：尽可能禁用交互并设置可访问性标记
  el.setAttribute('aria-disabled', 'true')
  el.setAttribute('disabled', 'true')
  ;(el as any).disabled = true
  el.style.pointerEvents = 'none'
  el.style.cursor = 'not-allowed'
  el.classList.add('is-disabled')
}

/**
 * 恢复元素的可见与交互状态（当权限满足时调用）
 * @param el 目标元素
 */
function restoreEffect(el: HTMLElement) {
  el.style.display = ''
  el.removeAttribute('aria-disabled')
  el.removeAttribute('disabled')
  if ((el as any).disabled)
    (el as any).disabled = false
  el.style.pointerEvents = ''
  el.style.cursor = ''
  el.classList.remove('is-disabled')
}

/**
 * 权限指令：根据用户权限控制元素的可见性与交互性
 * 用法示例：
 * - 基础：v-permission="'sys:user:add'"
 * - 多码任意命中：v-permission.any="['sys:user:add','sys:user:edit']"
 * - 多码全部命中：v-permission.all="['sys:user:add','sys:user:edit']"
 * - 禁用而非隐藏：v-permission.disable="'sys:user:add'"
 * - 直接移除：v-permission:remove="'sys:user:add'"
 */
const directive: Directive<HTMLElement, PermissionValue> = {
  mounted(el, binding) {
    const set = getPermissionSet(binding.instance)
    const opts = normalizeOptions(binding)
    if (opts.mode && !hasAuth(set, opts.codes, opts.mode))
      applyEffect(el, opts.effect)
    else
      restoreEffect(el)
  },
  updated(el, binding) {
    const set = getPermissionSet(binding.instance)
    const opts = normalizeOptions(binding)
    if (opts.mode && !hasAuth(set, opts.codes, opts.mode))
      applyEffect(el, opts.effect)
    else
      restoreEffect(el)
  }
}

export default {
  name: 'permission',
  directive
}
