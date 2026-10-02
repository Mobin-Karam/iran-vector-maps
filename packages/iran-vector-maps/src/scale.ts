import type { MapClassification, MapColorScale } from './types.js'

export function createMapColorScale(values: Iterable<number>, options: MapColorScale = {}) {
  const finite = [...values].filter(Number.isFinite)
  const minimum = options.minimum ?? Math.min(...finite, 0)
  const maximum = options.maximum ?? Math.max(...finite, 1)
  const palette = options.colors ?? []
  const classification: MapClassification = options.classification ?? 'continuous'
  const breaks = options.breaks ?? (classification === 'equal-interval' && palette.length > 1 ? Array.from({ length: palette.length - 1 }, (_, index) => minimum + ((maximum - minimum) * (index + 1)) / palette.length) : [])

  return (value: number | undefined) => {
    if (value === undefined || !Number.isFinite(value)) return options.noData ?? '#dce9dd'
    if (palette.length > 0 && classification !== 'continuous') {
      const index = breaks.findIndex((boundary) => value <= boundary)
      return palette[index < 0 ? palette.length - 1 : Math.min(index, palette.length - 1)]
    }
    const ratio = maximum === minimum ? 0 : Math.max(0, Math.min(1, (value - minimum) / (maximum - minimum)))
    if (palette.length > 1) return palette[Math.min(palette.length - 1, Math.floor(ratio * palette.length))]
    const lowHue = options.lowHue ?? 210; const highHue = options.highHue ?? 45; const saturation = options.saturation ?? 64; const lightness = options.lightness ?? 58
    return `hsl(${Math.round(lowHue + (highHue - lowHue) * ratio)} ${saturation}% ${lightness + Math.round(17 - ratio * 25)}%)`
  }
}
