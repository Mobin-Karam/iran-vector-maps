import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { MapCollection } from '../model/map.types'

export const topologyToCollection = (topology: Topology): MapCollection => {
  const object = Object.values(topology.objects)[0]
  if (!object) throw new Error('دادهٔ مرزی معتبر نیست.')
  return feature(topology, object) as MapCollection
}
