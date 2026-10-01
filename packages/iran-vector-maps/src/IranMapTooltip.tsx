import type { CSSProperties } from 'react'
import type { MapRegionProperties } from './types.js'

export interface IranMapTooltipProps<P extends MapRegionProperties = MapRegionProperties> {
  region: P | null
  value?: number
  position?: { x: number; y: number }
  valueFormatter?: (value: number, region: P) => string
  className?: string
  style?: CSSProperties
}

export function IranMapTooltip<P extends MapRegionProperties>({ region, value, position, valueFormatter = (metric) => metric.toLocaleString('fa-IR'), className, style }: IranMapTooltipProps<P>) {
  if (!region) return null
  const location = position ? { left: position.x + 14, top: position.y + 14 } : undefined
  return <div className={`iran-admin-svg-map__tooltip ${className ?? ''}`} role="status" style={{ ...location, ...style }}><strong>{region.nameFa}</strong>{region.nameEn && <span>{region.nameEn}</span>}{value !== undefined && <b>{valueFormatter(value, region)}</b>}</div>
}
