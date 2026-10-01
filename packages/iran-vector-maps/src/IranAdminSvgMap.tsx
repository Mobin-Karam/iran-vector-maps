import { geoIdentity, geoPath } from 'd3-geo'
import { useMemo, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import type { IranAdminSvgMapProps, MapColorScale, MapRegionProperties } from './types.js'

const defaultFill = '#dce9dd'

function valueFor(values: IranAdminSvgMapProps['values'], id: string) {
  if (!values) return undefined
  return values instanceof Map ? values.get(id) : (values as Readonly<Record<string, number>>)[id]
}

function defaultMetricFill(value: number | undefined, maximum: number, scale?: MapColorScale) {
  if (value === undefined) return scale?.noData
  const ratio = maximum === 0 ? 0 : value / maximum
  const lowHue = scale?.lowHue ?? 210; const highHue = scale?.highHue ?? 45; const saturation = scale?.saturation ?? 64; const lightness = scale?.lightness ?? 58
  return `hsl(${Math.round(lowHue + (highHue - lowHue) * ratio)} ${saturation}% ${lightness + Math.round(17 - ratio * 25)}%)`
}

export function IranAdminSvgMap<P extends MapRegionProperties>({ data, values, selectedId, className, style, ariaLabel = 'نقشهٔ اداری ایران', height = 620, padding = 28, showValues = true, emptyState, colorScale, valueFormatter = (value) => value.toLocaleString('fa-IR'), getFill, onRegionClick, onRegionHover }: IranAdminSvgMapProps<P>) {
  const width = 900
  const [hoveredId, setHoveredId] = useState<string>()
  const projection = useMemo(() => geoIdentity().reflectY(true).fitExtent([[padding, padding], [width - padding, height - padding]], data), [data, height, padding])
  const path = useMemo(() => geoPath(projection), [projection])
  const maximum = Math.max(...data.features.map((feature) => valueFor(values, feature.properties.id) ?? 0), 1)
  const rootStyle = { '--iran-map-fill': colorScale?.noData ?? defaultFill, ...style } as CSSProperties

  const activate = (region: P) => onRegionClick?.(region)
  const keyActivate = (event: KeyboardEvent<SVGPathElement>, region: P) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(region) }
  }
  const pointerEnter = (event: PointerEvent<SVGPathElement>, region: P) => { event.currentTarget.focus({ preventScroll: true }); setHoveredId(region.id); onRegionHover?.(region, { region, clientX: event.clientX, clientY: event.clientY }) }

  if (data.features.length === 0) return <div className="iran-admin-svg-map__empty" role="status">{emptyState ?? 'دادهٔ نقشه برای نمایش وجود ندارد.'}</div>
  return <svg className={`iran-admin-svg-map ${className ?? ''}`} style={rootStyle} viewBox={`0 0 ${width} ${height}`} role="group" aria-label={ariaLabel}>
    {data.features.map((feature) => {
      const region = feature.properties
      const value = valueFor(values, region.id)
      const centroid = path.centroid(feature)
      const fill = getFill?.(region, value, maximum) ?? defaultMetricFill(value, maximum, colorScale)
      const isSelected = selectedId === region.id
      return <g key={region.id} className={isSelected ? 'is-selected' : undefined}>
        <path d={path(feature) ?? undefined} style={fill ? { fill } : undefined} data-region-id={region.id} role="button" tabIndex={0} aria-label={region.nameFa} aria-pressed={isSelected} className={hoveredId === region.id ? 'is-hovered' : undefined} onPointerEnter={(event) => pointerEnter(event, region)} onPointerMove={(event) => onRegionHover?.(region, { region, clientX: event.clientX, clientY: event.clientY })} onPointerLeave={() => { setHoveredId(undefined); onRegionHover?.(null) }} onFocus={() => { setHoveredId(region.id); onRegionHover?.(region) }} onBlur={() => { setHoveredId(undefined); onRegionHover?.(null) }} onClick={() => activate(region)} onKeyDown={(event) => keyActivate(event, region)} />
        {showValues && value !== undefined && <text className="iran-admin-svg-map__value" x={centroid[0]} y={centroid[1]} aria-hidden="true">{valueFormatter(value, region)}</text>}
      </g>
    })}
  </svg>
}
