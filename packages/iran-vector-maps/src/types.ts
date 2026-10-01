export type Position = [number, number]
export type PolygonCoordinates = Position[][]
export type MapGeometry = { type: 'Polygon'; coordinates: PolygonCoordinates } | { type: 'MultiPolygon'; coordinates: PolygonCoordinates[] }

export interface MapRegionProperties {
  id: string
  nameFa: string
  nameEn?: string
  level?: string
  parentId?: string | null
  [key: string]: unknown
}

export interface MapFeature<P extends MapRegionProperties = MapRegionProperties> {
  type: 'Feature'
  properties: P
  geometry: MapGeometry
}

export interface MapFeatureCollection<P extends MapRegionProperties = MapRegionProperties> {
  type: 'FeatureCollection'
  features: MapFeature<P>[]
}

export type MapValueMap = ReadonlyMap<string, number> | Record<string, number>

export interface MapRegionInteraction<P extends MapRegionProperties = MapRegionProperties> {
  region: P
  clientX: number
  clientY: number
}

export interface MapColorScale {
  noData?: string
  lowHue?: number
  highHue?: number
  saturation?: number
  lightness?: number
}

export interface IranAdminSvgMapProps<P extends MapRegionProperties = MapRegionProperties> {
  data: MapFeatureCollection<P>
  values?: MapValueMap
  selectedId?: string
  className?: string
  style?: CSSProperties
  ariaLabel?: string
  height?: number
  padding?: number
  showValues?: boolean
  emptyState?: ReactNode
  colorScale?: MapColorScale
  valueFormatter?: (value: number, region: P) => string
  getFill?: (region: P, value: number | undefined, maximum: number) => string | undefined
  onRegionClick?: (region: P) => void
  onRegionHover?: (region: P | null, interaction?: MapRegionInteraction<P>) => void
}

export interface MapDataValidationIssue { path: string; message: string }
export interface MapDataValidationResult { valid: boolean; issues: MapDataValidationIssue[] }
export interface MapCsvParseIssue { row: number; message: string }
export interface MapCsvParseResult { values: Map<string, number>; issues: MapCsvParseIssue[] }
import type { CSSProperties, ReactNode } from 'react'
