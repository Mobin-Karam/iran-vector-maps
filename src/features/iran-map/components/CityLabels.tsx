import type { IranCityPoint, MapCollection } from '../model/map.types'
import './city-labels.css'

interface Props {
  cities: readonly IranCityPoint[]
  data: MapCollection
  visible?: boolean
  project: (longitude: number, latitude: number) => [number, number] | null
}

export function CityLabels({ cities, data, visible = true, project }: Props) {
  if (!visible || !data.features.length) return null

  const featureLevel = data.features[0]?.properties.level
  const provinceIds = new Set(
    data.features
      .map((feature) => feature.properties.parentId)
      .filter((value): value is string => Boolean(value)),
  )
  const candidates = featureLevel === 'province'
    ? cities.filter((city) => city.isProvinceCapital && city.labelEnabled)
    : featureLevel === 'county'
      ? cities.filter((city) => provinceIds.has(city.provinceMapId) && city.labelEnabled)
      : []

  return <g className="city-label-layer" aria-label="نام شهرها">
    {candidates.map((city) => {
      if (city.latitude === null || city.longitude === null) return null
      const point = project(city.longitude, city.latitude)
      if (!point) return null
      const [x, y] = point
      const className = city.isProvinceCapital ? 'city-label city-label-capital' : 'city-label'
      return <g key={city.id} className={className} data-city-id={city.id} data-coordinate-status={city.coordinateStatus}>
        <title>{city.nameFa}{city.nameEn ? ` · ${city.nameEn}` : ''}</title>
        <circle className="city-label-point" cx={x} cy={y} r={city.isProvinceCapital ? 2.4 : 1.7} />
        <text className="city-label-text" x={x} y={y + (city.isProvinceCapital ? 4.8 : 4)}>{city.nameFa}</text>
      </g>
    })}
  </g>
}
