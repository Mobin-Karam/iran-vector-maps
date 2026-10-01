import type { Feature, FeatureCollection, Geometry } from 'geojson'

export type AdministrativeLevel = 'country' | 'province' | 'county' | 'district' | 'city' | 'rural-district' | 'settlement'
export interface AdministrativeRegion { id: string; code?: string; nameFa: string; nameEn?: string; level: AdministrativeLevel; parentId: string | null; center?: { latitude: number; longitude: number }; source: string; sourceId?: string; geometryFile?: string; children?: Partial<Record<'provinces' | 'counties' | 'districts' | 'cities' | 'ruralDistricts' | 'settlements', number>>; childNames?: Partial<Record<'counties' | 'districts' | 'cities', string[]>> }
export type MapFeatureProperties = { id: string; nameFa: string; nameEn?: string; level: AdministrativeLevel; parentId: string }
export type MapFeature = Feature<Geometry, MapFeatureProperties>
export type MapCollection = FeatureCollection<Geometry, MapFeatureProperties>
