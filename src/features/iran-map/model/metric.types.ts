export interface RegionMetric {
  regionId: string
  metricId: string
  labelFa: string
  value: number
  unitFa?: string
  source: string
  observedAt?: string
}

export type RegionMetricIndex = ReadonlyMap<string, RegionMetric>
