export const iranProvinceIds = [
  'IR-00', 'IR-01', 'IR-02', 'IR-03', 'IR-04', 'IR-05', 'IR-06', 'IR-07', 'IR-08', 'IR-09',
  'IR-10', 'IR-11', 'IR-12', 'IR-13', 'IR-14', 'IR-15', 'IR-16', 'IR-17', 'IR-18', 'IR-19',
  'IR-20', 'IR-21', 'IR-22', 'IR-23', 'IR-24', 'IR-25', 'IR-26', 'IR-27', 'IR-28', 'IR-29', 'IR-30',
] as const

export type IranProvinceId = typeof iranProvinceIds[number]
export type IranProvinceAsset = 'counties.topo.json' | 'cities.json'

const baseUrl = 'https://mobin-karam.github.io/iran-vector-maps/maps/iran'

export function isIranProvinceId(value: string): value is IranProvinceId {
  return (iranProvinceIds as readonly string[]).includes(value)
}

export function iranProvinceAssetUrl(provinceId: IranProvinceId, asset: IranProvinceAsset) {
  return asset === 'counties.topo.json'
    ? `${baseUrl}/regions/${provinceId}/counties.topo.json`
    : `${baseUrl}/cities/${provinceId}.json`
}

export function iranProvinceAssets(provinceId: IranProvinceId) {
  return {
    provinceId,
    counties: iranProvinceAssetUrl(provinceId, 'counties.topo.json'),
    cities: iranProvinceAssetUrl(provinceId, 'cities.json'),
  } as const
}

export async function fetchIranProvinceAsset<T>(provinceId: IranProvinceId, asset: IranProvinceAsset, fetcher: typeof fetch = fetch): Promise<T> {
  const response = await fetcher(iranProvinceAssetUrl(provinceId, asset))
  if (!response.ok) throw new Error(`Unable to load ${provinceId} ${asset}: ${response.status}`)
  return response.json() as Promise<T>
}
