'use client'

import { IranAdminSvgMap, type MapFeatureCollection } from 'iran-vector-maps'
import 'iran-vector-maps/styles.css'

const data: MapFeatureCollection = { type: 'FeatureCollection', features: [] }

export default function Page() {
  return <IranAdminSvgMap data={data} emptyState="Load your GeoJSON in a Server Component or route handler, then pass it here." />
}
