import { IranAdminSvgMap, type MapFeatureCollection } from 'iran-vector-maps'
import 'iran-vector-maps/styles.css'

const data: MapFeatureCollection = { type: 'FeatureCollection', features: [] }

export default function Index() {
  return <IranAdminSvgMap data={data} emptyState="Return GeoJSON from your Remix loader and pass it to the map." />
}
