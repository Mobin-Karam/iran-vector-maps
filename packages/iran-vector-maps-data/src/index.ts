export const iranMapDataset = {
  version: '2026-10-01',
  provinces: 31,
  counties: 466,
  source: 'OpenStreetMap-derived boundaries with documented administrative metadata',
  license: 'See DATA_SOURCES.md in the Iran Vector Maps repository.',
} as const

export function iranMapAssetUrl(path: 'manifest.json' | 'regions.json' | 'provinces.topo.json' | `regions/${string}/counties.topo.json`) {
  return `https://mobin-karam.github.io/iran-vector-maps/maps/iran/${path}`
}

export async function fetchIranMapAsset<T>(path: Parameters<typeof iranMapAssetUrl>[0], fetcher: typeof fetch = fetch): Promise<T> {
  const response = await fetcher(iranMapAssetUrl(path))
  if (!response.ok) throw new Error(`Unable to load Iran map asset: ${response.status}`)
  return response.json() as Promise<T>
}
