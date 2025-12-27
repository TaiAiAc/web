import * as allIcons from '@iconify/json'

export function getAllCollections(): string[] {
  return Object.keys(allIcons).filter(key => key !== '__esModule')
}

export function getIconNames(collection: string): string[] {
  const collectionData = (allIcons as Record<string, any>)[collection]
  if (!collectionData)
    return []
  return Object.keys(collectionData.icons).sort()
}
