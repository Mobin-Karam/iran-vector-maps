import type { MapCollection } from '../model/map.types'

const mercatorY = (latitude: number) => Math.log(Math.tan(Math.PI / 4 + Math.max(-85, Math.min(85, latitude)) * Math.PI / 360))
const walk = (value: unknown, points: [number, number][]) => { if (!Array.isArray(value)) return; if (typeof value[0] === 'number' && typeof value[1] === 'number') points.push([value[0], value[1]]); else value.forEach((item) => walk(item, points)) }

export function OsmTileLayer({ data, project }: { data: MapCollection; project: (longitude: number, latitude: number) => [number, number] }) {
  const points: [number, number][] = []; data.features.forEach((feature) => { if ('coordinates' in feature.geometry) walk(feature.geometry.coordinates, points) })
  if (!points.length) return null
  const west = Math.min(...points.map(([x]) => x)); const east = Math.max(...points.map(([x]) => x)); const south = Math.min(...points.map(([, y]) => y)); const north = Math.max(...points.map(([, y]) => y))
  const zoom = 5; const count = 2 ** zoom
  const x0 = Math.max(0, Math.floor((west + 180) / 360 * count)); const x1 = Math.min(count - 1, Math.floor((east + 180) / 360 * count))
  const yFor = (latitude: number) => (1 - mercatorY(latitude) / Math.PI) / 2 * count
  const y0 = Math.max(0, Math.floor(yFor(north))); const y1 = Math.min(count - 1, Math.floor(yFor(south)))
  const latFor = (tileY: number) => 180 / Math.PI * Math.atan(Math.sinh(Math.PI * (1 - 2 * tileY / count)))
  const tiles = []; for (let x = x0; x <= x1; x += 1) for (let y = y0; y <= y1; y += 1) tiles.push({ x, y })
  return <g className="osm-tiles" aria-hidden="true">{tiles.map(({ x, y }) => { const [left, top] = project(x / count * 360 - 180, latFor(y)); const [right, bottom] = project((x + 1) / count * 360 - 180, latFor(y + 1)); return <image key={`${x}-${y}`} href={`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`} x={left} y={top} width={right - left} height={bottom - top} preserveAspectRatio="none" /> })}</g>
}
