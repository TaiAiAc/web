import type { MenuOption } from 'naive-ui'

type AnyMenuOption = MenuOption & { key?: string | number, children?: AnyMenuOption[] }

// 查找指定 key 的菜单节点
export function findNodeByKey(options: AnyMenuOption[], key: string | number): AnyMenuOption | null {
  const stack: AnyMenuOption[] = [...(options || [])]
  while (stack.length) {
    const n = stack.pop() as AnyMenuOption
    if (n?.key === key)
      return n
    if (Array.isArray(n?.children))
      stack.push(...n.children!)
  }
  return null
}

// 返回从当前节点出发的第一个叶子节点
export function findFirstLeaf(node: AnyMenuOption | null | undefined): AnyMenuOption | null {
  let cur = node ?? null
  while (cur && Array.isArray(cur.children) && cur.children.length) {
    cur = cur.children![0]
  }
  return cur ?? null
}

/** 解析 activeKey 对应的末端（叶子）key */
export function resolveLeafKeyFromMenu(options: AnyMenuOption[], activeKey: string | number): string {
  const node = findNodeByKey(options, activeKey)
  const leaf = findFirstLeaf(node)
  const k = leaf?.key
  return typeof k === 'string' ? k : k != null ? String(k) : ''
}

/** 从子节点 key 解析顶层父级 key */
export function resolveTopParentKeyFromMenu(options: AnyMenuOption[], childKey: string | number): string {
  const stack: Array<{ node: AnyMenuOption, topKey: string | number | undefined }> = []
  for (const o of options || []) stack.push({ node: o as AnyMenuOption, topKey: o.key })
  while (stack.length) {
    const { node, topKey } = stack.pop()!
    if (node?.key === childKey) {
      return typeof topKey === 'string' ? topKey : topKey != null ? String(topKey) : ''
    }
    if (Array.isArray(node?.children)) {
      for (const c of node.children!) stack.push({ node: c, topKey })
    }
  }
  return '/'
}

// 判断 key 是否属于顶层菜单
export function isTopLevelKey(options: AnyMenuOption[], key: string | number): boolean {
  const topKeys = (options || []).map(o => o.key)
  const ks = topKeys.filter(k => k != null).map(k => (typeof k === 'string' ? k : String(k)))
  const target = typeof key === 'string' ? key : String(key)
  return ks.includes(target)
}

// 判断 key 是否为叶子（无子节点）
export function isLeafKey(options: AnyMenuOption[], key: string | number): boolean {
  const node = findNodeByKey(options, key)
  return !!node && (!Array.isArray(node.children) || node.children.length === 0)
}

/**
 * 从 activeKey 解析出主菜单与子菜单的键
 *
 * 解析传入的活跃键在菜单树中的位置，并分别返回顶层父级的 key（主菜单）
 * 与该分支上的末端叶子 key（子菜单）。
 *
 * @param options - 菜单树，需包含 `key` 与可选的 `children`
 * @param activeKey - 当前激活的菜单键（路径）
 * @returns 返回对象 `{ mainKey, subKey }`，可能为 `null` 值
 * @throws {TypeError} 当 `options` 非数组或 `activeKey` 非字符串/数字时在编译期提示
 *
 * @example
 * ```ts
 * const { mainKey, subKey } = resolveMainSubFromActive(menuOptions, '/dashboard/analysis')
 * ```
 *
 * @remarks
 * - mainKey 与 subKey 均进行字符串化处理，确保比较与 includes 一致性
 *
 * @security
 * - 纯函数，无副作用
 *
 * @performance
 * - O(n) 遍历一次菜单树
 */
export function resolveMainSubFromActive(
  options: AnyMenuOption[],
  activeKey: string | number
): { mainKey: string | null, subKey: string | null } {
  const mainKey = resolveTopParentKeyFromMenu(options, activeKey)
  const subKey = resolveLeafKeyFromMenu(options, activeKey)
  return { mainKey, subKey }
}

/**
 * 合并主/子菜单键为最终 activeKey
 *
 * 当存在子菜单键时优先返回子菜单键；否则返回主菜单分支上的第一个叶子键，
 * 若主菜单键也不存在则返回 `null`。
 *
 * @param options - 菜单树，需包含 `key` 与可选的 `children`
 * @param mainKey - 顶层父级 key（主菜单）
 * @param subKey - 末端叶子 key（子菜单）
 * @returns 最终用于路由跳转的 activeKey（字符串）或 `null`
 * @throws {TypeError} 当参数类型不符合预期在编译期提示
 *
 * @example
 * ```ts
 * const active = resolveActiveKeyFromPair(menuOptions, '/dashboard', '/dashboard/analysis')
 * ```
 *
 * @remarks
 * - 若 `subKey` 不存在，将尝试从 `mainKey` 分支解析第一个叶子以保证跳转到可达页面
 *
 * @security
 * - 纯函数，无副作用
 *
 * @performance
 * - O(n)（在需要从 `mainKey` 分支解析叶子时）
 */
export function resolveActiveKeyFromPair(
  options: AnyMenuOption[],
  mainKey: string | number | null | undefined,
  subKey: string | number | null | undefined
): string | null {
  const s = subKey == null ? null : (typeof subKey === 'string' ? subKey : String(subKey))
  if (s)
    return s
  const m = mainKey == null ? null : (typeof mainKey === 'string' ? mainKey : String(mainKey))
  if (!m)
    return null
  return resolveLeafKeyFromMenu(options, m) ?? m
}

/**
 * 递归更新菜单树的每个节点
 *
 * 对传入的菜单树做一次深度遍历，并对每个节点应用 `updater`，返回新的树结构。
 * 该方法默认以不可变方式工作：不会修改原始节点引用，而是为每个节点创建浅拷贝并递归重建 children。
 *
 * @param options - 菜单树数组（MenuOption[]），允许为空数组
 * @param updater - 节点更新函数，接收当前节点并返回更新后的节点
 * @returns 新的菜单树数组（保持树形结构）
 *
 * @throws {TypeError} 当 updater 不是函数时抛出
 *
 * @example
 * ```ts
 * const next = updateMenuTree(menuOptions, (item) => {
 *   if (typeof item.key === 'string')
 *     return { ...item, key: item.key.replace('/old', '/new') }
 *   return item
 * })
 * ```
 */
export function updateMenuTree(
  options: AnyMenuOption[],
  updater: (item: AnyMenuOption) => AnyMenuOption
): AnyMenuOption[] {
  if (typeof updater !== 'function')
    throw new TypeError('updater must be a function')

  const walk = (list: AnyMenuOption[]): AnyMenuOption[] => {
    return (list || []).map((raw) => {
      const nextChildren = Array.isArray(raw?.children) ? walk(raw.children!) : undefined
      const cloned: AnyMenuOption = nextChildren
        ? { ...(raw as AnyMenuOption), children: nextChildren }
        : { ...(raw as AnyMenuOption) }
      return updater(cloned)
    })
  }

  return walk(options || [])
}
