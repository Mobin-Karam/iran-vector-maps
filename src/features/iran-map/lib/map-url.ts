import type { AdministrativeRegion } from '../model/map.types'
const readableSlug = (region: AdministrativeRegion) => region.slug ?? region.nameEn?.toLowerCase().replace(/\bcounty\b/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') ?? region.id.toLowerCase()
export const findRegionByRouteKey = (key: string | undefined, regions: AdministrativeRegion[], level: AdministrativeRegion['level'], parentId?: string) => {
  if (!key) return undefined
  let decoded = key.toLowerCase()
  try { decoded = decodeURIComponent(key).toLowerCase() } catch { /* Keep malformed links safely unmatched. */ }
  return regions.find((region) => region.level === level && (!parentId || region.parentId === parentId) && [region.slug, region.id, region.code].filter((value): value is string => Boolean(value)).some((value) => value.toLowerCase() === decoded))
}
export const regionUrl = (region: AdministrativeRegion, all: AdministrativeRegion[]) => {
  if (region.level === 'country') return '/map'
  if (region.level === 'province') return `/map/province/${readableSlug(region)}`
  const province = all.find((candidate) => candidate.id === region.parentId)
  return province ? `/map/province/${readableSlug(province)}/county/${readableSlug(region)}` : '/map'
}
