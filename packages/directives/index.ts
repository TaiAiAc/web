import type { App } from 'vue'
import type { ClickOutsideValue } from './src/clickOutside'
import type { CopyOptions } from './src/copy'
import type { DebounceOptions } from './src/debounce'
import type { LazyOptions } from './src/lazy'
import type { LoadingOptions } from './src/loading'
import type { PermissionOptions } from './src/permission'
import type { ThrottleOptions } from './src/throttle'
import type { WatermarkValue } from './src/watermark'
import clickOutside from './src/clickOutside'
import copy from './src/copy'
import debounce from './src/debounce'
import ellipsis from './src/ellipsis'
import intersecting from './src/intersecting'
import lazy, { installLazyOptions } from './src/lazy'
import loading from './src/loading'
import permission, { installPermissions, providePermissions } from './src/permission'
import throttle from './src/throttle'
import watermark from './src/watermark'

export { clickOutside, copy, debounce, ellipsis, installPermissions, intersecting, lazy, loading, permission, providePermissions, throttle, watermark }

export interface DirectivesInstallOptions {
  lazy?: LazyOptions
}

export default {
  /**
   * 函数：install
   * 作用：注册所有指令，并支持全局传入 v-lazy 默认配置
   */
  install: (app: App, options?: DirectivesInstallOptions) => {
    app.directive(loading.name, loading.directive)
    app.directive(ellipsis.name, ellipsis.directive)
    app.directive(intersecting.name, intersecting.directive)
    app.directive(throttle.name, throttle.directive)
    app.directive(debounce.name, debounce.directive)
    app.directive(copy.name, copy.directive)
    app.directive(lazy.name, lazy.directive)
    app.directive(clickOutside.name, clickOutside.directive)
    app.directive(watermark.name, watermark.directive)
    app.directive(permission.name, permission.directive)

    if (options?.lazy)
      installLazyOptions(app, options.lazy)
  }
}

/**
 * Vue 指令的基础类型接口
 * 包含所有指令共有的属性
 */
export interface BaseDirectiveType<T = any> {
  /**
   * 指令的值
   */
  value?: T
  /**
   * 指令的修饰符
   */
  modifiers: Record<string, boolean>
  /**
   * 指令的旧值
   */
  oldValue?: T
  /**
   * 指令的参数
   */
  arg?: string
}

/**
 * 复制指令类型
 * @example
 * // 基础用法
 * v-copy="'要复制的文本'"
 *
 * // 配置对象用法
 * v-copy="{
 *   text: '要复制的文本',
 *   onSuccess: () => console.log('复制成功'),
 *   successText: '已复制'
 * }"
 */
export interface CopyDirectiveType extends BaseDirectiveType<string | CopyOptions> {}

/**
 * 加载指令类型
 * @example
 * // 基础用法
 * v-loading="true"
 *
 * // 配置对象用法
 * v-loading="{
 *   show: true,
 *   text: '加载中...',
 *   background: 'rgba(0, 0, 0, 0.7)'
 * }"
 */
export interface LoadingDirectiveType extends BaseDirectiveType<boolean | LoadingOptions> {}

/**
 * 节流指令类型
 * @example
 * // 基础用法
 * v-throttle="handleClick"
 *
 * // 自定义事件
 * v-throttle:input="handleInput"
 *
 * // 配置对象用法
 * v-throttle="{
 *   handler: handleClick,
 *   options: { wait: 500, leading: true }
 * }"
 */
export interface ThrottleDirectiveType extends BaseDirectiveType<(event: Event) => void | { handler: (event: Event) => void, options?: ThrottleOptions }> {}

/**
 * 防抖指令类型
 * @example
 * // 基础用法
 * v-debounce="handleInput"
 *
 * // 自定义事件
 * v-debounce:input="handleInput"
 *
 * // 配置对象用法
 * v-debounce="{
 *   handler: handleInput,
 *   options: { wait: 300, immediate: true }
 * }"
 */
export interface DebounceDirectiveType extends BaseDirectiveType<(event: Event) => void | { handler: (event: Event) => void, options?: DebounceOptions }> {}

/**
 * 图片懒加载指令类型
 * @example
 * // 基础用法
 * v-lazy="{ loading: '/loading.gif', error: '/error.jpg' }"
 *
 * // 带回调函数
 * v-lazy="{
 *   loading: '/loading.gif',
 *   error: '/error.jpg',
 *   onLoad: () => console.log('加载成功')
 * }"
 */
export interface LazyDirectiveType extends BaseDirectiveType<LazyOptions> {}

/**
 * 水印指令类型
 * @example
 * // 基础用法
 * v-watermark="'水印文本'"
 *
 * // 配置对象用法
 * v-watermark="{
 *   text: '水印文本',
 *   fontSize: '16px',
 *   color: 'rgba(0, 0, 0, 0.1)'
 * }"
 */
export interface WatermarkDirectiveType extends BaseDirectiveType<WatermarkValue> {}

/**
 * 文本省略指令类型
 * @example
 * // 单行省略
 * v-ellipsis="1"
 *
 * // 多行省略
 * v-ellipsis="3"
 */
export interface EllipsisDirectiveType extends BaseDirectiveType<number> {}

/**
 * 元素交叉观察指令类型
 * @example
 * // 基础用法
 * v-intersecting="handleIntersect"
 *
 * // 仅在显示时触发
 * v-intersecting:show="handleShow"
 *
 * // 仅在隐藏时触发
 * v-intersecting:hide="handleHide"
 */
export interface IntersectingDirectiveType extends BaseDirectiveType<(isIntersecting: boolean) => void> {}

/**
 * 点击外部指令类型
 * @example
 * // 基础用法
 * v-click-outside="handleClickOutside"
 *
 * // 配置对象用法
 * v-click-outside="{
 *   handler: handleClickOutside,
 *   immediate: true
 * }"
 */
export interface ClickOutsideDirectiveType extends BaseDirectiveType<ClickOutsideValue> {}

/**
 * 权限指令类型
 * @example
 * // 字符串：单一权限码
 * v-permission="'sys:user:add'"
 *
 * // 数组：多个权限码
 * v-permission="['sys:user:add','sys:user:edit']"
 *
 * // 对象：组合配置（codes/mode/effect）
 * v-permission="{ codes: ['sys:user:add'], mode: 'any', effect: 'disable' }"
 */
export interface PermissionDirectiveType extends BaseDirectiveType<string | string[] | PermissionOptions> {}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    vCopy: CopyDirectiveType
    vLoading: LoadingDirectiveType
    vThrottle: ThrottleDirectiveType
    vDebounce: DebounceDirectiveType
    vLazy: LazyDirectiveType
    vWatermark: WatermarkDirectiveType
    vEllipsis: EllipsisDirectiveType
    vIntersecting: IntersectingDirectiveType
    vClickOutside: ClickOutsideDirectiveType
    vPermission: PermissionDirectiveType
  }

  export interface GlobalDirectives {
    copy: CopyDirectiveType
    loading: LoadingDirectiveType
    throttle: ThrottleDirectiveType
    debounce: DebounceDirectiveType
    lazy: LazyDirectiveType
    watermark: WatermarkDirectiveType
    ellipsis: EllipsisDirectiveType
    intersecting: IntersectingDirectiveType
    clickOutside: ClickOutsideDirectiveType
    permission: PermissionDirectiveType
  }
}

export { installLazyOptions, LazyOptionsKey } from './src/lazy'
/**
 * 新增导出：权限注入 Key，便于文档组件读取当前权限集合
 */
export { PermissionsKey } from './src/permission'
