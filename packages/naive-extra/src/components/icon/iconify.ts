/**
 * 获取所有图标集合
 *
 * 从 Iconify API 获取可用的图标集合列表
 *
 * @returns {Promise<string[]>} 集合前缀列表
 */
export async function getCollections(): Promise<string[]> {
  try {
    const response = await fetch('https://api.iconify.design/collections')
    const data = await response.json()
    return Object.keys(data)
  }
  catch (error) {
    console.error('Failed to fetch collections:', error)
    return []
  }
}

/**
 * 获取指定集合的所有图标名称
 *
 * @param collection - 集合前缀
 * @returns {Promise<string[]>} 图标名称列表
 */
export async function getIconNames(collection: string): Promise<string[]> {
  try {
    const response = await fetch(`https://api.iconify.design/collection?prefix=${collection}`)
    const data = await response.json()

    const names = new Set<string>()

    // 从 uncategorized 获取
    if (data.uncategorized) {
      data.uncategorized.forEach((name: string) => names.add(name))
    }

    // 从 categories 获取
    if (data.categories) {
      Object.values(data.categories).forEach((categoryIcons: any) => {
        categoryIcons.forEach((name: string) => names.add(name))
      })
    }

    // 兜底：如果上面都没找到，尝试从 icons 对象键名获取
    if (names.size === 0 && data.icons) {
      Object.keys(data.icons).forEach(name => names.add(name))
    }

    return Array.from(names).sort()
  }
  catch (error) {
    console.error(`Failed to fetch icons for ${collection}:`, error)
    return []
  }
}

/**
 * 搜索图标
 *
 * @param query - 搜索关键词
 * @returns {Promise<{collection: string, name: string}[]>} 图标列表
 */
export async function searchIcons(query: string): Promise<{ collection: string, name: string }[]> {
  try {
    const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=999`)
    const data = await response.json()
    if (data.icons) {
      return data.icons.map((fullIcon: string) => {
        const [collection, name] = fullIcon.split(':')
        return { collection, name }
      })
    }
    return []
  }
  catch (error) {
    console.error('Failed to search icons:', error)
    return []
  }
}
