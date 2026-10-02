import type { AdministrativeRegion, MapCollection } from '../model/map.types'
import { topologyToCollection } from '../lib/geo'
import { validateMapFeatureCollection } from 'iran-vector-maps'

const cache = new Map<string, Promise<unknown>>()
const json = <T,>(path: string) => {
  if (!cache.has(path)) cache.set(path, fetch(`${import.meta.env.BASE_URL}${path}`).then(async (response) => { if (!response.ok) throw new Error(`بارگذاری ${path} ناموفق بود`); return response.json() as Promise<T> }))
  return cache.get(path) as Promise<T>
}
export const getRegions = () => json<AdministrativeRegion[]>('maps/iran/regions.json')
export type IranMapManifest = { datasetVersion: string; generatedAt: string; availableGeometry: { provinces: boolean; counties: string[] }; unavailable: string[] }
export const getManifest = () => json<IranMapManifest>('maps/iran/manifest.json')
export const getGeometry = async (id: string): Promise<MapCollection> => {
  const path = id === 'IR' ? 'maps/iran/provinces.topo.json' : `maps/iran/regions/${id}/counties.topo.json`
  const collection = topologyToCollection(await json(path))
  const validation = validateMapFeatureCollection(collection)
  if (!validation.valid) throw new Error(`دادهٔ نقشه نامعتبر است: ${validation.issues[0]?.message ?? 'خطای نامشخص'}`)
  return collection
}
