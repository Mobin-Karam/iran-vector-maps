export type IranMapRegion = {
  id: string
  code?: string
  slug?: string
  nameFa: string
  nameEn?: string
  level: 'country' | 'province' | 'county' | 'district' | 'city' | 'rural-district' | 'settlement'
  parentId: string | null
}

const baseUrl = 'https://mobin-karam.github.io/iran-vector-maps/maps/iran'

export async function fetchIranMapRegions(fetcher: typeof fetch = fetch): Promise<IranMapRegion[]> {
  const response = await fetcher(`${baseUrl}/regions.json`)
  if (!response.ok) throw new Error(`Unable to load Iran map regions: ${response.status}`)
  return response.json() as Promise<IranMapRegion[]>
}

/** Resolve a readable route key, a stable code, or an internal ID to one region. */
export function findIranMapRegion(regions: readonly IranMapRegion[], key: string, level?: IranMapRegion['level'], parentId?: string) {
  let needle = key.toLowerCase()
  try { needle = decodeURIComponent(key).toLowerCase() } catch { /* Keep malformed links safely unmatched. */ }
  return regions.find((region) => (!level || region.level === level) && (!parentId || region.parentId === parentId) && [region.slug, region.code, region.id].filter((value): value is string => Boolean(value)).some((value) => value.toLowerCase() === needle))
}

/** Create the same readable public route used by the Iran Vector Maps demo. */
export function iranMapRegionUrl(region: IranMapRegion, regions: readonly IranMapRegion[]) {
  if (region.level === 'country') return '/map'
  if (region.level === 'province') return `/map/province/${region.slug ?? region.id}`
  const province = regions.find((item) => item.id === region.parentId)
  return province ? `/map/province/${province.slug ?? province.id}/county/${region.slug ?? region.id}` : '/map'
}
