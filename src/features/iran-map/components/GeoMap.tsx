import { geoIdentity, geoPath } from 'd3-geo'
import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent } from 'react'
import type { CityLocation, MapCollection, MapFeatureProperties } from '../model/map.types'
import type { RegionMetric } from '../model/metric.types'
import { defaultMapAppearance, type MapAppearance } from '../model/customization'
import { OsmTileLayer } from './OsmTileLayer'
import './water.css'
import './custom-map-theme.css'
import './osm.css'
import './metric.css'
import './city-layer.css'

interface Props { data: MapCollection; selectedId?: string; onSelect: (id: string) => void; onOpen: (region: MapFeatureProperties) => void; onHover: (region: MapFeatureProperties | null, point?: { x: number; y: number }) => void; onCityHover?: (city: CityLocation | null, point?: { x: number; y: number }) => void; appearance?: MapAppearance; ariaLabel?: string; showOsmBasemap?: boolean; metricValues?: ReadonlyMap<string, number>; cities?: readonly CityLocation[]; listenForMetrics?: boolean; exportId?: string }
export function GeoMap({ data, selectedId, onSelect, onOpen, onHover, onCityHover, appearance, ariaLabel = 'نقشهٔ تعاملی تقسیمات کشوری ایران', showOsmBasemap = false, metricValues, cities = [], listenForMetrics = true, exportId }: Props) {
  const width = 900; const height = 620
  const theme = { ...defaultMapAppearance, ...appearance }
  const style = { '--region-fill': theme.regionFill, '--region-hover': theme.regionHoverFill, '--region-selected': theme.regionSelectedFill, '--region-border': theme.borderColor, '--water-label': theme.waterColor } as CSSProperties
  const projection = useMemo(() => geoIdentity().reflectY(true).fitExtent([[28, 28], [width - 28, height - 28]], data), [data])
  const path = useMemo(() => geoPath(projection), [projection]); const caspian = projection([51.8, 38.5]); const gulf = projection([50.4, 27.3])
  const [localMetrics, setLocalMetrics] = useState<ReadonlyMap<string, number>>(() => new Map((listenForMetrics ? (window as typeof window & { __iranMapMetrics?: RegionMetric[] }).__iranMapMetrics ?? [] : []).map((record) => [record.regionId, record.value])))
  const hover = (event: PointerEvent<SVGPathElement>, region: MapFeatureProperties) => onHover(region, { x: event.clientX, y: event.clientY })
  useEffect(() => { if (!listenForMetrics) return; const sync = (event: Event) => { const records = (event as CustomEvent<RegionMetric[]>).detail; setLocalMetrics(new Map(records.map((record) => [record.regionId, record.value]))) }; sync({ detail: (window as typeof window & { __iranMapMetrics?: RegionMetric[] }).__iranMapMetrics ?? [] } as CustomEvent<RegionMetric[]>); window.addEventListener('iran-map:metrics', sync); return () => window.removeEventListener('iran-map:metrics', sync) }, [listenForMetrics])
  const values = metricValues ?? localMetrics
  const maximum = Math.max(...values.values(), 1)
  const metricColors = useMemo(() => new Map([...values].map(([id, value]) => [id, `hsl(${210 - Math.round(value / maximum * 170)} 68% ${74 - Math.round(value / maximum * 28)}%)`])), [values, maximum])

  const verifiedCities = cities.filter((city) => city.latitude !== null && city.longitude !== null && city.coordinateStatus !== 'unresolved')
  return <svg className="geo-map" data-map-export-id={exportId} style={style} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" shapeRendering="geometricPrecision" role="group" aria-label={ariaLabel}>
    <g>
      {showOsmBasemap && <OsmTileLayer data={data} project={(longitude, latitude) => projection([longitude, latitude]) ?? [0, 0]} />}{theme.showWaterLabels && <><text className="water-label" x={caspian?.[0]} y={caspian?.[1]}>دریای خزر</text><text className="water-label" x={gulf?.[0]} y={gulf?.[1]}>خلیج فارس</text></>}
      <g>{data.features.map((region) => { const value = values.get(region.properties.id); const centroid = path.centroid(region); const fill = metricColors.get(region.properties.id); return <g key={region.properties.id}><path style={fill ? { fill } : undefined} d={path(region) ?? undefined} data-region-id={region.properties.id} data-region-level={region.properties.level} aria-label={region.properties.nameFa} role="button" tabIndex={0} className={selectedId === region.properties.id ? 'selected' : ''} onPointerEnter={(event) => hover(event, region.properties)} onPointerLeave={() => onHover(null)} onFocus={() => onHover(region.properties)} onBlur={() => onHover(null)} onClick={() => { onSelect(region.properties.id); onOpen(region.properties) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(region.properties.id); onOpen(region.properties) } }} />{value !== undefined && theme.showRegionLabels && <text className="metric-label" x={centroid[0]} y={centroid[1]} style={{ opacity: theme.showRegionLabels ? 1 : 0 }}>{value.toLocaleString('fa-IR')}</text>}</g> })}</g>
      {verifiedCities.map((city) => { const point = projection([city.longitude!, city.latitude!]); return point && <g className="city-marker" key={city.id}><circle cx={point[0]} cy={point[1]} r={city.coordinateStatus === 'verified' ? 4.2 : 3.2} tabIndex={0} role="button" aria-label={`${city.nameFa}، ${city.countyNameFa}`} onPointerEnter={(event) => onCityHover?.(city, { x: event.clientX, y: event.clientY })} onPointerLeave={() => onCityHover?.(null)} onFocus={() => onCityHover?.(city)} onBlur={() => onCityHover?.(null)} />{city.renderLabelDefault && <text x={point[0]} y={point[1] - 7}>{city.nameFa}</text>}</g> })}
    </g>
  </svg>
}
