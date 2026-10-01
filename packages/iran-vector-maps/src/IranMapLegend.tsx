import type { MapColorScale } from './types.js'

export interface IranMapLegendProps { title?: string; minimum?: number; maximum?: number; noDataLabel?: string; colorScale?: MapColorScale }

export function IranMapLegend({ title = 'راهنمای داده', minimum = 0, maximum = 100, noDataLabel = 'بدون داده', colorScale }: IranMapLegendProps) {
  const lowHue = colorScale?.lowHue ?? 210
  const highHue = colorScale?.highHue ?? 45
  const saturation = colorScale?.saturation ?? 64
  const lightness = colorScale?.lightness ?? 58
  const noData = colorScale?.noData ?? '#dce9dd'
  return <aside className="iran-admin-svg-map__legend" aria-label={title}><strong>{title}</strong><div className="iran-admin-svg-map__gradient" style={{ background: `linear-gradient(90deg, hsl(${lowHue} ${saturation}% ${lightness + 17}%), hsl(${highHue} ${saturation}% ${lightness - 8}%))` }} /><div className="iran-admin-svg-map__legend-values"><span>{minimum.toLocaleString('fa-IR')}</span><span>{maximum.toLocaleString('fa-IR')}</span></div><span className="iran-admin-svg-map__no-data"><i style={{ background: noData }} />{noDataLabel}</span></aside>
}
