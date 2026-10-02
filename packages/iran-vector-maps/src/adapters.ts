import type { MapValueMap } from './types.js'

export type MapMetricRecord = Readonly<{ regionId: string; value: number }>

/** Converts immutable query results (React Query, SWR, loaders) into map values without mutating input records. */
export function mapValuesFromRecords(records: readonly MapMetricRecord[]): Readonly<Record<string, number>> {
  return Object.freeze(Object.fromEntries(records.filter((record) => record.regionId.trim() && Number.isFinite(record.value)).map((record) => [record.regionId, record.value]))) as Readonly<Record<string, number>>
}

export function mapValueEntries(values: MapValueMap): readonly MapMetricRecord[] {
  const entries = values instanceof Map ? values.entries() : Object.entries(values)
  return Object.freeze([...entries].map(([regionId, value]) => Object.freeze({ regionId, value })))
}
