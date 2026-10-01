import type { MapDataValidationIssue, MapDataValidationResult } from './types.js'

function hasCoordinates(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false
  if (typeof value[0] === 'number') return value.length >= 2 && value.every((item) => typeof item === 'number' && Number.isFinite(item))
  return value.every(hasCoordinates)
}

export function validateMapFeatureCollection(data: unknown): MapDataValidationResult {
  const issues: MapDataValidationIssue[] = []
  if (!data || typeof data !== 'object') return { valid: false, issues: [{ path: '$', message: 'A FeatureCollection object is required.' }] }
  const collection = data as { type?: unknown; features?: unknown }
  if (collection.type !== 'FeatureCollection') issues.push({ path: '$.type', message: 'Expected FeatureCollection.' })
  if (!Array.isArray(collection.features) || collection.features.length === 0) issues.push({ path: '$.features', message: 'At least one feature is required.' })
  const seenIds = new Set<string>()
  if (Array.isArray(collection.features)) collection.features.forEach((feature, index) => {
    const item = feature as { type?: unknown; properties?: { id?: unknown; nameFa?: unknown }; geometry?: { type?: unknown; coordinates?: unknown } }
    const base = `$.features[${index}]`
    if (!item || item.type !== 'Feature') issues.push({ path: base, message: 'Expected a GeoJSON Feature.' })
    const id = item?.properties?.id
    if (typeof id !== 'string' || !id.trim()) issues.push({ path: `${base}.properties.id`, message: 'A non-empty stable region ID is required.' })
    else if (seenIds.has(id)) issues.push({ path: `${base}.properties.id`, message: `Duplicate region ID: ${id}.` })
    else seenIds.add(id)
    if (typeof item?.properties?.nameFa !== 'string' || !item.properties.nameFa.trim()) issues.push({ path: `${base}.properties.nameFa`, message: 'A Persian display name is required.' })
    if (item?.geometry?.type !== 'Polygon' && item?.geometry?.type !== 'MultiPolygon') issues.push({ path: `${base}.geometry.type`, message: 'Geometry must be Polygon or MultiPolygon.' })
    if (!hasCoordinates(item?.geometry?.coordinates)) issues.push({ path: `${base}.geometry.coordinates`, message: 'Geometry coordinates must contain finite longitude/latitude pairs.' })
  })
  return { valid: issues.length === 0, issues }
}
