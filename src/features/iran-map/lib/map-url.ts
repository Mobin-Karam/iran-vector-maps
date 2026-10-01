import type { AdministrativeRegion } from '../model/map.types'
export const regionUrl = (region: AdministrativeRegion, all: AdministrativeRegion[]) => {
  if (region.level === 'country') return '/map'
  if (region.level === 'province') return `/map/province/${region.id}`
  const province = all.find((candidate) => candidate.id === region.parentId)
  return province ? `/map/province/${province.id}/county/${region.id}` : '/map'
}
