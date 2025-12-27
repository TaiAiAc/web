import type { ComputedRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { RouteMeta } from './types'
import { computed } from 'vue'

export interface RouteNode {
  path: string
  name?: string
  meta?: RouteMeta
  children?: RouteNode[]
}

function joinPath(parent: string, p: string) {
  const full = p?.startsWith('/') ? p : (parent ? `${parent}/${p}` : `/${p}`)
  const single = full.replace(/\/+/g, '/')
  return single.length > 1 && single.endsWith('/') ? single.slice(0, -1) : single
}

function sortRaw(list: RouteRecordRaw[]): RouteRecordRaw[] {
  const getOrder = (r: RouteRecordRaw) => {
    const m = r.meta as RouteMeta | undefined
    const o = m?.order
    const v = typeof o === 'number' ? o : Number(o)
    return Number.isFinite(v) ? v : Number.POSITIVE_INFINITY
  }
  const getTitle = (r: RouteRecordRaw) => {
    const m = r.meta as RouteMeta | undefined
    return String(m?.title ?? r.path.split('/').filter(Boolean).pop() ?? '')
  }
  return [...list].sort((a, b) => {
    const oa = getOrder(a)
    const ob = getOrder(b)
    if (oa !== ob)
      return oa - ob
    return getTitle(a).localeCompare(getTitle(b))
  })
}

export function normalizeAndRedirect(raw: RouteRecordRaw[], parent = ''): RouteRecordRaw[] {
  const childrenSorted = sortRaw(raw)
  return childrenSorted.map((r): RouteRecordRaw => {
    const curPathAbs = joinPath(parent, r.path)
    const kidsRaw = Array.isArray(r.children) ? (r.children as RouteRecordRaw[]) : []
    const kids = kidsRaw.length ? normalizeAndRedirect(kidsRaw, curPathAbs) : undefined
    let redirect = r.redirect as string | undefined
    if (!redirect && kids && kids.length) {
      const idx = kids.find(c => c.path === 'index' || c.path === '')
      const target = idx ?? kids[0]
      redirect = joinPath(curPathAbs, target.path)
    }
    return {
      ...r,
      ...(kids ? { children: kids } : {}),
      ...(redirect ? { redirect } : {})
    } as RouteRecordRaw
  })
}

export function toRouteTree(raw: RouteRecordRaw[], parent = ''): RouteNode[] {
  return raw
    .filter(r => (r.meta as RouteMeta | undefined)?.showInMenu !== false)
    .map<RouteNode>((r) => {
      const meta = r.meta ? { ...(r.meta as RouteMeta) } : undefined
      const abs = joinPath(parent, r.path)
      const children = Array.isArray(r.children) ? toRouteTree(r.children as RouteRecordRaw[], abs) : []
      return { path: abs, name: r.name as string | undefined, meta, children }
    })
}

export function sortRouteTree(tree: RouteNode[]): RouteNode[] {
  const sorted = [...tree].sort((a, b) => {
    const oa = typeof a.meta?.order === 'number' ? (a.meta?.order as number) : Number(a.meta?.order)
    const ob = typeof b.meta?.order === 'number' ? (b.meta?.order as number) : Number(b.meta?.order)
    const av = Number.isFinite(oa) ? oa : Number.POSITIVE_INFINITY
    const bv = Number.isFinite(ob) ? ob : Number.POSITIVE_INFINITY
    if (av !== bv)
      return av - bv
    const at = String(a.meta?.title ?? a.path.split('/').filter(Boolean).pop() ?? '')
    const bt = String(b.meta?.title ?? b.path.split('/').filter(Boolean).pop() ?? '')
    return at.localeCompare(bt)
  })
  return sorted.map(n => ({
    ...n,
    children: n.children ? sortRouteTree(n.children) : []
  }))
}

export function filterRouteTree(tree: RouteNode[], excludePaths: string[] = []): RouteNode[] {
  const norm = (p: string) => {
    const s = p.startsWith('/') ? p : `/${p}`
    const single = s.replace(/\/+/g, '/')
    return single.length > 1 && single.endsWith('/') ? single.slice(0, -1) : single
  }
  const excludes = excludePaths.map(norm)
  const match = (p: string) => {
    const np = norm(p)
    return excludes.some(ex => np === ex || np.startsWith(`${ex}/`))
  }
  return tree
    .filter(n => !match(n.path))
    .map(n => ({
      ...n,
      children: n.children ? filterRouteTree(n.children, excludePaths) : []
    }))
}

export function useRoutesTreeFromRaw(raw: RouteRecordRaw[], option?: { excludePaths?: string[] }): { routesTree: ComputedRef<RouteNode[]> } {
  const normalized = normalizeAndRedirect(raw)
  const baseTree = toRouteTree(normalized)
  const routesTree = computed(() => sortRouteTree(filterRouteTree(baseTree, option?.excludePaths ?? [])))
  return { routesTree }
}
