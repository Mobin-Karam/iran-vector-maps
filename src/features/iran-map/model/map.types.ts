import type { Feature, FeatureCollection, Geometry } from 'geojson'

export type AdministrativeLevel = 'country' | 'province' | 'county' | 'district' | 'city' | 'rural-district' | 'settlement'
export interface AdministrativeRegion { id: string; code?: string; nameFa: string; nameEn?: string; level: AdministrativeLevel; parentId: string | null; center?: { latitude: number; longitude: number }; source: string; sourceId?: string; geometryFile?: string; children?: Partial<Record<'provinces' | 'counties' | 'districts' | 'cities' | 'ruralDistricts' | 'settlements', number>>; childNames?: Partial<Record<'counties' | 'districts' | 'cities', string[]>> }
export type MapFeatureProperties = { id: string; nameFa: string; nameEn?: string; level: AdministrativeLevel; parentId: string }
export type MapFeature = Feature<Geometry, MapFeatureProperties>
export type MapCollection = FeatureCollection<Geometry, MapFeatureProperties>

export type CityRecordKind = 'city' | 'derived-zone'
export type CityCoordinateStatus = 'matched' | 'alias' | 'promoted' | 'curated' | 'inherited' | 'unresolved'
export type CityCoordinateConfidence = 'high' | 'medium' | 'low' | 'none'
export interface CityCoordinateSource { kind: string; id: string | null; name: string | null; url: string | null; license: string }
export interface IranCityPoint {
  id: string
  nameFa: string
  nameEn: string | null
  slug: string
  provinceId: number
  provinceMapId: string
  provinceFa: string | null
  countyId: number
  countyFa: string | null
  districtId: number
  districtFa: string | null
  latitude: number | null
  longitude: number | null
  recordKind: CityRecordKind
  labelEnabled: boolean
  isProvinceCapital: boolean
  isCountyCenter: boolean
  coordinateStatus: CityCoordinateStatus
  coordinateConfidence: CityCoordinateConfidence
  matchedNameFa: string | null
  coordinateSource: CityCoordinateSource | null
}
export interface IranCitiesDataset {
  version: number
  datasetVersion: string
  country: { id: 'IR'; nameFa: string; nameEn: string }
  coordinateReferenceSystem: string
  counts: { records: number; geolocated: number; labelEnabled: number; unresolved: number; derivedZones: number; provinceCapitals: number }
  licenseNotice: string
  googleMapsUsed: boolean
  cities: IranCityPoint[]
}
